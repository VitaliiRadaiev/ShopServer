import { injectable, inject } from "inversify";
import 'reflect-metadata';
import { TYPES } from "../types";
import { PrismaService } from "../database/prisma.service";
import { IConfigService } from "../config/config.service.interface";
import { User } from "./user.entity";
import { Admin } from "./admin.entity";
import { UserModel } from "@prisma/client";

@injectable()
export class UsersServices {
    constructor(
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
    ) { }

    async checkUserExist(email: string) {
        return this.prismaService.client.userModel.findFirst({
            where: {
                email
            }
        })
    }

    async validateUser({ email, password }: { email: string, password: string }): Promise<UserModel | null> {
        const user = await this.prismaService.client.userModel.findFirst({
            where: {
                email
            }
        });

        if (!user) return null;

        if(!user?.email || !user?.password) return null;

        const newUser = new User(user.email, user.password);
        const isValidate = await newUser.comparePassword(password);

        return isValidate ? user : null;
    }

    async register(
        id: string,
        data: {
            email: string;
            firstName: string;
            lastName: string;
            password: string;
            phone: string;
        }
    ) {
        const { email, firstName, lastName, password, phone } = data;

        const newUser = new User(email);
        const salt = this.configService.get('SALT');

        await newUser.setPassword(password, Number(salt));

        return this.prismaService.client.userModel.update({
            where: {
                id
            },
            data: {
                isIdentified: true,
                email,
                firstName,
                lastName,
                phone,
                password: newUser.password,
                wishList: {
                    create: {}
                },
                history: {
                    create: {}
                }
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true
            }
        })
    }

    async createUser() {
        const user = await this.prismaService.client.userModel.create({
            data: {
                isIdentified: false,
                basket: {
                    create: {
                        totalPrice: 0
                    }
                },
                lastViewedProductsModel: {
                    create: {}
                }
            }
        });

        return user;
    }

    async getUser(id: string) {
        return this.prismaService.client.userModel.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                isIdentified: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                basket: true,
                wishList: true,
                lastViewedProductsModel: true,
                history: {
                    include: {
                        orders: true
                    }
                }
            },
        })
    }

    async updateUser(id: string, data: { firstName?: string, lastName?: string, phone?: string }) {
        return this.prismaService.client.userModel.update({
            where: {
                id
            },
            data,
            select: {
                id: true,
                isIdentified: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true
            }
        })
    }
    async getUserByEmail(email: string) {
        return this.prismaService.client.userModel.findUnique({
            where: {
                email
            },
            select: {
                id: true,
                isIdentified: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                basket: true,
                wishList: true,
                lastViewedProductsModel: true,
                history: {
                    include: {
                        orders: true
                    }
                }
            },
        })
    }

    async createAdmin(name: string, password: string) {
        const newAdmin = new Admin(name);
        const salt = this.configService.get('SALT');

        await newAdmin.setPassword(password, Number(salt));

        return this.prismaService.client.adminModel.create({ 
            data: {
                name,
                password: newAdmin.password
            }
        })
    }

    async checkAdminExist(name: string) {
        return this.prismaService.client.adminModel.findUnique({
            where: {
                name
            }
        })
    }

    async validateAdmin(name: string, password: string) {
        const admin = await this.prismaService.client.adminModel.findUnique({
            where: {
                name
            }
        });

        if (!admin) return null;

        const newAdmin = new Admin(admin.name, admin.password);
        const isValidate = await newAdmin.comparePassword(password);

        return isValidate ? admin : null;
    }
}


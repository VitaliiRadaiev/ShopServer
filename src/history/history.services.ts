import { injectable, inject } from "inversify";
import 'reflect-metadata';
import { TYPES } from "../types";
import { PrismaService } from "../database/prisma.service";
import { IConfigService } from "../config/config.service.interface";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

@injectable()
export class HistoryServices {
    constructor(
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
    ) { }

    async getHistory(id: string) {
        const history = await this.prismaService.client.historyModel.findUnique({
            where: { userId: id },
            include: {
                orders: {
                    include: {
                        products: {
                            include: {
                                product: {
                                    include: {
                                        images: true
                                    }
                                }
                            }
                        },
                        recipient: true,
                    }
                }
            }
        })
        if (!history) return null;
        return {
            ...history,
            orders: history.orders.reverse()
        }
    }
    async createOrder(userId: string, data: ICreateOrderData, historyId?: string) {
        const basket = await this.prismaService.client.basketModel.findUnique({
            where: {
                userId
            },
            include: {
                products: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                price: true
                            }
                        }
                    }
                }
            }
        })
        if (!basket || !basket.products.length) return null;

        const order = await this.prismaService.client.orderModel.create({
            data: {
                userId,
                historyId,
                createdAt: new Date().toISOString(),
                status: 'processed', //'processed' | 'delivering' | 'canceled' | 'done',
                totalPrice: basket.totalPrice,
                delivery: data.delivery,
                deliveryFullAddress: data.deliveryFullAddress,
                paymentMethod: data.paymentMethod,
                products: {
                    connect: basket.products.map(orderProduct => ({ id: orderProduct.id }))
                },
                recipient: {
                    create: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        phone: data.phone
                    }
                }
            }
        })

        await this.prismaService.client.basketModel.update({
            where: {
                userId
            },
            data: {
                totalPrice: 0,
                products: {
                    set: []
                }
            }
        })

        return order;
    }
    async updateOrder(id: number, data: IUpdateOrderData) {
        const { firstName, lastName, email, phone, ...orderData } = data;
        return this.prismaService.client.orderModel.update({
            where: { id },
            data: {
                ...orderData,
                recipient: {
                    update: {
                        data: {
                            firstName,
                            lastName,
                            email,
                            phone
                        }
                    }
                }
            }
        })
    }
    async getOrders(body: IGetOrdersBody) {
        const { status, count, page } = body;

        let whereOptions: { where?: Prisma.OrderModelWhereInput | undefined } = {
            where: {}
        }
        if (status) {
            whereOptions = {
                where: {
                    ...whereOptions.where,
                    status: {
                        contains: status
                    }
                }
            }
        }

        let options: Prisma.OrderModelFindManyArgs<DefaultArgs> = {
            ...whereOptions,
            take: 50,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                products: {
                    include: {
                        product: {
                            include: {
                                images: true
                            }
                        }
                    }
                },
                recipient: true,
                user: {
                    select: {
                        id: true,
                        isIdentified: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        phone: true
                    }
                }
            }
        }

        if(count) {
            options = {
                ...options,
                take: count
            }

            if(page) {
                options = {
                    ...options,
                    skip: count * (page - 1)
                }
            }
        }

        return {
            items: await this.prismaService.client.orderModel.findMany(options),
            count: await this.prismaService.client.orderModel.count(whereOptions)
        }
    }
    async getOrder(id: number) {
        return this.prismaService.client.orderModel.findFirst({
            where: {
                id
            },
            include: {
                products: {
                    include: {
                        product: {
                            include: {
                                images: true
                            }
                        }
                    }
                },
                recipient: true,
                user: {
                    select: {
                        id: true,
                        isIdentified: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        phone: true
                    }
                }
            }
        });
    }
    async deleteOrder(id: number) {
        const deleted = await this.prismaService.client.orderModel.delete({
            where: { id }
        });

        return !!deleted;
    }
}

interface IGetOrdersBody {
    status?: 'processed' | 'delivering' | 'canceled' | 'done';
    count?: number;
    page?: number;
}

interface ICreateOrderData {
    delivery: string;
    deliveryFullAddress: string;
    paymentMethod: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface IUpdateOrderData {
    status?: string;
    delivery?: string;
    deliveryFullAddress?: string;
    paymentMethod?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
}
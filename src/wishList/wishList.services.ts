import { injectable, inject } from "inversify";
import 'reflect-metadata';
import { TYPES } from "../types";
import { PrismaService } from "../database/prisma.service";
import { IConfigService } from "../config/config.service.interface";

@injectable()
export class WishListServices {
    constructor(
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
    ) { }

    async getWishList(id: string) {
        return this.prismaService.client.wishListModel.findUnique({
            where: {
                userId: id
            },
            include: {
                products: {
                    include: {
                        images: true
                    }
                }
            }
        })
    }

    async addProduct(userId: string, productId: string) {
        return this.prismaService.client.wishListModel.update({
            where: {
                userId
            },
            data: {
                products: {
                    connect: {
                        id: productId
                    }
                }
            },
            include: {
                products: true
            }
        })
    }

    async removeProduct(userId: string, productId: string) {
        return this.prismaService.client.wishListModel.update({
            where: {
                userId
            },
            data: {
                products: {
                    disconnect: {
                        id: productId
                    }
                }
            },
            include: {
                products: true
            },
        })
    }
}

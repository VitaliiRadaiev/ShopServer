import { injectable, inject } from "inversify";
import 'reflect-metadata';
import { TYPES } from "../types";
import { PrismaService } from "../database/prisma.service";
import { IConfigService } from "../config/config.service.interface";
import { OrderProductModel } from "@prisma/client";

@injectable()
export class BasketServices {
    constructor(
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
    ) { }

    async getBasket(id: string) {
        return this.prismaService.client.basketModel.findUnique({
            where: {
                userId: id
            },
            include: {
                products: {
                    select: {
                        id: true,
                        product: {
                            include: {
                                images: true
                            }
                        },
                        count: true,
                        basketId: true
                    }
                }
            }
        })
    }

    async addProduct(userId: string, basketId: string, productId: string) {
        const basket = await this.prismaService.client.basketModel.findUnique({
            where: {
                userId
            },
            include: {
                products: true
            }
        })
        if (!basket) return null;

        const isOrderProductExist = basket.products.find(orderProduct => orderProduct.productCardId === productId);

        if (isOrderProductExist) {
            return basket;
        } else {
            await this.prismaService.client.orderProductModel.create({
                data: {
                    productCardId: productId,
                    basketId,
                    count: 1
                }
            })
            const basket = await this.prismaService.client.basketModel.findUnique({
                where: {
                    userId
                },
                include: {
                    products: {
                        include: {
                            product: true
                        }
                    }
                }
            })
            if (!basket) return null;
            const totalPrice = basket.products.reduce((value: number, productOrder) => {
                return value + (productOrder.count * productOrder.product.price)
            }, 0)

            return await this.prismaService.client.basketModel.update({
                where: {
                    userId
                },
                data: {
                    totalPrice
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
                    }
                }
            })
        }
    }

    async removeOrderProduct(userId: string, id: string) {
        const deleted = await this.prismaService.client.orderProductModel.delete({
            where: { id }
        });

        if (deleted) {
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
            if (!basket) return null;
            const totalPrice = basket.products.reduce((value: number, productOrder) => {
                return value + (productOrder.count * productOrder.product.price)
            }, 0)

            await this.prismaService.client.basketModel.update({
                where: {
                    userId
                },
                data: {
                    totalPrice
                }
            })
        }

        return !!deleted;
    }

    async changeOrderProductCount(userId: string, id: string, count: number) {
        const updated = await this.prismaService.client.orderProductModel.update({
            where: {
                id
            },
            data: {
                count: count <= 0 ? 1 : count
            }
        })

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
        if (!basket) return updated;

        const totalPrice = basket.products.reduce((value: number, productOrder) => {
            return value + (productOrder.count * productOrder.product.price)
        }, 0)

        await this.prismaService.client.basketModel.update({
            where: {
                userId
            },
            data: {
                totalPrice
            }
        })

        return updated;
    }
}

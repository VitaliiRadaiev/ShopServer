import { injectable, inject } from "inversify";
import 'reflect-metadata';
import { TYPES } from "../types";
import { PrismaService } from "../database/prisma.service";
import { IConfigService } from "../config/config.service.interface";
import { ICreateProductCardData, IGetProductsBody, IUpdateProductCardData } from "./productCards.types";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Prisma } from "@prisma/client";

@injectable()
export class ProductCardsServices {
    constructor(
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
    ) { }

    async createProductCard({ categoryId }: { categoryId: string }) {
        return this.prismaService.client.productCardModel.create({
            data: {
                categoryId,
                title: '',
                price: 0,
                oldPrice: 0,
                isNew: false,
                inStock: false,
                isPromotion: false,
                isBestseller: false,
                isRecommended: false,
                shortDescription: '',
                description: '',
                rating: 0,
                createdAt: new Date().toISOString(),
            }
        })
    }

    async getProductCard(id: string) {
        return this.prismaService.client.productCardModel.findUnique({ 
            where: { id },
            include: {
                images: true,
                features: true,
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true
                            }
                        },
                        likes: { 
                            include: { items: {
                                select: { id: true }
                            } }
                        },
                        dislikes: {
                            include: { items: {
                                select: { id: true }
                            } }
                        },
                        subcomments: true
                    }
                },
                filterItems: true
            },
        })
    }

    async getProductCards(body: IGetProductsBody) {
        const { 
            filters, 
            priceRange, 
            sortBy, 
            isNew, 
            inStock, 
            isPromotion, 
            isBestseller, 
            isRecommended,
            count,
            page,
            term,
            categoryId 
        } = body;

        let whereOptions: { where?: Prisma.ProductCardModelWhereInput | undefined } = {
            where: {}
        }

        if (filters) {
            const mapedFilters = filters.map(filtersBlok => {
                return {
                    filterItems: {
                        some: {
                            id: { in: [...filtersBlok.items] }
                        }
                    }
                }
            })

            whereOptions = {
                where: {
                    ...whereOptions.where,
                    AND: mapedFilters
                }
            }
        }
        if(isNew) {
            whereOptions = {
                where: {
                    ...whereOptions.where,
                    isNew: true,
                }
            }
        }
        if(inStock) {
            whereOptions = {
                where: {
                    ...whereOptions.where,
                    inStock: true,
                }
            }
        }
        if(isPromotion) {
            whereOptions = {
                where: {
                    ...whereOptions.where,
                    isPromotion: true,
                }
            }
        }
        if(isBestseller) {
            whereOptions = {
                where: {
                    ...whereOptions.where,
                    isBestseller: true,
                }
            }
        }
        if(isRecommended) {
            whereOptions = {
                where: {
                    ...whereOptions.where,
                    isRecommended: true,
                }
            }
        }
        if(term) {
            whereOptions = {
                where: {
                    ...whereOptions.where,
                    OR: [
                        { title: { contains: term } }
                    ]
                }
            }
        }
        if(categoryId) {
            whereOptions = {
                where: {
                    ...whereOptions.where,
                    categoryId
                }
            }
        }
        const whereOptionsWithoutPrice = { ...whereOptions, where: { ...whereOptions.where } };

        if(priceRange) {
            whereOptions = {
                where: {
                    ...whereOptions.where,
                    price: {
                        gte: priceRange.from,
                        lte: priceRange.to,
                    }

                }
            }
        }


        let options: Prisma.ProductCardModelFindManyArgs<DefaultArgs> = {
            ...whereOptions,
            take: 50,
            include: {
                images: true,
                features: true,
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true
                            }
                        },
                        likes: { 
                            include: { items: {
                                select: { id: true }
                            } }
                        },
                        dislikes: {
                            include: { items: {
                                select: { id: true }
                            } }
                        },
                        subcomments: true
                    }
                },
                filterItems: true
            },
        }

        if(sortBy) {
            if (sortBy === 'rank') {
                options = {
                    ...options,
                    orderBy: {
                        rating: 'desc'
                    },
                }
            } else if (sortBy === 'cheap') {
                options = {
                    ...options,
                    orderBy: {
                        price: 'asc'
                    },
                }
            } else if (sortBy === 'expensive') {
                options = {
                    ...options,
                    orderBy: {
                        price: 'desc'
                    },
                }
            } else if (sortBy === 'long-created') {
                options = {
                    ...options,
                    orderBy: {
                        createdAt: 'asc'
                    },
                }
            } else if (sortBy === 'recently-created') {
                options = {
                    ...options,
                    orderBy: {
                        createdAt: 'desc'
                    },
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

        const lowestPriceCard = await this.prismaService.client.productCardModel.findFirst({
            ...whereOptionsWithoutPrice,
            orderBy: {
                price: 'asc',
            },
        })
        const highestPriceCard = await this.prismaService.client.productCardModel.findFirst({
            ...whereOptionsWithoutPrice,
            orderBy: {
                price: 'desc',
            },
        })

        return {
            items: await this.prismaService.client.productCardModel.findMany(options),
            count: await this.prismaService.client.productCardModel.count(whereOptions),
            lowestPrice: lowestPriceCard ? lowestPriceCard.price : 0,
            highestPrice: highestPriceCard ? highestPriceCard.price : 0
        }
    }

    async deleteProductCard(id: string) {
        return this.prismaService.client.productCardModel.delete({
            where: {
                id
            }
        })
    }

    async updateProductCard(id: string, data: IUpdateProductCardData) {
        return this.prismaService.client.productCardModel.update({
            where: {
                id
            },
            data
        })
    }

    async addFilterItems(cardId: string, filterIds: string[]) {
        return this.prismaService.client.productCardModel.update({
            where: { id: cardId },
            data: {
                filterItems: {
                    connect: filterIds.map(id => ({ id }))
                }
            }
        })
    }

    async removeFilterItems(cardId: string, filterIds: string[]) {
        return this.prismaService.client.productCardModel.update({
            where: { id: cardId },
            data: {
                filterItems: {
                    disconnect: filterIds.map(id => ({ id }))
                }
            }
        })
    }

    async uploadImage(id: string, data: { url: string } | undefined) {
        if (!data) return null
        return this.prismaService.client.imageModel.create({
            data: {
                productCard: { connect: { id } },
                url: data.url,
                isMain: false
            }
        })
    }

    async setImageAsMain(id: string, productCardId: string) {
        const card = await this.prismaService.client.productCardModel.findUnique({
            where: { id: productCardId },
            include: {
                images: true
            }
        })

        const cardImages = card?.images;
        if(cardImages) {
            for(let i = 0; i < cardImages.length; i++) {
                const img = cardImages[i];
                if(img.id === id) {
                    continue
                } else {
                    await this.prismaService.client.imageModel.update({
                        where: { id: img.id },
                        data: {
                            isMain: false
                        }
                    })
                }
            }
        }

        return this.prismaService.client.imageModel.update({
            where: { id },
            data: {
                isMain: true
            }
        })
    }

    async getImage(id: string) {
        return this.prismaService.client.imageModel.findUnique({
            where: { id }
        })
    }

    async deleteImage(id: string): Promise<boolean> {
        const deletedImage = await this.prismaService.client.imageModel.delete({
            where: { id }
        });

        return !!deletedImage;
    }

    async createProductFeature(id: string, data: { title: string, value: string }) {
        return this.prismaService.client.productFeatureModel.create({
            data: {
                productCard: { connect: { id } },
                ...data
            }
        })
    }

    async getProductFeature(id: string) {
        return this.prismaService.client.productFeatureModel.findUnique({
            where: { id }
        })
    }

    async deleteProductFeature(id: string): Promise<boolean> {
        const deletedImage = await this.prismaService.client.productFeatureModel.delete({
            where: { id }
        });

        return !!deletedImage;
    }

    async updateProductFeature(id: string, data: { title?: string, value?: string }) {
        return this.prismaService.client.productFeatureModel.update({
            where: { id },
            data: {
                ...data
            }
        })
    }
}

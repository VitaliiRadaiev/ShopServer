"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCardsServices = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../types");
const prisma_service_1 = require("../database/prisma.service");
let ProductCardsServices = class ProductCardsServices {
    constructor(configService, prismaService) {
        this.configService = configService;
        this.prismaService = prismaService;
    }
    createProductCard({ categoryId }) {
        return __awaiter(this, void 0, void 0, function* () {
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
            });
        });
    }
    getProductCard(id) {
        return __awaiter(this, void 0, void 0, function* () {
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
            });
        });
    }
    getProductCards(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { filters, priceRange, sortBy, isNew, inStock, isPromotion, isBestseller, isRecommended, count, page, term, categoryId } = body;
            let whereOptions = {
                where: {}
            };
            if (filters) {
                const mapedFilters = filters.map(filtersBlok => {
                    return {
                        filterItems: {
                            some: {
                                id: { in: [...filtersBlok.items] }
                            }
                        }
                    };
                });
                whereOptions = {
                    where: Object.assign(Object.assign({}, whereOptions.where), { AND: mapedFilters })
                };
            }
            if (isNew) {
                whereOptions = {
                    where: Object.assign(Object.assign({}, whereOptions.where), { isNew: true })
                };
            }
            if (inStock) {
                whereOptions = {
                    where: Object.assign(Object.assign({}, whereOptions.where), { inStock: true })
                };
            }
            if (isPromotion) {
                whereOptions = {
                    where: Object.assign(Object.assign({}, whereOptions.where), { isPromotion: true })
                };
            }
            if (isBestseller) {
                whereOptions = {
                    where: Object.assign(Object.assign({}, whereOptions.where), { isBestseller: true })
                };
            }
            if (isRecommended) {
                whereOptions = {
                    where: Object.assign(Object.assign({}, whereOptions.where), { isRecommended: true })
                };
            }
            if (term) {
                whereOptions = {
                    where: Object.assign(Object.assign({}, whereOptions.where), { OR: [
                            { title: { contains: term } }
                        ] })
                };
            }
            if (categoryId) {
                whereOptions = {
                    where: Object.assign(Object.assign({}, whereOptions.where), { categoryId })
                };
            }
            const whereOptionsWithoutPrice = Object.assign(Object.assign({}, whereOptions), { where: Object.assign({}, whereOptions.where) });
            if (priceRange) {
                whereOptions = {
                    where: Object.assign(Object.assign({}, whereOptions.where), { price: {
                            gte: priceRange.from,
                            lte: priceRange.to,
                        } })
                };
            }
            let options = Object.assign(Object.assign({}, whereOptions), { take: 50, include: {
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
                } });
            if (sortBy) {
                if (sortBy === 'rank') {
                    options = Object.assign(Object.assign({}, options), { orderBy: {
                            rating: 'desc'
                        } });
                }
                else if (sortBy === 'cheap') {
                    options = Object.assign(Object.assign({}, options), { orderBy: {
                            price: 'asc'
                        } });
                }
                else if (sortBy === 'expensive') {
                    options = Object.assign(Object.assign({}, options), { orderBy: {
                            price: 'desc'
                        } });
                }
                else if (sortBy === 'long-created') {
                    options = Object.assign(Object.assign({}, options), { orderBy: {
                            createdAt: 'asc'
                        } });
                }
                else if (sortBy === 'recently-created') {
                    options = Object.assign(Object.assign({}, options), { orderBy: {
                            createdAt: 'desc'
                        } });
                }
            }
            if (count) {
                options = Object.assign(Object.assign({}, options), { take: count });
                if (page) {
                    options = Object.assign(Object.assign({}, options), { skip: count * (page - 1) });
                }
            }
            const lowestPriceCard = yield this.prismaService.client.productCardModel.findFirst(Object.assign(Object.assign({}, whereOptionsWithoutPrice), { orderBy: {
                    price: 'asc',
                } }));
            const highestPriceCard = yield this.prismaService.client.productCardModel.findFirst(Object.assign(Object.assign({}, whereOptionsWithoutPrice), { orderBy: {
                    price: 'desc',
                } }));
            return {
                items: yield this.prismaService.client.productCardModel.findMany(options),
                count: yield this.prismaService.client.productCardModel.count(whereOptions),
                lowestPrice: lowestPriceCard ? lowestPriceCard.price : 0,
                highestPrice: highestPriceCard ? highestPriceCard.price : 0
            };
        });
    }
    deleteProductCard(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.productCardModel.delete({
                where: {
                    id
                }
            });
        });
    }
    updateProductCard(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.productCardModel.update({
                where: {
                    id
                },
                data
            });
        });
    }
    addFilterItems(cardId, filterIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.productCardModel.update({
                where: { id: cardId },
                data: {
                    filterItems: {
                        connect: filterIds.map(id => ({ id }))
                    }
                }
            });
        });
    }
    removeFilterItems(cardId, filterIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.productCardModel.update({
                where: { id: cardId },
                data: {
                    filterItems: {
                        disconnect: filterIds.map(id => ({ id }))
                    }
                }
            });
        });
    }
    uploadImage(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data)
                return null;
            return this.prismaService.client.imageModel.create({
                data: {
                    productCard: { connect: { id } },
                    url: data.url,
                    isMain: false
                }
            });
        });
    }
    setImageAsMain(id, productCardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const card = yield this.prismaService.client.productCardModel.findUnique({
                where: { id: productCardId },
                include: {
                    images: true
                }
            });
            const cardImages = card === null || card === void 0 ? void 0 : card.images;
            if (cardImages) {
                for (let i = 0; i < cardImages.length; i++) {
                    const img = cardImages[i];
                    if (img.id === id) {
                        continue;
                    }
                    else {
                        yield this.prismaService.client.imageModel.update({
                            where: { id: img.id },
                            data: {
                                isMain: false
                            }
                        });
                    }
                }
            }
            return this.prismaService.client.imageModel.update({
                where: { id },
                data: {
                    isMain: true
                }
            });
        });
    }
    getImage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.imageModel.findUnique({
                where: { id }
            });
        });
    }
    deleteImage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedImage = yield this.prismaService.client.imageModel.delete({
                where: { id }
            });
            return !!deletedImage;
        });
    }
    createProductFeature(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.productFeatureModel.create({
                data: Object.assign({ productCard: { connect: { id } } }, data)
            });
        });
    }
    getProductFeature(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.productFeatureModel.findUnique({
                where: { id }
            });
        });
    }
    deleteProductFeature(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedImage = yield this.prismaService.client.productFeatureModel.delete({
                where: { id }
            });
            return !!deletedImage;
        });
    }
    updateProductFeature(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.productFeatureModel.update({
                where: { id },
                data: Object.assign({}, data)
            });
        });
    }
};
exports.ProductCardsServices = ProductCardsServices;
exports.ProductCardsServices = ProductCardsServices = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.PrismaService)),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService])
], ProductCardsServices);
//# sourceMappingURL=productCards.services.js.map
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
exports.ProductCommentsServices = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../types");
const prisma_service_1 = require("../database/prisma.service");
let ProductCommentsServices = class ProductCommentsServices {
    constructor(configService, prismaService) {
        this.configService = configService;
        this.prismaService = prismaService;
    }
    createComment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newComment = yield this.prismaService.client.commentModel.create({
                data: {
                    createdAt: new Date().toISOString(),
                    text: data.text,
                    stars: data.stars,
                    authorId: data.authorId,
                    productCardId: data.productCardId,
                    likes: { create: {} },
                    dislikes: { create: {} }
                }
            });
            const productCard = yield this.prismaService.client.productCardModel.findUnique({
                where: { id: data.productCardId },
                include: { comments: true }
            });
            if (!(productCard === null || productCard === void 0 ? void 0 : productCard.comments))
                return;
            const value = (productCard.comments.reduce((accum, item) => accum = accum + item.stars, 0)) / productCard.comments.length;
            yield this.prismaService.client.productCardModel.update({
                where: { id: data.productCardId },
                data: { rating: Number(value.toFixed(1)) }
            });
            return newComment;
        });
    }
    updateComment(id, text) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.commentModel.update({
                where: { id },
                data: { text }
            });
        });
    }
    deletComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.prismaService.client.commentModel.delete({
                where: { id }
            });
            return !!deleted;
        });
    }
    addLike(userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.commentModel.update({
                where: { id: commentId },
                data: {
                    likes: {
                        update: {
                            data: {
                                items: { connect: { id: userId } }
                            }
                        }
                    },
                    dislikes: {
                        update: {
                            data: {
                                items: { disconnect: { id: userId } }
                            }
                        }
                    }
                },
                include: {
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
            });
        });
    }
    addDislike(userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.commentModel.update({
                where: { id: commentId },
                data: {
                    likes: {
                        update: {
                            data: {
                                items: { disconnect: { id: userId } }
                            }
                        }
                    },
                    dislikes: {
                        update: {
                            data: {
                                items: { connect: { id: userId } }
                            }
                        }
                    }
                },
                include: {
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
            });
        });
    }
    createSubComment(commentId, text) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.subcommentModel.create({
                data: {
                    text,
                    commentId,
                    createdAt: new Date().toISOString(),
                }
            });
        });
    }
    updateSubComment(id, text) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.subcommentModel.update({
                where: { id },
                data: { text }
            });
        });
    }
    deleteSubComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.prismaService.client.subcommentModel.delete({
                where: { id }
            });
            return !!deleted;
        });
    }
};
exports.ProductCommentsServices = ProductCommentsServices;
exports.ProductCommentsServices = ProductCommentsServices = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.PrismaService)),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService])
], ProductCommentsServices);
//# sourceMappingURL=productComments.services.js.map
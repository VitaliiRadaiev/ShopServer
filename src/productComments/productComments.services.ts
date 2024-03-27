import { injectable, inject } from "inversify";
import 'reflect-metadata';
import { TYPES } from "../types";
import { PrismaService } from "../database/prisma.service";
import { IConfigService } from "../config/config.service.interface";

@injectable()
export class ProductCommentsServices {
    constructor(
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
    ) { }
    
    async createComment(data: { text: string, stars: number, authorId: string, productCardId: string }) {
        const newComment = await this.prismaService.client.commentModel.create({
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

        const productCard = await this.prismaService.client.productCardModel.findUnique({
            where: { id: data.productCardId },
            include: { comments: true }
        })
        if(!productCard?.comments) return;
        const value = (productCard.comments.reduce((accum, item) => accum = accum + item.stars ,0)) / productCard.comments.length;
        
        await this.prismaService.client.productCardModel.update({
            where: { id: data.productCardId },
            data: { rating: Number(value.toFixed(1)) }
        })

        return newComment;
    }

    async updateComment(id: string, text: string) {
        return this.prismaService.client.commentModel.update({
            where: { id },
            data: { text }
        })
    }

    async deletComment(id: string) {
        const deleted = await this.prismaService.client.commentModel.delete({
            where: { id }
        });

        return !!deleted;
    }

    async addLike(userId: string, commentId: string) {
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
        })
    }

    async addDislike(userId: string, commentId: string) {
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
        })
    }

    async createSubComment(commentId: string, text: string) {
        return this.prismaService.client.subcommentModel.create({
            data: {
                text,
                commentId,
                createdAt: new Date().toISOString(),
            }
        })
    }

    async updateSubComment(id: string, text: string) {
        return this.prismaService.client.subcommentModel.update({
            where: { id },
            data: { text }
        })
    }

    async deleteSubComment(id: string) {
        const deleted = await this.prismaService.client.subcommentModel.delete({
            where: { id }
        })

        return !!deleted;
    }
}

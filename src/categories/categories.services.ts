import { injectable, inject } from "inversify";
import 'reflect-metadata';
import { TYPES } from "../types";
import { PrismaService } from "../database/prisma.service";
import { IConfigService } from "../config/config.service.interface";

@injectable()
export class CategoriesServices {
    constructor(
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
    ) { }

    async getCategory(id: string ) {
        return this.prismaService.client.categoryModel.findUnique({
            where: { id },
            include: {
                filters: {
                    include: {
                        items: true
                    }
                }
            }
        })
    }

    async getCategories() {
        return this.prismaService.client.categoryModel.findMany({
            include: {
                filters: {
                    include: {
                        items: true
                    }
                }
            }
        })
    }

    async createCategory(title: string ) {
        return this.prismaService.client.categoryModel.create({
            data: {
                title
            },
            include: {
                filters: {
                    include: {
                        items: true
                    }
                }
            }
        })
    }

    async updateCategory(id: string, title: string) {
        return this.prismaService.client.categoryModel.update({
            where: { id },
            data: {
                title
            }
        })
    }
    
    async deleteCategory(id: string) {
        return this.prismaService.client.categoryModel.delete({
            where: { id }
        })
    }
}

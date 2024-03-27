import { injectable, inject } from "inversify";
import 'reflect-metadata';
import { TYPES } from "../types";
import { PrismaService } from "../database/prisma.service";
import { IConfigService } from "../config/config.service.interface";

@injectable()
export class FiltersServices {
    constructor(
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
    ) { }

    async getFilters() {
        return this.prismaService.client.filterBlockModel.findMany({
            include: {
                items: true
            }
        })
    }
    async createFilter(categoryId: string, title: string) {
        return this.prismaService.client.filterBlockModel.create({
            data: {
                title,
                categoryId
            }
        })
    }
    async updateFilter(id: string, title: string) {
        return this.prismaService.client.filterBlockModel.update({
            where: { id },
            data: {
                title
            }
        })
    }
    async deleteFilter(id: string) {
        const deleted = await this.prismaService.client.filterBlockModel.delete({
            where: { id }
        })

        return !!deleted;
    }

    async createFilterItem(filterId: string, title: string) {
        return this.prismaService.client.filterItemModel.create({
            data: {
                filterBlockId: filterId,
                title
            }
        })
    }
    async updateFilterItem(id: string, title: string) {
        return this.prismaService.client.filterItemModel.update({
            where: { id },
            data: {
                title
            }
        })
    }
    async deleteFilterItem(id: string) {
        const deleted = await this.prismaService.client.filterItemModel.delete({
            where: { id }
        });

        return !!deleted;
    }
}

import { Request, Response, NextFunction } from "express";
import { BaseController } from "../common/base.controller";
import { injectable, inject } from "inversify";
import 'reflect-metadata';
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";
import { IConfigService } from "../config/config.service.interface";
import { AuthMiddleware } from "../common/auth.middleware";
import { AuthAdminMiddleware } from "../common/authAdmin.middleware";
import { FiltersServices } from "./filters.services";
import { ValidatePropertiesMiddleware } from "../common/validateProperties.middleware";


@injectable()
export class FiltersController extends BaseController {

    constructor(
        @inject(TYPES.ILogger) private loggerservice: ILogger,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.FiltersServices) private filtersServices: FiltersServices,
    ) {
        super(loggerservice);
        this.bindRoutes([
            {
                path: '/', method: 'get', func: this.getFilters,
                middlewares: []
            },
            {
                path: '/', method: 'post', func: this.createFilter,
                middlewares: [
                    new AuthAdminMiddleware(this.configService.get('SECRET')),
                    new ValidatePropertiesMiddleware(['categoryId', 'title'])
                ]
            },
            {
                path: '/:id', method: 'put', func: this.updateFilter,
                middlewares: [
                    new AuthAdminMiddleware(this.configService.get('SECRET')),
                    new ValidatePropertiesMiddleware(['title'])
                ]
            },
            {
                path: '/:id', method: 'delete', func: this.deleteFilter,
                middlewares: [new AuthAdminMiddleware(this.configService.get('SECRET'))]
            },

            {
                path: '/:id/item', method: 'post', func: this.createFilterItem,
                middlewares: [
                    new AuthAdminMiddleware(this.configService.get('SECRET')),
                    new ValidatePropertiesMiddleware(['title'])
                ]
            },
            {
                path: '/item/:id', method: 'put', func: this.updateFilterItem,
                middlewares: [
                    new AuthAdminMiddleware(this.configService.get('SECRET')),
                    new ValidatePropertiesMiddleware(['title'])
                ]
            },
            {
                path: '/item/:id', method: 'delete', func: this.deleteFilterItem,
                middlewares: [new AuthAdminMiddleware(this.configService.get('SECRET'))]
            },
        ]);
    }

    async getFilters(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filters = await this.filtersServices.getFilters();
            this.ok(res, filters)
        } catch (error) {
            console.log(error);
            this.error(res, 500, 'Something was wrong, please try again later!');
        }
    }
    async createFilter({ body }: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filter = await this.filtersServices.createFilter(body.categoryId, body.title);
            this.ok(res, filter)
        } catch (error) {
            console.log(error);
            this.error(res, 500, 'Something was wrong, please try again later!');
        }
    }
    async updateFilter(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const filter = await this.filtersServices.updateFilter(id, req.body.title);
            this.ok(res, filter)
        } catch (error) {
            console.log(error);
            this.error(res, 500, 'Something was wrong, please try again later!');
        }
    }
    async deleteFilter(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const deleted = await this.filtersServices.deleteFilter(id);
            if(deleted) {
                this.ok(res, { message: "Filter deleted successfully" })
            }
        } catch (error) {
            console.log(error);
            this.error(res, 500, 'Something was wrong, please try again later!');
        }
    }
    async createFilterItem({ body, params }: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = params;
            const filterItem = await this.filtersServices.createFilterItem(id, body.title);
            this.ok(res, filterItem)
        } catch (error) {
            console.log(error);
            this.error(res, 500, 'Something was wrong, please try again later!');
        }
    }
    async updateFilterItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const filterItem = await this.filtersServices.updateFilterItem(id, req.body.title);
            this.ok(res, filterItem)
        } catch (error) {
            console.log(error);
            this.error(res, 500, 'Something was wrong, please try again later!');
        }
    }
    async deleteFilterItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const deleted = await this.filtersServices.deleteFilterItem(id);
            if(deleted) {
                this.ok(res, { message: "Filter item deleted successfully" })
            }
        } catch (error) {
            console.log(error);
            this.error(res, 500, 'Something was wrong, please try again later!');
        }
    }
}


import { Request, Response, NextFunction } from "express";
import { BaseController } from "../common/base.controller";
import { injectable, inject } from "inversify";
import 'reflect-metadata';
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";
import { IConfigService } from "../config/config.service.interface";
import { AuthMiddleware } from "../common/auth.middleware";
import { AuthAdminMiddleware } from "../common/authAdmin.middleware";
import { ValidatePropertiesMiddleware } from "../common/validateProperties.middleware";
import { CategoriesServices } from "./categories.services";

@injectable()
export class CategoriesController extends BaseController {

	constructor(
		@inject(TYPES.ILogger) private loggerservice: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.CategoriesServices) private categoriesServices: CategoriesServices,
	) {
		super(loggerservice);
		this.bindRoutes([
			{ path: '/', method: 'post', func: this.createCategory, 
				middlewares: [
					new AuthAdminMiddleware(this.configService.get('SECRET')), 
					new ValidatePropertiesMiddleware(['title'])
				] 
			},
			{ path: '/:id', method: 'put', func: this.updateCategory, 
				middlewares: [
					new AuthAdminMiddleware(this.configService.get('SECRET')), 
					new ValidatePropertiesMiddleware(['title'])
				] 
			},
			{ path: '/:id', method: 'delete', func: this.deleteCategory, 
				middlewares: [
					new AuthAdminMiddleware(this.configService.get('SECRET')), 
				] 
			},
			{ path: '/', method: 'get', func: this.getCategories, 
				middlewares: [] 
			},
			{ path: '/:id', method: 'get', func: this.getCategory, 
				middlewares: [] 
			},
		]);
	}

	async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
            const categories = await this.categoriesServices.getCategories();
            this.ok(res, categories);
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}
	async getCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;
            const category = await this.categoriesServices.getCategory(id);
			if(category) {
				this.ok(res, category);
			} else {
				this.error(res, 404, { message: "Category not found." })
			}
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}
	async createCategory({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
            const category = await this.categoriesServices.createCategory(body.title);
            this.ok(res, category);
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}
	async updateCategory({ body, params }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = params;
            const category = await this.categoriesServices.updateCategory(id, body.title);
            this.ok(res, category);
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}
	async deleteCategory({ params }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = params;
            const deleted = await this.categoriesServices.deleteCategory(id);
			if(deleted) {
				this.ok(res, { message: "Category deleted successfully." });
			} else {
				this.error(res, 404, { message: "Category not found." });
			}
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}
}


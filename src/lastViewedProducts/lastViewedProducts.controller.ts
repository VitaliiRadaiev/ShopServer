import { Request, Response, NextFunction } from "express";
import { BaseController } from "../common/base.controller";
import { injectable, inject } from "inversify";
import 'reflect-metadata';
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";
import { IConfigService } from "../config/config.service.interface";
import { AuthMiddleware } from "../common/auth.middleware";
import { LastViewedProductsServices } from "./lastViewedProducts.services";

@injectable()
export class LastViewedProductsController extends BaseController {

	constructor(
		@inject(TYPES.ILogger) private loggerservice: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.LastViewedProductsServices) private lastViewedProductsServices: LastViewedProductsServices,
	) {
		super(loggerservice);
		this.bindRoutes([
			{ path: '/', method: 'get', func: this.getLastViewedProducts, 
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')), 
				] 
			},
			{ path: '/product/:productId', method: 'put', func: this.addProduct, 
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')), 
				] 
			},
			{ path: '/product/:productId', method: 'delete', func: this.removeProduct, 
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')), 
				] 
			},
		]);
	}

	async getLastViewedProducts({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
            const lastViewedProducts = await this.lastViewedProductsServices.getLastViewedProducts(user.id);
            if(lastViewedProducts) {
                this.ok(res, lastViewedProducts);
            } else {
                this.error(res, 500, 'Last viewed products not found.');
            }
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}

	async addProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { productId } = req.params;

            const lastViewedProducts = await this.lastViewedProductsServices.addProduct(req.user.id, productId);
            if(lastViewedProducts) {
                this.ok(res, lastViewedProducts);
            } else {
                this.error(res, 500, 'Last viewed products not found.');
            }
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}

	async removeProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { productId } = req.params;

            const lastViewedProducts = await this.lastViewedProductsServices.removeProduct(req.user.id, productId);
            if(lastViewedProducts) {
                this.ok(res, lastViewedProducts);
            } else {
                this.error(res, 500, 'Last viewed products not found.');
            }
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}
}


import { Request, Response, NextFunction } from "express";
import { BaseController } from "../common/base.controller";
import { injectable, inject } from "inversify";
import 'reflect-metadata';
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";
import { IConfigService } from "../config/config.service.interface";
import { AuthMiddleware } from "../common/auth.middleware";
import { BasketServices } from "./basket.services";
import { ValidatePropertiesMiddleware } from "../common/validateProperties.middleware";

@injectable()
export class BasketController extends BaseController {

	constructor(
		@inject(TYPES.ILogger) private loggerservice: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.BasketServices) private basketServices: BasketServices,
	) {
		super(loggerservice);
		this.bindRoutes([
			{ path: '/', method: 'get', func: this.getBasket, 
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')), 
				] 
			},
			{ path: '/product/:productId', method: 'post', func: this.addProduct, 
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')), 
				] 
			},
			{ path: '/orderProduct/:orderProductId', method: 'delete', func: this.removeOrderProduct, 
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')), 
				] 
			},
			{ path: '/orderProduct/:orderProductId', method: 'put', func: this.changeOrderProductCount, 
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new ValidatePropertiesMiddleware([
						'count'
					])
				] 
			},
		]);
	}

	async getBasket({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
            const basket = await this.basketServices.getBasket(user.id);
            if(basket) {
                this.ok(res, basket);
            } else {
                this.error(res, 500, 'Basket not found.');
            }
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}

	async addProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { productId } = req.params;
			const basket = await this.basketServices.getBasket(req.user.id);
			if(!basket) {
				this.error(res, 404, { message: "Basket not found" });
				return;
			}

            const updated = await this.basketServices.addProduct(req.user.id, basket.id, productId);
            if(updated) {
                this.ok(res, updated);
            } else {
                this.error(res, 500, 'Basket not found.');
            }
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}

	async removeOrderProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { orderProductId } = req.params;

			const basket = await this.basketServices.getBasket(req.user.id);
			if(!basket) {
				this.error(res, 404, { message: "Basket not found" });
				return;
			}

            const deleted = await this.basketServices.removeOrderProduct(req.user.id, orderProductId);
            if(deleted) {
                this.ok(res, { message: 'Order product deleted successfully.' });
            } else {
                this.error(res, 404, 'Order product not found.');
            }
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}

	async changeOrderProductCount(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { orderProductId } = req.params;

			const basket = await this.basketServices.getBasket(req.user.id);
			if(!basket) {
				this.error(res, 404, { message: "Basket not found" });
				return;
			}

            const updated = await this.basketServices.changeOrderProductCount(req.user.id, orderProductId, Number(req.body.count));
            if(updated) {
                this.ok(res, updated);
            } else {
                this.error(res, 500, 'Basket not found.');
            }
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}
}


import { Request, Response, NextFunction } from "express";
import { BaseController } from "../common/base.controller";
import { injectable, inject } from "inversify";
import 'reflect-metadata';
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";
import { IConfigService } from "../config/config.service.interface";
import { AuthMiddleware } from "../common/auth.middleware";
import { WishListServices } from "./wishList.services";

@injectable()
export class WishListController extends BaseController {

	constructor(
		@inject(TYPES.ILogger) private loggerservice: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.WishListServices) private wishListServices: WishListServices,
	) {
		super(loggerservice);
		this.bindRoutes([
			{ path: '/', method: 'get', func: this.getWishList, 
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

	async getWishList({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
            const wishList = await this.wishListServices.getWishList(user.id);
            if(wishList) {
                this.ok(res, wishList);
            } else {
                this.error(res, 404, 'Wish-list not found.');
            }
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}

	async addProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { productId } = req.params;

            const wishList = await this.wishListServices.addProduct(req.user.id, productId);
            if(wishList) {
                this.ok(res, wishList);
            } else {
                this.error(res, 500, 'Wish-list not found.');
            }
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}

	async removeProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { productId } = req.params;

            const wishList = await this.wishListServices.removeProduct(req.user.id, productId);
            if(wishList) {
                this.ok(res, wishList);
            } else {
                this.error(res, 500, 'Wish-list not found.');
            }
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}
}


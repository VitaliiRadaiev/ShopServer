import { Request, Response, NextFunction } from "express";
import { BaseController } from "../common/base.controller";
import { injectable, inject } from "inversify";
import 'reflect-metadata';
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";
import { IConfigService } from "../config/config.service.interface";
import { AuthMiddleware } from "../common/auth.middleware";
import { AuthAdminMiddleware } from "../common/authAdmin.middleware";
import { HistoryServices } from "./history.services";
import { ValidatePropertiesMiddleware } from "../common/validateProperties.middleware";


@injectable()
export class HistoryController extends BaseController {

	constructor(
		@inject(TYPES.ILogger) private loggerservice: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.HistoryServices) private historyServices: HistoryServices,
	) {
		super(loggerservice);
		this.bindRoutes([
			{ path: '/', method: 'get', func: this.getHistory, 
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')), 
				] 
			},
			{ path: '/order', method: 'post', func: this.createOrder, 
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new ValidatePropertiesMiddleware([
						'delivery',
						'deliveryFullAddress',
						'paymentMethod',
						'firstName',
						'lastName',
						'email',
						'phone',
					]) 
				] 
			},
			{ path: '/order/:id', method: 'put', func: this.updateOrder, 
				middlewares: [
					new AuthAdminMiddleware(this.configService.get('SECRET')),
					new ValidatePropertiesMiddleware([
						'status',
						'delivery',
						'deliveryFullAddress',
						'paymentMethod',
						'firstName',
						'lastName',
						'email',
						'phone',
					], true) 
				] 
			},
			{ path: '/order/:id', method: 'delete', func: this.deleteOrder, 
				middlewares: [
					new AuthAdminMiddleware(this.configService.get('SECRET'))
				] 
			},
			{ path: '/order/:id', method: 'get', func: this.getOrder, 
				middlewares: [
					//new AuthAdminMiddleware(this.configService.get('SECRET'))
				] 
			},
			{ path: '/orders', method: 'post', func: this.getOrders, 
				middlewares: [
					new AuthAdminMiddleware(this.configService.get('SECRET')),
					new ValidatePropertiesMiddleware([
						'status',
						'count',
						'page',
					], true) 
				] 
			},
		]);
	}

	async getHistory({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const history = await this.historyServices.getHistory(user.id);
			if(history) {
				this.ok(res, history);
			} else {
				this.error(res, 404, { message: "History nof found." })
			}
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}

	async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const history = await this.historyServices.getHistory(req.user.id);
			const order = await this.historyServices.createOrder(req.user.id, req.body, history?.id);
			if(order) {
				this.ok(res, order);
				return;
			} else {
				this.error(res, 404, { message: 'Basket not found or it hasn`t any products' })
			}
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}
	async updateOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;
			const order = await this.historyServices.getOrder(Number(id));
			if(!order) {
				this.error(res, 404, { message: 'Order not found.' });
				return;
			}
			const updated = await this.historyServices.updateOrder(Number(id), req.body);
			this.ok(res, updated);
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}
	async deleteOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;
			const deleted = await this.historyServices.deleteOrder(Number(id));
			if(deleted) {
				this.ok(res, { message: 'Order deleted successfully.' });
			} else {
				this.error(res, 404, 'Order not found');
			}
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}
	async getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const orders = await this.historyServices.getOrders(req.body);
			this.ok(res, orders);
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}
	async getOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;
			const order = await this.historyServices.getOrder(Number(id));
			if(order) {
				this.ok(res, order);
			} else {
				this.error(res, 404, { message: 'Order not found.' })
			}
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}

}


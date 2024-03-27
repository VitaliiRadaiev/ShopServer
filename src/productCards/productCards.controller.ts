import { Request, Response, NextFunction } from "express";
import { BaseController } from "../common/base.controller";
import { injectable, inject } from "inversify";
import 'reflect-metadata';
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";
import { IConfigService } from "../config/config.service.interface";
import { AuthAdminMiddleware } from "../common/authAdmin.middleware"; 
import { AuthMiddleware } from "../common/auth.middleware"; 
import { ValidatePropertiesMiddleware } from "../common/validateProperties.middleware";
import { ProductCardsServices } from "./productCards.services";
import fileUpload from "express-fileupload";
import { IUploadImage } from "./productCards.types";
import { join } from 'path';
import { unlink, existsSync, mkdirSync, rm } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { ImageModel } from "@prisma/client";

@injectable()
export class ProductCardsController extends BaseController {

	constructor(
		@inject(TYPES.ILogger) private loggerservice: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.ProductCardsServices) private productCardsServices: ProductCardsServices,
	) {
		super(loggerservice);
		this.bindRoutes([
			{ path: '/get', method: 'post', func: this.getProductCards, 
				middlewares: [
					new ValidatePropertiesMiddleware([
						'filters',
						'priceRange',
						'sortBy',
						'isNew',
						'inStock',
						'isPromotion',
						'isBestseller',
						'isRecommended',
						'count',
						'page',
						'term',
						'categoryId'
					], true)
				] 
			},
			{ path: '/product/:id', method: 'get', func: this.getProductCard, 
				middlewares: [] 
			},
			{ path: '/:id', method: 'delete', func: this.deleteProductCard, 
				middlewares: [new AuthAdminMiddleware(this.configService.get('SECRET'))] 
			},
			{ path: '/create', method: 'post', func: this.createProductCard, 
				middlewares: [ 
					new AuthAdminMiddleware(this.configService.get('SECRET')), 
					new ValidatePropertiesMiddleware([
						'categoryId'
					])
				] 
			},
			{ path: '/:id', method: 'put', func: this.updateProductCard, 
				middlewares: [ 
					new AuthAdminMiddleware(this.configService.get('SECRET')), 
					new ValidatePropertiesMiddleware([
						'title',
						'price',
						'oldPrice',
						'isNew',
						'inStock',
						'isPromotion',
						'isBestseller',
						'isRecommended',
						'shortDescription',
						'description',
					], true)
				] 
			},
			{ path: '/:id/filters', method: 'put', func: this.addFilterItems, 
				middlewares: [ 
					new AuthAdminMiddleware(this.configService.get('SECRET')), 
					new ValidatePropertiesMiddleware([
						'filters',
					])
				] 
			},
			{ path: '/:id/filters', method: 'delete', func: this.removeFilterItems, 
				middlewares: [ 
					new AuthAdminMiddleware(this.configService.get('SECRET')), 
					new ValidatePropertiesMiddleware([
						'filters',
					])
				] 
			},


			{ path: '/:id/images', method: 'post', func: this.uploadImages, 
				middlewares: [ 
					new AuthAdminMiddleware(this.configService.get('SECRET'))
				] 
			},
			{ path: '/image/:id', method: 'put', func: this.setImageAsMain, 
				middlewares: [ 
					new AuthAdminMiddleware(this.configService.get('SECRET')),
				] 
			},
			{ path: '/image/:id', method: 'get', func: this.getImage, 
				middlewares: [] 
			},
			{ path: '/image/:id', method: 'delete', func: this.deleteImage, 
				middlewares: [new AuthAdminMiddleware(this.configService.get('SECRET'))] 
			},
			{ path: '/:id/feature', method: 'post', func: this.createProductFeature, 
				middlewares: [
					new AuthAdminMiddleware(this.configService.get('SECRET')),
					new ValidatePropertiesMiddleware([
						'title',
						'value'
					])
				] 
			},
			{ path: '/feature/:id', method: 'delete', func: this.deleteProductFeature, 
				middlewares: [
					new AuthAdminMiddleware(this.configService.get('SECRET'))] 
			},
			{ path: '/feature/:id', method: 'put', func: this.updateProductFeature, 
				middlewares: [
					new AuthAdminMiddleware(this.configService.get('SECRET')),
					new ValidatePropertiesMiddleware([
						'title',
						'value',
					], true)
				] 
			},
		]);
	}



	async createProductCard({ body, user }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const productCard = await this.productCardsServices.createProductCard(body);
			if(productCard) {
				this.ok(res, productCard);
			}
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}

	async getProductCards(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {

			const products = await this.productCardsServices.getProductCards(req.body);
			this.ok(res, products);
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}

	async getProductCard(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;
			const product = await this.productCardsServices.getProductCard(id);
			if(product) {
				this.ok(res, product);
			} else {
				this.error(res, 404, { message: 'Product not found.' });
			}
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}

	async deleteProductCard(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;
			const card = await this.productCardsServices.getProductCard(id);

			if(!card) {
				this.error(res, 404, 'Product card not found');
				return;
			}

			const folderPath = join(__dirname, '../public/uploads/', `productId_${id}`);
            if (existsSync(folderPath)) {
                rm(folderPath, { recursive: true, force: true }, (err) => {
                    if (err) this.loggerservice.error(err);
                })
            }

			const deleted = await this.productCardsServices.deleteProductCard(id);
			if(deleted) {
				this.ok(res, { message: 'Product card deleted successfully.' });
			} else {
				this.error(res, 404, 'Product card not found');
			}
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}

	async updateProductCard(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;
			const card = await this.productCardsServices.getProductCard(id);
			if(!card) {
				this.error(res, 404, 'Product card has not found');
				return;
			}

			const updated = await this.productCardsServices.updateProductCard(id, req.body);
			this.ok(res, updated);
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}

	async addFilterItems(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;
			const productCard = await this.productCardsServices.addFilterItems(id, req.body.filters);
			this.ok(res, productCard);
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}
	async removeFilterItems(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;
			const productCard = await this.productCardsServices.removeFilterItems(id, req.body.filters);
			this.ok(res, productCard);
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}

	async uploadImages({ files, params }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = params;
			const card = await this.productCardsServices.getProductCard(id);
			if(!card) {
				this.error(res, 404, 'Product card not found');
				return;
			}

            const transferredFiles = files?.images;

            if (transferredFiles) {
                let images = transferredFiles as fileUpload.UploadedFile[];
                if (!Array.isArray(transferredFiles)) {
                    images = [transferredFiles];
                }

                const downloads = images.map(image => {
                    return new Promise<IUploadImage | undefined>(rej => {
                        const folderPath = join(__dirname, '../public/uploads/', `productId_${id}`);
						console.log(folderPath);
                        if (!existsSync(folderPath)) {
                            mkdirSync(folderPath);
                        }
					
						
                        const imageId = uuidv4();
                        const uploadPath = join(folderPath, `/${imageId}${image.name}`);

                        image.mv(uploadPath, (err) => {
                            if (err) {
                                rej(undefined);
                            }
                            rej({
                                url: `/uploads/productId_${id}/${imageId}${image.name}`
                            });
                        })
                    })
                });

                const downloadsResults = await Promise.all(downloads);

                const sevePathesResults: (ImageModel | null)[] = [];
                for (const imageData of downloadsResults) {
                    const restul = await this.productCardsServices.uploadImage(id, imageData);
                    sevePathesResults.push(restul);
                }

                this.ok(res, sevePathesResults);
            } else {
                this.error(res, 400, 'Bad request or any files not found!');
            }

        } catch (error) {
			console.log(error);
			
            this.error(res, 500, 'Something was wrong, please try again later!');
        }
    }

	async setImageAsMain({ params }: Request, res: Response, next: NextFunction): Promise<void> {
        try {
			const { id } = params;
			const image = await this.productCardsServices.getImage(id);
	
			if (!image) {
				this.error(res, 404, 'Image not found.');
				return;
			}

            const updated = await this.productCardsServices.setImageAsMain(id, image.productCardId);
			this.ok(res, updated);
        } catch (error) {
			console.log(error);
			
            this.error(res, 500, 'Something was wrong, please try again later!');
        }
    }

	async deleteImage({ params }: Request, res: Response, next: NextFunction): Promise<void> {
		const { id } = params;
		const image = await this.productCardsServices.getImage(id);

		if (!image) {
			this.error(res, 404, 'Image not found.');
			return;
		}

		unlink(join(__dirname, '../public', image.url), (err) => err && this.loggerservice.error(err));

		const deleted = await this.productCardsServices.deleteImage(id);
		if (deleted) {
			this.ok(res, { message: 'Image deleted successfully.' });
		}
	}

	async getImage({ params }: Request, res: Response, next: NextFunction): Promise<void> {
        try {
			const { id } = params;
			const image = await this.productCardsServices.getImage(id);
			this.ok(res, { image });
        } catch (error) {
			console.log(error);
			
            this.error(res, 500, 'Something was wrong, please try again later!');
        }
    }

	async createProductFeature({ body, params }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = params;
			const card = await this.productCardsServices.getProductCard(id);
			if(!card) {
				this.error(res, 404, 'Product card not found');
				return;
			}

			const productFeature = await this.productCardsServices.createProductFeature(id, body);
			this.ok(res, productFeature);
			
        } catch (error) {
			console.log(error);
			
            this.error(res, 500, 'Something was wrong, please try again later!');
        }
	}
	async deleteProductFeature({ params }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = params;
			const productFeature = await this.productCardsServices.getProductFeature(id);
			if(!productFeature) {
				this.error(res, 404, 'Product feature not found');
				return;
			}

			const deleted = await this.productCardsServices.deleteProductFeature(id);
			if(deleted) {
				this.ok(res, { message: "Product feature deleted successfully." })
			} else {
				this.error(res, 404, 'Product feature not found');
			}

        } catch (error) {
			console.log(error);
			
            this.error(res, 500, 'Something was wrong, please try again later!');
        }
	}
	async updateProductFeature({ params, body }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = params;
			const productFeature = await this.productCardsServices.getProductFeature(id);
			if(!productFeature) {
				this.error(res, 404, 'Product feature not found');
				return;
			}

			const updated = await this.productCardsServices.updateProductFeature(id, body);
			if(updated) {
				this.ok(res, updated)
			} 

        } catch (error) {
			console.log(error);
			
            this.error(res, 500, 'Something was wrong, please try again later!');
        }
	}
}


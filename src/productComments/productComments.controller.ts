import { Request, Response, NextFunction } from "express";
import { BaseController } from "../common/base.controller";
import { injectable, inject } from "inversify";
import 'reflect-metadata';
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";
import { IConfigService } from "../config/config.service.interface";
import { AuthMiddleware } from "../common/auth.middleware";
import { AuthAdminMiddleware } from "../common/authAdmin.middleware";
import { ProductCommentsServices } from "./productComments.services";
import { ValidatePropertiesMiddleware } from "../common/validateProperties.middleware";
import { UsersServices } from "../users/users.services";


@injectable()
export class ProductCommentsController extends BaseController {

    constructor(
        @inject(TYPES.ILogger) private loggerservice: ILogger,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.ProductCommentsServices) private productCommentsServices: ProductCommentsServices,
        @inject(TYPES.UsersServices) private usersServices: UsersServices,
    ) {
        super(loggerservice);
        this.bindRoutes([
            {
                path: '/', method: 'post', func: this.createComment,
                middlewares: [
                    new AuthMiddleware(this.configService.get('SECRET')),
                    new ValidatePropertiesMiddleware([
                        'text',
                        'stars',
                        'productCardId'
                    ])
                ]
            },
            {
                path: '/:id', method: 'put', func: this.updateComment,
                middlewares: [
                    new AuthMiddleware(this.configService.get('SECRET')),
                    new ValidatePropertiesMiddleware([
                        'text',
                    ])
                ]
            },
            {
                path: '/:id', method: 'delete', func: this.deleteComment,
                middlewares: [
                    new AuthMiddleware(this.configService.get('SECRET')),
                ]
            },
            {
                path: '/:id/admin', method: 'delete', func: this.deleteCommentByAdmin,
                middlewares: [
                    new AuthAdminMiddleware(this.configService.get('SECRET')),
                ]
            },
            {
                path: '/:id/like', method: 'post', func: this.addLike,
                middlewares: [
                    new AuthMiddleware(this.configService.get('SECRET')),
                ]
            },
            {
                path: '/:id/dislike', method: 'post', func: this.addDislike,
                middlewares: [
                    new AuthMiddleware(this.configService.get('SECRET')),
                ]
            },
            {
                path: '/:id/subcomment', method: 'post', func: this.createSubComment,
                middlewares: [
                    new AuthAdminMiddleware(this.configService.get('SECRET')),
                    new ValidatePropertiesMiddleware([
                        'text',
                    ])
                ]
            },
            {
                path: '/subcomment/:id', method: 'put', func: this.updateSubComment,
                middlewares: [
                    new AuthAdminMiddleware(this.configService.get('SECRET')),
                    new ValidatePropertiesMiddleware([
                        'text',
                    ])
                ]
            },
            { 
                path: '/subcomment/:id', method: 'delete', func: this.deleteSubComment,
                middlewares: [
                    new AuthAdminMiddleware(this.configService.get('SECRET')),
                ]
            },
        ]);
    }

    async createComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await this.usersServices.getUser(req.user.id);
            if (!user) {
                this.error(res, 404, { message: 'User not found!' })
                return;
            }

            if (!user.isIdentified) {
                this.error(res, 403, { message: 'The user is not identified' })
                return;
            }

            const body = {
                ...req.body,
                authorId: req.user.id
            }
            const comment = await this.productCommentsServices.createComment(body);
            if (comment) {
                this.ok(res, comment);
            }
        } catch (error) {
            console.log(error);
            this.error(res, 500, 'Something was wrong, please try again later!');
        }
    }
    async updateComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await this.usersServices.getUser(req.user.id);
            if (!user) {
                this.error(res, 404, { message: 'User not found!' })
                return;
            }

            if (!user.isIdentified) {
                this.error(res, 403, { message: 'The user is not identified' })
                return;
            }

            const { id } = req.params;
            const updated = await this.productCommentsServices.updateComment(id, req.body.text);
            if (updated) {
                this.ok(res, updated);
            }
        } catch (error) {
            console.log(error);
            this.error(res, 500, 'Something was wrong, please try again later!');
        }
    }
    async deleteComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await this.usersServices.getUser(req.user.id);
            if (!user) {
                this.error(res, 404, { message: 'User not found!' })
                return;
            }

            if (!user.isIdentified) {
                this.error(res, 403, { message: 'The user is not identified' })
                return;
            }

            const { id } = req.params;
            const deleted = await this.productCommentsServices.deletComment(id);
            if (deleted) {
                this.ok(res, { message: "Comment deleted successfully." });
            }
        } catch (error) {
            console.log(error);
            this.error(res, 500, 'Something was wrong, please try again later!');
        }
    }
    async deleteCommentByAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const deleted = await this.productCommentsServices.deletComment(id);
            if (deleted) {
                this.ok(res, { message: "Comment deleted successfully." });
            }
        } catch (error) {
            console.log(error);
            this.error(res, 500, 'Something was wrong, please try again later!');
        }
    }
    async addLike(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await this.usersServices.getUser(req.user.id);
            if (!user) {
                this.error(res, 404, { message: 'User not found!' })
                return;
            }

            if (!user.isIdentified) {
                this.error(res, 403, { message: 'The user is not identified' })
                return;
            }

            const { id } = req.params;
            const comment = await this.productCommentsServices.addLike(req.user.id, id);
            if (comment) {
                this.ok(res, comment);
            }
        } catch (error) {
            console.log(error);
            this.error(res, 500, 'Something was wrong, please try again later!');
        }
    }
    async addDislike(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await this.usersServices.getUser(req.user.id);
            if (!user) {
                this.error(res, 404, { message: 'User not found!' })
                return;
            }

            if (!user.isIdentified) {
                this.error(res, 403, { message: 'The user is not identified' })
                return;
            }

            const { id } = req.params;
            const comment = await this.productCommentsServices.addDislike(req.user.id, id);
            if (comment) {
                this.ok(res, comment);
            }
        } catch (error) {
            console.log(error);
            this.error(res, 500, 'Something was wrong, please try again later!');
        }
    }
    async createSubComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: commentId } = req.params;
            const subcomment = await this.productCommentsServices.createSubComment(commentId, req.body.text);
            if(subcomment) {
                this.ok(res, subcomment);
            }

        } catch (error) {
            console.log(error);
            this.error(res, 500, 'Something was wrong, please try again later!');
        }
    }
    async updateSubComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const updated = await this.productCommentsServices.updateSubComment(id, req.body.text);
            this.ok(res, updated);

        } catch (error) {
            console.log(error);
            this.error(res, 500, 'Something was wrong, please try again later!');
        }
    }
    async deleteSubComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const deleted = await this.productCommentsServices.deleteSubComment(id);
            if(deleted) {
                this.ok(res, { message: 'Subcomment deleted successfully.' });
            } else {
                this.error(res, 404, { message: 'Subcomment not found!' });
            }

        } catch (error) {
            console.log(error);
            this.error(res, 500, 'Something was wrong, please try again later!');
        }
    }
}


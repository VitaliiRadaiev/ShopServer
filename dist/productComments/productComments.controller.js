"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCommentsController = void 0;
const base_controller_1 = require("../common/base.controller");
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../types");
const auth_middleware_1 = require("../common/auth.middleware");
const authAdmin_middleware_1 = require("../common/authAdmin.middleware");
const productComments_services_1 = require("./productComments.services");
const validateProperties_middleware_1 = require("../common/validateProperties.middleware");
const users_services_1 = require("../users/users.services");
let ProductCommentsController = class ProductCommentsController extends base_controller_1.BaseController {
    constructor(loggerservice, configService, productCommentsServices, usersServices) {
        super(loggerservice);
        this.loggerservice = loggerservice;
        this.configService = configService;
        this.productCommentsServices = productCommentsServices;
        this.usersServices = usersServices;
        this.bindRoutes([
            {
                path: '/', method: 'post', func: this.createComment,
                middlewares: [
                    new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET')),
                    new validateProperties_middleware_1.ValidatePropertiesMiddleware([
                        'text',
                        'stars',
                        'productCardId'
                    ])
                ]
            },
            {
                path: '/:id', method: 'put', func: this.updateComment,
                middlewares: [
                    new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET')),
                    new validateProperties_middleware_1.ValidatePropertiesMiddleware([
                        'text',
                    ])
                ]
            },
            {
                path: '/:id', method: 'delete', func: this.deleteComment,
                middlewares: [
                    new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET')),
                ]
            },
            {
                path: '/:id/admin', method: 'delete', func: this.deleteCommentByAdmin,
                middlewares: [
                    new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET')),
                ]
            },
            {
                path: '/:id/like', method: 'post', func: this.addLike,
                middlewares: [
                    new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET')),
                ]
            },
            {
                path: '/:id/dislike', method: 'post', func: this.addDislike,
                middlewares: [
                    new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET')),
                ]
            },
            {
                path: '/:id/subcomment', method: 'post', func: this.createSubComment,
                middlewares: [
                    new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET')),
                    new validateProperties_middleware_1.ValidatePropertiesMiddleware([
                        'text',
                    ])
                ]
            },
            {
                path: '/subcomment/:id', method: 'put', func: this.updateSubComment,
                middlewares: [
                    new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET')),
                    new validateProperties_middleware_1.ValidatePropertiesMiddleware([
                        'text',
                    ])
                ]
            },
            {
                path: '/subcomment/:id', method: 'delete', func: this.deleteSubComment,
                middlewares: [
                    new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET')),
                ]
            },
        ]);
    }
    createComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.usersServices.getUser(req.user.id);
                if (!user) {
                    this.error(res, 404, { message: 'User not found!' });
                    return;
                }
                if (!user.isIdentified) {
                    this.error(res, 403, { message: 'The user is not identified' });
                    return;
                }
                const body = Object.assign(Object.assign({}, req.body), { authorId: req.user.id });
                const comment = yield this.productCommentsServices.createComment(body);
                if (comment) {
                    this.ok(res, comment);
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    updateComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.usersServices.getUser(req.user.id);
                if (!user) {
                    this.error(res, 404, { message: 'User not found!' });
                    return;
                }
                if (!user.isIdentified) {
                    this.error(res, 403, { message: 'The user is not identified' });
                    return;
                }
                const { id } = req.params;
                const updated = yield this.productCommentsServices.updateComment(id, req.body.text);
                if (updated) {
                    this.ok(res, updated);
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    deleteComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.usersServices.getUser(req.user.id);
                if (!user) {
                    this.error(res, 404, { message: 'User not found!' });
                    return;
                }
                if (!user.isIdentified) {
                    this.error(res, 403, { message: 'The user is not identified' });
                    return;
                }
                const { id } = req.params;
                const deleted = yield this.productCommentsServices.deletComment(id);
                if (deleted) {
                    this.ok(res, { message: "Comment deleted successfully." });
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    deleteCommentByAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deleted = yield this.productCommentsServices.deletComment(id);
                if (deleted) {
                    this.ok(res, { message: "Comment deleted successfully." });
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    addLike(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.usersServices.getUser(req.user.id);
                if (!user) {
                    this.error(res, 404, { message: 'User not found!' });
                    return;
                }
                if (!user.isIdentified) {
                    this.error(res, 403, { message: 'The user is not identified' });
                    return;
                }
                const { id } = req.params;
                const comment = yield this.productCommentsServices.addLike(req.user.id, id);
                if (comment) {
                    this.ok(res, comment);
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    addDislike(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.usersServices.getUser(req.user.id);
                if (!user) {
                    this.error(res, 404, { message: 'User not found!' });
                    return;
                }
                if (!user.isIdentified) {
                    this.error(res, 403, { message: 'The user is not identified' });
                    return;
                }
                const { id } = req.params;
                const comment = yield this.productCommentsServices.addDislike(req.user.id, id);
                if (comment) {
                    this.ok(res, comment);
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    createSubComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: commentId } = req.params;
                const subcomment = yield this.productCommentsServices.createSubComment(commentId, req.body.text);
                if (subcomment) {
                    this.ok(res, subcomment);
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    updateSubComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const updated = yield this.productCommentsServices.updateSubComment(id, req.body.text);
                this.ok(res, updated);
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    deleteSubComment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deleted = yield this.productCommentsServices.deleteSubComment(id);
                if (deleted) {
                    this.ok(res, { message: 'Subcomment deleted successfully.' });
                }
                else {
                    this.error(res, 404, { message: 'Subcomment not found!' });
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
};
exports.ProductCommentsController = ProductCommentsController;
exports.ProductCommentsController = ProductCommentsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ProductCommentsServices)),
    __param(3, (0, inversify_1.inject)(types_1.TYPES.UsersServices)),
    __metadata("design:paramtypes", [Object, Object, productComments_services_1.ProductCommentsServices,
        users_services_1.UsersServices])
], ProductCommentsController);
//# sourceMappingURL=productComments.controller.js.map
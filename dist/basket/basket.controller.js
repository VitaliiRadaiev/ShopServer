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
exports.BasketController = void 0;
const base_controller_1 = require("../common/base.controller");
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../types");
const auth_middleware_1 = require("../common/auth.middleware");
const basket_services_1 = require("./basket.services");
const validateProperties_middleware_1 = require("../common/validateProperties.middleware");
let BasketController = class BasketController extends base_controller_1.BaseController {
    constructor(loggerservice, configService, basketServices) {
        super(loggerservice);
        this.loggerservice = loggerservice;
        this.configService = configService;
        this.basketServices = basketServices;
        this.bindRoutes([
            { path: '/', method: 'get', func: this.getBasket,
                middlewares: [
                    new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET')),
                ]
            },
            { path: '/product/:productId', method: 'post', func: this.addProduct,
                middlewares: [
                    new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET')),
                ]
            },
            { path: '/orderProduct/:orderProductId', method: 'delete', func: this.removeOrderProduct,
                middlewares: [
                    new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET')),
                ]
            },
            { path: '/orderProduct/:orderProductId', method: 'put', func: this.changeOrderProductCount,
                middlewares: [
                    new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET')),
                    new validateProperties_middleware_1.ValidatePropertiesMiddleware([
                        'count'
                    ])
                ]
            },
        ]);
    }
    getBasket({ user }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const basket = yield this.basketServices.getBasket(user.id);
                if (basket) {
                    this.ok(res, basket);
                }
                else {
                    this.error(res, 500, 'Basket not found.');
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    addProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.params;
                const basket = yield this.basketServices.getBasket(req.user.id);
                if (!basket) {
                    this.error(res, 404, { message: "Basket not found" });
                    return;
                }
                const updated = yield this.basketServices.addProduct(req.user.id, basket.id, productId);
                if (updated) {
                    this.ok(res, updated);
                }
                else {
                    this.error(res, 500, 'Basket not found.');
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    removeOrderProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderProductId } = req.params;
                const basket = yield this.basketServices.getBasket(req.user.id);
                if (!basket) {
                    this.error(res, 404, { message: "Basket not found" });
                    return;
                }
                const deleted = yield this.basketServices.removeOrderProduct(req.user.id, orderProductId);
                if (deleted) {
                    this.ok(res, { message: 'Order product deleted successfully.' });
                }
                else {
                    this.error(res, 404, 'Order product not found.');
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    changeOrderProductCount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { orderProductId } = req.params;
                const basket = yield this.basketServices.getBasket(req.user.id);
                if (!basket) {
                    this.error(res, 404, { message: "Basket not found" });
                    return;
                }
                const updated = yield this.basketServices.changeOrderProductCount(req.user.id, orderProductId, Number(req.body.count));
                if (updated) {
                    this.ok(res, updated);
                }
                else {
                    this.error(res, 500, 'Basket not found.');
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
};
exports.BasketController = BasketController;
exports.BasketController = BasketController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.BasketServices)),
    __metadata("design:paramtypes", [Object, Object, basket_services_1.BasketServices])
], BasketController);
//# sourceMappingURL=basket.controller.js.map
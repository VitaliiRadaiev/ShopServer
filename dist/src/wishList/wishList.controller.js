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
exports.WishListController = void 0;
const base_controller_1 = require("../common/base.controller");
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../types");
const auth_middleware_1 = require("../common/auth.middleware");
const wishList_services_1 = require("./wishList.services");
let WishListController = class WishListController extends base_controller_1.BaseController {
    constructor(loggerservice, configService, wishListServices) {
        super(loggerservice);
        this.loggerservice = loggerservice;
        this.configService = configService;
        this.wishListServices = wishListServices;
        this.bindRoutes([
            { path: '/', method: 'get', func: this.getWishList,
                middlewares: [
                    new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET')),
                ]
            },
            { path: '/product/:productId', method: 'put', func: this.addProduct,
                middlewares: [
                    new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET')),
                ]
            },
            { path: '/product/:productId', method: 'delete', func: this.removeProduct,
                middlewares: [
                    new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET')),
                ]
            },
        ]);
    }
    getWishList({ user }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wishList = yield this.wishListServices.getWishList(user.id);
                if (wishList) {
                    this.ok(res, wishList);
                }
                else {
                    this.error(res, 404, 'Wish-list not found.');
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
                const wishList = yield this.wishListServices.addProduct(req.user.id, productId);
                if (wishList) {
                    this.ok(res, wishList);
                }
                else {
                    this.error(res, 500, 'Wish-list not found.');
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    removeProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.params;
                const wishList = yield this.wishListServices.removeProduct(req.user.id, productId);
                if (wishList) {
                    this.ok(res, wishList);
                }
                else {
                    this.error(res, 500, 'Wish-list not found.');
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
};
exports.WishListController = WishListController;
exports.WishListController = WishListController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.WishListServices)),
    __metadata("design:paramtypes", [Object, Object, wishList_services_1.WishListServices])
], WishListController);
//# sourceMappingURL=wishList.controller.js.map
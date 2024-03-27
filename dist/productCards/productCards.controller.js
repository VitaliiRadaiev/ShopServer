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
exports.ProductCardsController = void 0;
const base_controller_1 = require("../common/base.controller");
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../types");
const authAdmin_middleware_1 = require("../common/authAdmin.middleware");
const validateProperties_middleware_1 = require("../common/validateProperties.middleware");
const productCards_services_1 = require("./productCards.services");
const path_1 = require("path");
const fs_1 = require("fs");
const uuid_1 = require("uuid");
let ProductCardsController = class ProductCardsController extends base_controller_1.BaseController {
    constructor(loggerservice, configService, productCardsServices) {
        super(loggerservice);
        this.loggerservice = loggerservice;
        this.configService = configService;
        this.productCardsServices = productCardsServices;
        this.bindRoutes([
            { path: '/get', method: 'post', func: this.getProductCards,
                middlewares: [
                    new validateProperties_middleware_1.ValidatePropertiesMiddleware([
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
                middlewares: [new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET'))]
            },
            { path: '/create', method: 'post', func: this.createProductCard,
                middlewares: [
                    new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET')),
                    new validateProperties_middleware_1.ValidatePropertiesMiddleware([
                        'categoryId'
                    ])
                ]
            },
            { path: '/:id', method: 'put', func: this.updateProductCard,
                middlewares: [
                    new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET')),
                    new validateProperties_middleware_1.ValidatePropertiesMiddleware([
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
                    new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET')),
                    new validateProperties_middleware_1.ValidatePropertiesMiddleware([
                        'filters',
                    ])
                ]
            },
            { path: '/:id/filters', method: 'delete', func: this.removeFilterItems,
                middlewares: [
                    new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET')),
                    new validateProperties_middleware_1.ValidatePropertiesMiddleware([
                        'filters',
                    ])
                ]
            },
            { path: '/:id/images', method: 'post', func: this.uploadImages,
                middlewares: [
                    new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET'))
                ]
            },
            { path: '/image/:id', method: 'put', func: this.setImageAsMain,
                middlewares: [
                    new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET')),
                ]
            },
            { path: '/image/:id', method: 'get', func: this.getImage,
                middlewares: []
            },
            { path: '/image/:id', method: 'delete', func: this.deleteImage,
                middlewares: [new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET'))]
            },
            { path: '/:id/feature', method: 'post', func: this.createProductFeature,
                middlewares: [
                    new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET')),
                    new validateProperties_middleware_1.ValidatePropertiesMiddleware([
                        'title',
                        'value'
                    ])
                ]
            },
            { path: '/feature/:id', method: 'delete', func: this.deleteProductFeature,
                middlewares: [
                    new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET'))
                ]
            },
            { path: '/feature/:id', method: 'put', func: this.updateProductFeature,
                middlewares: [
                    new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET')),
                    new validateProperties_middleware_1.ValidatePropertiesMiddleware([
                        'title',
                        'value',
                    ], true)
                ]
            },
        ]);
    }
    createProductCard({ body, user }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productCard = yield this.productCardsServices.createProductCard(body);
                if (productCard) {
                    this.ok(res, productCard);
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    getProductCards(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield this.productCardsServices.getProductCards(req.body);
                this.ok(res, products);
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    getProductCard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const product = yield this.productCardsServices.getProductCard(id);
                if (product) {
                    this.ok(res, product);
                }
                else {
                    this.error(res, 404, { message: 'Product not found.' });
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    deleteProductCard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const card = yield this.productCardsServices.getProductCard(id);
                if (!card) {
                    this.error(res, 404, 'Product card not found');
                    return;
                }
                const folderPath = (0, path_1.join)(__dirname, '../public/uploads/', `productId_${id}`);
                if ((0, fs_1.existsSync)(folderPath)) {
                    (0, fs_1.rm)(folderPath, { recursive: true, force: true }, (err) => {
                        if (err)
                            this.loggerservice.error(err);
                    });
                }
                const deleted = yield this.productCardsServices.deleteProductCard(id);
                if (deleted) {
                    this.ok(res, { message: 'Product card deleted successfully.' });
                }
                else {
                    this.error(res, 404, 'Product card not found');
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    updateProductCard(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const card = yield this.productCardsServices.getProductCard(id);
                if (!card) {
                    this.error(res, 404, 'Product card has not found');
                    return;
                }
                const updated = yield this.productCardsServices.updateProductCard(id, req.body);
                this.ok(res, updated);
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    addFilterItems(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const productCard = yield this.productCardsServices.addFilterItems(id, req.body.filters);
                this.ok(res, productCard);
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    removeFilterItems(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const productCard = yield this.productCardsServices.removeFilterItems(id, req.body.filters);
                this.ok(res, productCard);
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    uploadImages({ files, params }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = params;
                const card = yield this.productCardsServices.getProductCard(id);
                if (!card) {
                    this.error(res, 404, 'Product card not found');
                    return;
                }
                const transferredFiles = files === null || files === void 0 ? void 0 : files.images;
                if (transferredFiles) {
                    let images = transferredFiles;
                    if (!Array.isArray(transferredFiles)) {
                        images = [transferredFiles];
                    }
                    const downloads = images.map(image => {
                        return new Promise(rej => {
                            const folderPath = (0, path_1.join)(__dirname, '../public/uploads/', `productId_${id}`);
                            console.log(folderPath);
                            if (!(0, fs_1.existsSync)(folderPath)) {
                                (0, fs_1.mkdirSync)(folderPath);
                            }
                            const imageId = (0, uuid_1.v4)();
                            const uploadPath = (0, path_1.join)(folderPath, `/${imageId}${image.name}`);
                            image.mv(uploadPath, (err) => {
                                if (err) {
                                    rej(undefined);
                                }
                                rej({
                                    url: `/uploads/productId_${id}/${imageId}${image.name}`
                                });
                            });
                        });
                    });
                    const downloadsResults = yield Promise.all(downloads);
                    const sevePathesResults = [];
                    for (const imageData of downloadsResults) {
                        const restul = yield this.productCardsServices.uploadImage(id, imageData);
                        sevePathesResults.push(restul);
                    }
                    this.ok(res, sevePathesResults);
                }
                else {
                    this.error(res, 400, 'Bad request or any files not found!');
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    setImageAsMain({ params }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = params;
                const image = yield this.productCardsServices.getImage(id);
                if (!image) {
                    this.error(res, 404, 'Image not found.');
                    return;
                }
                const updated = yield this.productCardsServices.setImageAsMain(id, image.productCardId);
                this.ok(res, updated);
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    deleteImage({ params }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = params;
            const image = yield this.productCardsServices.getImage(id);
            if (!image) {
                this.error(res, 404, 'Image not found.');
                return;
            }
            (0, fs_1.unlink)((0, path_1.join)(__dirname, '../public', image.url), (err) => err && this.loggerservice.error(err));
            const deleted = yield this.productCardsServices.deleteImage(id);
            if (deleted) {
                this.ok(res, { message: 'Image deleted successfully.' });
            }
        });
    }
    getImage({ params }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = params;
                const image = yield this.productCardsServices.getImage(id);
                this.ok(res, { image });
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    createProductFeature({ body, params }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = params;
                const card = yield this.productCardsServices.getProductCard(id);
                if (!card) {
                    this.error(res, 404, 'Product card not found');
                    return;
                }
                const productFeature = yield this.productCardsServices.createProductFeature(id, body);
                this.ok(res, productFeature);
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    deleteProductFeature({ params }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = params;
                const productFeature = yield this.productCardsServices.getProductFeature(id);
                if (!productFeature) {
                    this.error(res, 404, 'Product feature not found');
                    return;
                }
                const deleted = yield this.productCardsServices.deleteProductFeature(id);
                if (deleted) {
                    this.ok(res, { message: "Product feature deleted successfully." });
                }
                else {
                    this.error(res, 404, 'Product feature not found');
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    updateProductFeature({ params, body }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = params;
                const productFeature = yield this.productCardsServices.getProductFeature(id);
                if (!productFeature) {
                    this.error(res, 404, 'Product feature not found');
                    return;
                }
                const updated = yield this.productCardsServices.updateProductFeature(id, body);
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
};
exports.ProductCardsController = ProductCardsController;
exports.ProductCardsController = ProductCardsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ProductCardsServices)),
    __metadata("design:paramtypes", [Object, Object, productCards_services_1.ProductCardsServices])
], ProductCardsController);
//# sourceMappingURL=productCards.controller.js.map
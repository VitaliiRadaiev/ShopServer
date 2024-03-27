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
exports.CategoriesController = void 0;
const base_controller_1 = require("../common/base.controller");
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../types");
const authAdmin_middleware_1 = require("../common/authAdmin.middleware");
const validateProperties_middleware_1 = require("../common/validateProperties.middleware");
const categories_services_1 = require("./categories.services");
let CategoriesController = class CategoriesController extends base_controller_1.BaseController {
    constructor(loggerservice, configService, categoriesServices) {
        super(loggerservice);
        this.loggerservice = loggerservice;
        this.configService = configService;
        this.categoriesServices = categoriesServices;
        this.bindRoutes([
            { path: '/', method: 'post', func: this.createCategory,
                middlewares: [
                    new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET')),
                    new validateProperties_middleware_1.ValidatePropertiesMiddleware(['title'])
                ]
            },
            { path: '/:id', method: 'put', func: this.updateCategory,
                middlewares: [
                    new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET')),
                    new validateProperties_middleware_1.ValidatePropertiesMiddleware(['title'])
                ]
            },
            { path: '/:id', method: 'delete', func: this.deleteCategory,
                middlewares: [
                    new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET')),
                ]
            },
            { path: '/', method: 'get', func: this.getCategories,
                middlewares: []
            },
            { path: '/:id', method: 'get', func: this.getCategory,
                middlewares: []
            },
        ]);
    }
    getCategories(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this.categoriesServices.getCategories();
                this.ok(res, categories);
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    getCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const category = yield this.categoriesServices.getCategory(id);
                if (category) {
                    this.ok(res, category);
                }
                else {
                    this.error(res, 404, { message: "Category not found." });
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    createCategory({ body }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this.categoriesServices.createCategory(body.title);
                this.ok(res, category);
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    updateCategory({ body, params }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = params;
                const category = yield this.categoriesServices.updateCategory(id, body.title);
                this.ok(res, category);
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    deleteCategory({ params }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = params;
                const deleted = yield this.categoriesServices.deleteCategory(id);
                if (deleted) {
                    this.ok(res, { message: "Category deleted successfully." });
                }
                else {
                    this.error(res, 404, { message: "Category not found." });
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
};
exports.CategoriesController = CategoriesController;
exports.CategoriesController = CategoriesController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.CategoriesServices)),
    __metadata("design:paramtypes", [Object, Object, categories_services_1.CategoriesServices])
], CategoriesController);
//# sourceMappingURL=categories.controller.js.map
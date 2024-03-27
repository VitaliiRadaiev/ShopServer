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
exports.FiltersController = void 0;
const base_controller_1 = require("../common/base.controller");
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../types");
const authAdmin_middleware_1 = require("../common/authAdmin.middleware");
const filters_services_1 = require("./filters.services");
const validateProperties_middleware_1 = require("../common/validateProperties.middleware");
let FiltersController = class FiltersController extends base_controller_1.BaseController {
    constructor(loggerservice, configService, filtersServices) {
        super(loggerservice);
        this.loggerservice = loggerservice;
        this.configService = configService;
        this.filtersServices = filtersServices;
        this.bindRoutes([
            {
                path: '/', method: 'get', func: this.getFilters,
                middlewares: []
            },
            {
                path: '/', method: 'post', func: this.createFilter,
                middlewares: [
                    new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET')),
                    new validateProperties_middleware_1.ValidatePropertiesMiddleware(['categoryId', 'title'])
                ]
            },
            {
                path: '/:id', method: 'put', func: this.updateFilter,
                middlewares: [
                    new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET')),
                    new validateProperties_middleware_1.ValidatePropertiesMiddleware(['title'])
                ]
            },
            {
                path: '/:id', method: 'delete', func: this.deleteFilter,
                middlewares: [new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET'))]
            },
            {
                path: '/:id/item', method: 'post', func: this.createFilterItem,
                middlewares: [
                    new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET')),
                    new validateProperties_middleware_1.ValidatePropertiesMiddleware(['title'])
                ]
            },
            {
                path: '/item/:id', method: 'put', func: this.updateFilterItem,
                middlewares: [
                    new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET')),
                    new validateProperties_middleware_1.ValidatePropertiesMiddleware(['title'])
                ]
            },
            {
                path: '/item/:id', method: 'delete', func: this.deleteFilterItem,
                middlewares: [new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET'))]
            },
        ]);
    }
    getFilters(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = yield this.filtersServices.getFilters();
                this.ok(res, filters);
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    createFilter({ body }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = yield this.filtersServices.createFilter(body.categoryId, body.title);
                this.ok(res, filter);
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    updateFilter(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const filter = yield this.filtersServices.updateFilter(id, req.body.title);
                this.ok(res, filter);
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    deleteFilter(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deleted = yield this.filtersServices.deleteFilter(id);
                if (deleted) {
                    this.ok(res, { message: "Filter deleted successfully" });
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    createFilterItem({ body, params }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = params;
                const filterItem = yield this.filtersServices.createFilterItem(id, body.title);
                this.ok(res, filterItem);
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    updateFilterItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const filterItem = yield this.filtersServices.updateFilterItem(id, req.body.title);
                this.ok(res, filterItem);
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    deleteFilterItem(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deleted = yield this.filtersServices.deleteFilterItem(id);
                if (deleted) {
                    this.ok(res, { message: "Filter item deleted successfully" });
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
};
exports.FiltersController = FiltersController;
exports.FiltersController = FiltersController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.FiltersServices)),
    __metadata("design:paramtypes", [Object, Object, filters_services_1.FiltersServices])
], FiltersController);
//# sourceMappingURL=filters.controller.js.map
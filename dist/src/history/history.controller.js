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
exports.HistoryController = void 0;
const base_controller_1 = require("../common/base.controller");
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../types");
const auth_middleware_1 = require("../common/auth.middleware");
const authAdmin_middleware_1 = require("../common/authAdmin.middleware");
const history_services_1 = require("./history.services");
const validateProperties_middleware_1 = require("../common/validateProperties.middleware");
let HistoryController = class HistoryController extends base_controller_1.BaseController {
    constructor(loggerservice, configService, historyServices) {
        super(loggerservice);
        this.loggerservice = loggerservice;
        this.configService = configService;
        this.historyServices = historyServices;
        this.bindRoutes([
            { path: '/', method: 'get', func: this.getHistory,
                middlewares: [
                    new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET')),
                ]
            },
            { path: '/order', method: 'post', func: this.createOrder,
                middlewares: [
                    new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET')),
                    new validateProperties_middleware_1.ValidatePropertiesMiddleware([
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
                    new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET')),
                    new validateProperties_middleware_1.ValidatePropertiesMiddleware([
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
                    new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET'))
                ]
            },
            { path: '/order/:id', method: 'get', func: this.getOrder,
                middlewares: []
            },
            { path: '/orders', method: 'post', func: this.getOrders,
                middlewares: [
                    new authAdmin_middleware_1.AuthAdminMiddleware(this.configService.get('SECRET')),
                    new validateProperties_middleware_1.ValidatePropertiesMiddleware([
                        'status',
                        'count',
                        'page',
                    ], true)
                ]
            },
        ]);
    }
    getHistory({ user }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const history = yield this.historyServices.getHistory(user.id);
                if (history) {
                    this.ok(res, history);
                }
                else {
                    this.error(res, 404, { message: "History nof found." });
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    createOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const history = yield this.historyServices.getHistory(req.user.id);
                const order = yield this.historyServices.createOrder(req.user.id, req.body, history === null || history === void 0 ? void 0 : history.id);
                if (order) {
                    this.ok(res, order);
                    return;
                }
                else {
                    this.error(res, 404, { message: 'Basket not found or it hasn`t any products' });
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    updateOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const order = yield this.historyServices.getOrder(Number(id));
                if (!order) {
                    this.error(res, 404, { message: 'Order not found.' });
                    return;
                }
                const updated = yield this.historyServices.updateOrder(Number(id), req.body);
                this.ok(res, updated);
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    deleteOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deleted = yield this.historyServices.deleteOrder(Number(id));
                if (deleted) {
                    this.ok(res, { message: 'Order deleted successfully.' });
                }
                else {
                    this.error(res, 404, 'Order not found');
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    getOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield this.historyServices.getOrders(req.body);
                this.ok(res, orders);
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    getOrder(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const order = yield this.historyServices.getOrder(Number(id));
                if (order) {
                    this.ok(res, order);
                }
                else {
                    this.error(res, 404, { message: 'Order not found.' });
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
};
exports.HistoryController = HistoryController;
exports.HistoryController = HistoryController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.HistoryServices)),
    __metadata("design:paramtypes", [Object, Object, history_services_1.HistoryServices])
], HistoryController);
//# sourceMappingURL=history.controller.js.map
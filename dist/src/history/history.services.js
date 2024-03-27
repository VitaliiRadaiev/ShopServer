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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryServices = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../types");
const prisma_service_1 = require("../database/prisma.service");
let HistoryServices = class HistoryServices {
    constructor(configService, prismaService) {
        this.configService = configService;
        this.prismaService = prismaService;
    }
    getHistory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const history = yield this.prismaService.client.historyModel.findUnique({
                where: { userId: id },
                include: {
                    orders: {
                        include: {
                            products: {
                                include: {
                                    product: {
                                        include: {
                                            images: true
                                        }
                                    }
                                }
                            },
                            recipient: true,
                        }
                    }
                }
            });
            if (!history)
                return null;
            return Object.assign(Object.assign({}, history), { orders: history.orders.reverse() });
        });
    }
    createOrder(userId, data, historyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const basket = yield this.prismaService.client.basketModel.findUnique({
                where: {
                    userId
                },
                include: {
                    products: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    price: true
                                }
                            }
                        }
                    }
                }
            });
            if (!basket || !basket.products.length)
                return null;
            const order = yield this.prismaService.client.orderModel.create({
                data: {
                    userId,
                    historyId,
                    createdAt: new Date().toISOString(),
                    status: 'processed',
                    totalPrice: basket.totalPrice,
                    delivery: data.delivery,
                    deliveryFullAddress: data.deliveryFullAddress,
                    paymentMethod: data.paymentMethod,
                    products: {
                        connect: basket.products.map(orderProduct => ({ id: orderProduct.id }))
                    },
                    recipient: {
                        create: {
                            firstName: data.firstName,
                            lastName: data.lastName,
                            email: data.email,
                            phone: data.phone
                        }
                    }
                }
            });
            yield this.prismaService.client.basketModel.update({
                where: {
                    userId
                },
                data: {
                    totalPrice: 0,
                    products: {
                        set: []
                    }
                }
            });
            return order;
        });
    }
    updateOrder(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, phone } = data, orderData = __rest(data, ["firstName", "lastName", "email", "phone"]);
            return this.prismaService.client.orderModel.update({
                where: { id },
                data: Object.assign(Object.assign({}, orderData), { recipient: {
                        update: {
                            data: {
                                firstName,
                                lastName,
                                email,
                                phone
                            }
                        }
                    } })
            });
        });
    }
    getOrders(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, count, page } = body;
            let whereOptions = {
                where: {}
            };
            if (status) {
                whereOptions = {
                    where: Object.assign(Object.assign({}, whereOptions.where), { status: {
                            contains: status
                        } })
                };
            }
            let options = Object.assign(Object.assign({}, whereOptions), { take: 50, orderBy: {
                    createdAt: 'desc'
                }, include: {
                    products: {
                        include: {
                            product: {
                                include: {
                                    images: true
                                }
                            }
                        }
                    },
                    recipient: true,
                    user: {
                        select: {
                            id: true,
                            isIdentified: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            phone: true
                        }
                    }
                } });
            if (count) {
                options = Object.assign(Object.assign({}, options), { take: count });
                if (page) {
                    options = Object.assign(Object.assign({}, options), { skip: count * (page - 1) });
                }
            }
            return {
                items: yield this.prismaService.client.orderModel.findMany(options),
                count: yield this.prismaService.client.orderModel.count(whereOptions)
            };
        });
    }
    getOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.orderModel.findFirst({
                where: {
                    id
                },
                include: {
                    products: {
                        include: {
                            product: {
                                include: {
                                    images: true
                                }
                            }
                        }
                    },
                    recipient: true,
                    user: {
                        select: {
                            id: true,
                            isIdentified: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            phone: true
                        }
                    }
                }
            });
        });
    }
    deleteOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.prismaService.client.orderModel.delete({
                where: { id }
            });
            return !!deleted;
        });
    }
};
exports.HistoryServices = HistoryServices;
exports.HistoryServices = HistoryServices = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.PrismaService)),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService])
], HistoryServices);
//# sourceMappingURL=history.services.js.map
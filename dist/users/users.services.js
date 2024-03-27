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
exports.UsersServices = void 0;
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../types");
const prisma_service_1 = require("../database/prisma.service");
const user_entity_1 = require("./user.entity");
const admin_entity_1 = require("./admin.entity");
let UsersServices = class UsersServices {
    constructor(configService, prismaService) {
        this.configService = configService;
        this.prismaService = prismaService;
    }
    checkUserExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.userModel.findFirst({
                where: {
                    email
                }
            });
        });
    }
    validateUser({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prismaService.client.userModel.findFirst({
                where: {
                    email
                }
            });
            if (!user)
                return null;
            if (!(user === null || user === void 0 ? void 0 : user.email) || !(user === null || user === void 0 ? void 0 : user.password))
                return null;
            const newUser = new user_entity_1.User(user.email, user.password);
            const isValidate = yield newUser.comparePassword(password);
            return isValidate ? user : null;
        });
    }
    register(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, firstName, lastName, password, phone } = data;
            const newUser = new user_entity_1.User(email);
            const salt = this.configService.get('SALT');
            yield newUser.setPassword(password, Number(salt));
            return this.prismaService.client.userModel.update({
                where: {
                    id
                },
                data: {
                    isIdentified: true,
                    email,
                    firstName,
                    lastName,
                    phone,
                    password: newUser.password,
                    wishList: {
                        create: {}
                    },
                    history: {
                        create: {}
                    }
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true
                }
            });
        });
    }
    createUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prismaService.client.userModel.create({
                data: {
                    isIdentified: false,
                    basket: {
                        create: {
                            totalPrice: 0
                        }
                    },
                    lastViewedProductsModel: {
                        create: {}
                    }
                }
            });
            return user;
        });
    }
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.userModel.findUnique({
                where: {
                    id
                },
                select: {
                    id: true,
                    isIdentified: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    basket: true,
                    wishList: true,
                    lastViewedProductsModel: true,
                    history: {
                        include: {
                            orders: true
                        }
                    }
                },
            });
        });
    }
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.userModel.update({
                where: {
                    id
                },
                data,
                select: {
                    id: true,
                    isIdentified: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true
                }
            });
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.userModel.findUnique({
                where: {
                    email
                },
                select: {
                    id: true,
                    isIdentified: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
                    basket: true,
                    wishList: true,
                    lastViewedProductsModel: true,
                    history: {
                        include: {
                            orders: true
                        }
                    }
                },
            });
        });
    }
    createAdmin(name, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const newAdmin = new admin_entity_1.Admin(name);
            const salt = this.configService.get('SALT');
            yield newAdmin.setPassword(password, Number(salt));
            return this.prismaService.client.adminModel.create({
                data: {
                    name,
                    password: newAdmin.password
                }
            });
        });
    }
    checkAdminExist(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prismaService.client.adminModel.findUnique({
                where: {
                    name
                }
            });
        });
    }
    validateAdmin(name, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this.prismaService.client.adminModel.findUnique({
                where: {
                    name
                }
            });
            if (!admin)
                return null;
            const newAdmin = new admin_entity_1.Admin(admin.name, admin.password);
            const isValidate = yield newAdmin.comparePassword(password);
            return isValidate ? admin : null;
        });
    }
};
exports.UsersServices = UsersServices;
exports.UsersServices = UsersServices = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.PrismaService)),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService])
], UsersServices);
//# sourceMappingURL=users.services.js.map
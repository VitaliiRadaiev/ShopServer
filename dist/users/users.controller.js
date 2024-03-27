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
exports.UsersController = void 0;
const base_controller_1 = require("../common/base.controller");
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../types");
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_middleware_1 = require("../common/auth.middleware");
const validateProperties_middleware_1 = require("../common/validateProperties.middleware");
const users_services_1 = require("./users.services");
let UsersController = class UsersController extends base_controller_1.BaseController {
    constructor(loggerservice, configService, usersService) {
        super(loggerservice);
        this.loggerservice = loggerservice;
        this.configService = configService;
        this.usersService = usersService;
        this.bindRoutes([
            {
                path: '/register', method: 'post', func: this.register,
                middlewares: [
                    new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET')),
                    new validateProperties_middleware_1.ValidatePropertiesMiddleware(['email', 'firstName', 'lastName', 'password', 'phone'])
                ]
            },
            {
                path: '/createUnidentifiedUser', method: 'post', func: this.createUnidentifiedUser,
                middlewares: []
            },
            { path: '/login', method: 'post', func: this.login, middlewares: [new validateProperties_middleware_1.ValidatePropertiesMiddleware(['email', 'password'])] },
            { path: '/me', method: 'get', func: this.me, middlewares: [new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET'))] },
            {
                path: '/me',
                method: 'put',
                func: this.update,
                middlewares: [
                    new auth_middleware_1.AuthMiddleware(this.configService.get('SECRET')),
                    new validateProperties_middleware_1.ValidatePropertiesMiddleware(['firstName', 'lastName', 'phone'], true)
                ]
            },
            { path: '/admin', method: 'post', func: this.createAdmin, middlewares: [] },
            { path: '/admin/login', method: 'post', func: this.loginAdmin, middlewares: [new validateProperties_middleware_1.ValidatePropertiesMiddleware(['name', 'password'])] },
        ]);
    }
    register({ body, user }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, firstName, lastName, password, phone } = body;
            try {
                const isUserExists = yield this.usersService.getUserByEmail(email);
                if (isUserExists) {
                    this.error(res, 409, `User with this email -[${email}] already exists`);
                    return;
                }
                const foundedUser = yield this.usersService.getUser(user.id);
                if (foundedUser) {
                    const registeredUser = yield this.usersService.register(user.id, {
                        email,
                        firstName,
                        lastName,
                        password,
                        phone
                    });
                    this.ok(res, registeredUser);
                }
                else {
                    const newUser = yield this.usersService.createUser();
                    const jwt = yield this.signJWT(newUser.id, this.configService.get('SECRET'));
                    res.setHeader('X-JWT', jwt);
                    res.setHeader('Access-Control-Expose-Headers', 'X-JWT');
                    const registeredUser = yield this.usersService.register(user.id, {
                        email,
                        firstName,
                        lastName,
                        password,
                        phone
                    });
                    this.ok(res, registeredUser);
                }
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    createUnidentifiedUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield this.usersService.createUser();
                const jwt = yield this.signJWT(newUser.id, this.configService.get('SECRET'));
                res.setHeader('X-JWT', jwt);
                res.setHeader('Access-Control-Expose-Headers', 'X-JWT');
                this.ok(res, newUser);
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    login({ body }, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isUserExist = yield this.usersService.checkUserExist(body.email);
                if (!isUserExist) {
                    this.error(res, 422, 'This user does not exist, please register.');
                    return;
                }
                const result = yield this.usersService.validateUser(body);
                if (result) {
                    const jwt = yield this.signJWT(result.id, this.configService.get('SECRET'));
                    res.setHeader('X-JWT', jwt);
                    res.setHeader('Access-Control-Expose-Headers', 'X-JWT');
                    this.ok(res);
                }
                else {
                    this.error(res, 401, 'Authorisation Error [login].');
                    return;
                }
            }
            catch (error) {
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    me(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.usersService.getUser(req.user.id);
                if (user) {
                    this.ok(res, user);
                }
                else {
                    this.error(res, 404, 'User is not found.');
                }
            }
            catch (error) {
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.usersService.getUser(req.user.id);
                if (user) {
                    if (user.isIdentified) {
                        const updatedUser = yield this.usersService.updateUser(req.user.id, req.body);
                        this.ok(res, updatedUser);
                    }
                    else {
                        this.error(res, 401, 'User is unidentified.');
                    }
                }
                else {
                    this.error(res, 404, 'User is not found.');
                }
            }
            catch (error) {
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    signJWT(id, secret, isAdmin = false) {
        return new Promise((resolve, reject) => {
            (0, jsonwebtoken_1.sign)({
                id,
                isAdmin,
                iat: Math.floor(Date.now() / 1000),
            }, secret, {
                algorithm: 'HS256'
            }, (err, token) => {
                if (err)
                    reject(err);
                resolve(token);
            });
        });
    }
    createAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const name = 'admins';
                const password = '12345678';
                const newAdmin = yield this.usersService.createAdmin(name, password);
                this.ok(res, newAdmin);
            }
            catch (error) {
                console.log(error);
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
    loginAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isAdminExist = yield this.usersService.checkAdminExist(req.body.name);
                if (!isAdminExist) {
                    this.error(res, 422, 'This admin does not exist');
                    return;
                }
                const result = yield this.usersService.validateAdmin(req.body.name, req.body.password);
                if (result) {
                    const jwt = yield this.signJWT(result.id, this.configService.get('SECRET'), true);
                    res.setHeader('X-JWTAdmin', jwt);
                    res.setHeader('Access-Control-Expose-Headers', 'X-JWTAdmin');
                    this.ok(res);
                }
                else {
                    this.error(res, 401, 'Authorisation Error [login].');
                    return;
                }
            }
            catch (error) {
                this.error(res, 500, 'Something was wrong, please try again later!');
            }
        });
    }
};
exports.UsersController = UsersController;
exports.UsersController = UsersController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.ConfigService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.UsersServices)),
    __metadata("design:paramtypes", [Object, Object, users_services_1.UsersServices])
], UsersController);
//# sourceMappingURL=users.controller.js.map
import { Request, Response, NextFunction } from "express";
import { BaseController } from "../common/base.controller";
import { injectable, inject } from "inversify";
import 'reflect-metadata';
import { join, extname } from 'path';
import { TYPES } from "../types";
import { ILogger } from "../logger/logger.interface";
import { IConfigService } from "../config/config.service.interface";
import { sign } from 'jsonwebtoken';
import { AuthMiddleware } from "../common/auth.middleware";
import { ValidatePropertiesMiddleware } from "../common/validateProperties.middleware";
import { UsersServices } from "./users.services";
import fileUpload from "express-fileupload";

@injectable()
export class UsersController extends BaseController {

	constructor(
		@inject(TYPES.ILogger) private loggerservice: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersServices) private usersService: UsersServices,
	) {
		super(loggerservice);
		this.bindRoutes([
			{
				path: '/register', method: 'post', func: this.register,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new ValidatePropertiesMiddleware(['email', 'firstName', 'lastName', 'password', 'phone'])
				]
			},
			{
				path: '/createUnidentifiedUser', method: 'post', func: this.createUnidentifiedUser,
				middlewares: []
			},
			{ path: '/login', method: 'post', func: this.login, middlewares: [new ValidatePropertiesMiddleware(['email', 'password'])] },
			{ path: '/me', method: 'get', func: this.me, middlewares: [new AuthMiddleware(this.configService.get('SECRET'))] },
			{
				path: '/me',
				method: 'put',
				func: this.update,
				middlewares: [
					new AuthMiddleware(this.configService.get('SECRET')),
					new ValidatePropertiesMiddleware(['firstName', 'lastName', 'phone'], true)
				]
			},
			{ path: '/admin', method: 'post', func: this.createAdmin, middlewares: [] },
			{ path: '/admin/login', method: 'post', func: this.loginAdmin, middlewares: [new ValidatePropertiesMiddleware(['name', 'password'])] },
		]);
	}

	async register({ body, user }: Request, res: Response, next: NextFunction): Promise<void> {
		const { email, firstName, lastName, password, phone } = body;

		try {
			const isUserExists = await this.usersService.getUserByEmail(email);
			if (isUserExists) {
				this.error(res, 409, `User with this email -[${email}] already exists`)
				return;
			}

			const foundedUser = await this.usersService.getUser(user.id);
			if (foundedUser) {
				const registeredUser = await this.usersService.register(user.id, {
					email,
					firstName,
					lastName,
					password,
					phone
				})

				this.ok(res, registeredUser);
			} else {
				const newUser = await this.usersService.createUser();
				const jwt = await this.signJWT(newUser.id, this.configService.get('SECRET'));
				res.setHeader('X-JWT', jwt);
				res.setHeader('Access-Control-Expose-Headers', 'X-JWT');

				const registeredUser = await this.usersService.register(user.id, {
					email,
					firstName,
					lastName,
					password,
					phone
				})

				this.ok(res, registeredUser);
			}
		} catch (error) {
			console.log(error);

			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}

	async createUnidentifiedUser(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const newUser = await this.usersService.createUser();

			const jwt = await this.signJWT(newUser.id, this.configService.get('SECRET'));
			res.setHeader('X-JWT', jwt);
			res.setHeader('Access-Control-Expose-Headers', 'X-JWT');

			this.ok(res, newUser);
		} catch (error) {
			console.log(error);
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}

	async login({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const isUserExist = await this.usersService.checkUserExist(body.email);
			if (!isUserExist) {
				this.error(res, 422, 'This user does not exist, please register.');
				return;
			}

			const result = await this.usersService.validateUser(body);
			if (result) {
				const jwt = await this.signJWT(result.id, this.configService.get('SECRET'));
				res.setHeader('X-JWT', jwt);
				res.setHeader('Access-Control-Expose-Headers', 'X-JWT');
				this.ok(res);
			} else {
				this.error(res, 401, 'Authorisation Error [login].');
				return;
			}

		} catch (error) {
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}

	async me(req: Request, res: Response, next: NextFunction): Promise<void> {

		try {
			const user = await this.usersService.getUser(req.user.id)
			if (user) {
				this.ok(res, user);
			} else {
				this.error(res, 404, 'User is not found.');
			}

		} catch (error) {
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}

	async update(req: Request, res: Response, next: NextFunction): Promise<void> {

		try {
			const user = await this.usersService.getUser(req.user.id)
			if (user) {
				if(user.isIdentified) {
					const updatedUser = await this.usersService.updateUser(req.user.id, req.body);
					this.ok(res, updatedUser);
				} else {
					this.error(res, 401, 'User is unidentified.');
				}
			} else {
				this.error(res, 404, 'User is not found.');
			}

		} catch (error) {
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}

	private signJWT(id: string, secret: string, isAdmin = false): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign({
				id,
				isAdmin,
				iat: Math.floor(Date.now() / 1000),
			},
				secret,
				{
					algorithm: 'HS256'
				},
				(err, token) => {
					if (err) reject(err);
					resolve(token as string);
				});
		})
	}

	async createAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const name = 'admins';
			const password = '12345678';
			const newAdmin = await this.usersService.createAdmin(name, password);
			this.ok(res, newAdmin);

		} catch (error) {
			console.log(error);

			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}

	async loginAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const isAdminExist = await this.usersService.checkAdminExist(req.body.name);
			if (!isAdminExist) {
				this.error(res, 422, 'This admin does not exist');
				return;
			}

			const result = await this.usersService.validateAdmin(req.body.name, req.body.password);
			if (result) {
				const jwt = await this.signJWT(result.id, this.configService.get('SECRET'), true);
				res.setHeader('X-JWTAdmin', jwt);
				res.setHeader('Access-Control-Expose-Headers', 'X-JWTAdmin');
				this.ok(res);
			} else {
				this.error(res, 401, 'Authorisation Error [login].');
				return;
			}

		} catch (error) {
			this.error(res, 500, 'Something was wrong, please try again later!');
		}
	}
}

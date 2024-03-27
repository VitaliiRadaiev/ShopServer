import { JwtPayload, verify } from "jsonwebtoken";
import { IMiddleware } from "./middleware.interface";
import { NextFunction, Request, Response } from "express";
import { HTTPError } from "../errors/http-error.class";

interface IJwtPayload extends JwtPayload {
    id: string,
    isAdmin: boolean
}

export class AuthAdminMiddleware implements IMiddleware {
    constructor(private secret: string) {}

    execute(req: Request, res: Response, next: NextFunction): void {
        if(req.headers.authorization) {
            let resutl = verify(req.headers.authorization.split(' ')[1], this.secret) as IJwtPayload; 
            if(resutl.id && resutl.isAdmin) {
                req.user = {
                    id: resutl.id,
                    isAdmin: resutl.isAdmin
                };
                next();
            } else {
                next(new HTTPError(401, 'error of admin authorisation'));
            }
        } else {
            next(new HTTPError(401, 'error of authorisation'));
        }
    }
}
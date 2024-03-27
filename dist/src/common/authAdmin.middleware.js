"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAdminMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const http_error_class_1 = require("../errors/http-error.class");
class AuthAdminMiddleware {
    constructor(secret) {
        this.secret = secret;
    }
    execute(req, res, next) {
        if (req.headers.authorization) {
            let resutl = (0, jsonwebtoken_1.verify)(req.headers.authorization.split(' ')[1], this.secret);
            if (resutl.id && resutl.isAdmin) {
                req.user = {
                    id: resutl.id,
                    isAdmin: resutl.isAdmin
                };
                next();
            }
            else {
                next(new http_error_class_1.HTTPError(401, 'error of admin authorisation'));
            }
        }
        else {
            next(new http_error_class_1.HTTPError(401, 'error of authorisation'));
        }
    }
}
exports.AuthAdminMiddleware = AuthAdminMiddleware;
//# sourceMappingURL=authAdmin.middleware.js.map
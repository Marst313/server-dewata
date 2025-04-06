"use strict";
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
exports.SignInMiddleware = SignInMiddleware;
exports.SignUpMiddleware = SignUpMiddleware;
exports.Protect = Protect;
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const database_1 = require("../config/database");
const user_1 = require("../db/schema/user");
const responseHandler_1 = require("../utils/responseHandler");
const SECRET_KEY = process.env.SECRET_KEY;
function setTokenCookie(res, token) {
    res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
}
function SignInMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (!email || !password)
                return (0, responseHandler_1.handleError)(res, 400, 'Email atau password tidak boleh kosong');
            const user = yield database_1.db
                .select()
                .from(user_1.userModel)
                .where((0, drizzle_orm_1.eq)(user_1.userModel.email, email))
                .then((res) => res[0]);
            if (!user || !(0, bcrypt_1.compareSync)(password, user.password)) {
                return (0, responseHandler_1.handleError)(res, 401, 'Email atau password salah');
            }
            const token = (0, jsonwebtoken_1.sign)({ email: user.email }, SECRET_KEY, { expiresIn: '7d' });
            req.session.token = token;
            setTokenCookie(res, token);
            req.user = Object.assign(Object.assign({}, user), { password: '' });
            return next();
        }
        catch (error) {
            console.error('SignInMiddleware Error:', error);
            return next(error);
        }
    });
}
function SignUpMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password, name } = req.body;
            if (!email || !password || !name) {
                return (0, responseHandler_1.handleError)(res, 400, 'Nama, email, dan password wajib diisi');
            }
            const existingUser = yield database_1.db
                .select()
                .from(user_1.userModel)
                .where((0, drizzle_orm_1.eq)(user_1.userModel.email, email))
                .then((res) => res[0]);
            if (existingUser) {
                return (0, responseHandler_1.handleError)(res, 400, 'Email sudah terdaftar');
            }
            req.body.password = yield (0, bcrypt_1.hash)(password, 10);
            return next();
        }
        catch (error) {
            console.error('SignUpMiddleware Error:', error);
            return next(error);
        }
    });
}
function Protect(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (!token)
                return (0, responseHandler_1.handleError)(res, 401, 'Autentikasi gagal, silakan login kembali');
            const payload = (0, jsonwebtoken_1.verify)(token, SECRET_KEY);
            const user = yield database_1.db
                .select()
                .from(user_1.userModel)
                .where((0, drizzle_orm_1.eq)(user_1.userModel.email, payload.email))
                .then((res) => res[0]);
            if (!user)
                return (0, responseHandler_1.handleError)(res, 401, 'Autentikasi gagal, user tidak ditemukan');
            req.user = Object.assign(Object.assign({}, user), { password: '' });
            return next();
        }
        catch (error) {
            console.error('Protect Middleware Error:', error);
            return (0, responseHandler_1.handleError)(res, 403, 'Token tidak valid atau sudah expired');
        }
    });
}

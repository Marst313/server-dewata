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
exports.signIn = signIn;
exports.signUp = signUp;
exports.signOut = signOut;
exports.getMe = getMe;
const database_1 = require("../config/database");
const user_1 = require("../db/schema/user");
const responseHandler_1 = require("../utils/responseHandler");
function signIn(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            if (!user)
                return (0, responseHandler_1.handleError)(res, 401, 'User tidak ada');
            return (0, responseHandler_1.handleSuccess)(res, 200, 'Berhasil sign in', {
                email: user.email,
                name: user.name,
                id: user.id,
                accessToken: req.session.token,
            });
        }
        catch (error) {
            console.error(error);
            return (0, responseHandler_1.handleError)(res, 500, 'Terjadi kesalahan di server');
        }
    });
}
function signUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password, name } = req.body;
            const newUser = yield database_1.db.insert(user_1.userModel).values({ email, password, name }).returning();
            return (0, responseHandler_1.handleSuccess)(res, 201, 'Berhasil mendaftar', {
                email: newUser[0].email,
                name: newUser[0].name,
                id: newUser[0].id,
                accessToken: req.session.token,
            });
        }
        catch (error) {
            console.error(error);
            return (0, responseHandler_1.handleError)(res, 500, 'Terjadi kesalahan');
        }
    });
}
function signOut(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            req.session.destroy((err) => {
                if (err)
                    return (0, responseHandler_1.handleError)(res, 500, 'Gagal sign out');
                return (0, responseHandler_1.handleSuccess)(res, 200, 'Berhasil sign out');
            });
        }
        catch (error) {
            console.error(error);
            return (0, responseHandler_1.handleError)(res, 500, 'Terjadi kesalahan di server');
        }
    });
}
function getMe(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!(req === null || req === void 0 ? void 0 : req.user))
                return (0, responseHandler_1.handleError)(res, 401, 'User tidak terautentikasi');
            return (0, responseHandler_1.handleSuccess)(res, 200, 'User is authenticated', {
                email: req.user.email,
                name: req.user.name,
                id: req.user.id,
            });
        }
        catch (error) {
            console.error(error);
            return (0, responseHandler_1.handleError)(res, 500, 'Terjadi kesalahan di server');
        }
    });
}

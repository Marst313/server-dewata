"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = handleError;
exports.handleSuccess = handleSuccess;
function handleError(res, statusCode, message) {
    res.status(statusCode).json({ status: 'error', statusCode, message });
    return;
}
function handleSuccess(res, statusCode, message, data) {
    res.status(statusCode).json({ status: 'success', statusCode, message, data });
    return;
}

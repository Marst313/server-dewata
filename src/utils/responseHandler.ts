// src/utils/responseHandler.ts
import { Response } from 'express';

export function handleError(res: Response, statusCode: number, message: string) {
  res.status(statusCode).json({ status: 'error', statusCode, message });
  return;
}

export function handleSuccess(res: Response, statusCode: number, message: string, data?: any) {
  res.status(statusCode).json({ status: 'success', statusCode, message, data });
  return;
}

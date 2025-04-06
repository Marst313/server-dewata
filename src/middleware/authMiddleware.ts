import { eq } from 'drizzle-orm';
import { compareSync, hash } from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';

import { db } from '../config/database';
import { userModel } from '../db/schema/user';
import { handleError } from '../utils/responseHandler';

const SECRET_KEY = process.env.SECRET_KEY as string;

function setTokenCookie(res: Response, token: string) {
  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}

export async function SignInMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) return handleError(res, 400, 'Email atau password tidak boleh kosong');

    const user = await db
      .select()
      .from(userModel)
      .where(eq(userModel.email, email))
      .then((res) => res[0]);

    if (!user || !compareSync(password, user.password)) {
      return handleError(res, 401, 'Email atau password salah');
    }

    const token = sign({ email: user.email }, SECRET_KEY, { expiresIn: '7d' });
    req.session.token = token;
    setTokenCookie(res, token);
    req.user = { ...user, password: '' };

    return next();
  } catch (error) {
    console.error('SignInMiddleware Error:', error);
    return next(error);
  }
}

export async function SignUpMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return handleError(res, 400, 'Nama, email, dan password wajib diisi');
    }

    const existingUser = await db
      .select()
      .from(userModel)
      .where(eq(userModel.email, email))
      .then((res) => res[0]);

    if (existingUser) {
      return handleError(res, 400, 'Email sudah terdaftar');
    }

    req.body.password = await hash(password, 10);
    return next();
  } catch (error) {
    console.error('SignUpMiddleware Error:', error);
    return next(error);
  }
}

export async function Protect(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return handleError(res, 401, 'Autentikasi gagal, silakan login kembali');

    const payload = verify(token, SECRET_KEY) as { email: string };

    const user = await db
      .select()
      .from(userModel)
      .where(eq(userModel.email, payload.email))
      .then((res) => res[0]);

    if (!user) return handleError(res, 401, 'Autentikasi gagal, user tidak ditemukan');

    req.user = { ...user, password: '' };
    return next();
  } catch (error) {
    console.error('Protect Middleware Error:', error);
    return handleError(res, 403, 'Token tidak valid atau sudah expired');
  }
}

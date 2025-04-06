import { Request, Response } from 'express';

import { db } from '../config/database';
import { userModel } from '../db/schema/user';
import { handleError, handleSuccess } from '../utils/responseHandler';

export async function signIn(req: Request, res: Response) {
  try {
    const user = req.user;

    if (!user) return handleError(res, 401, 'User tidak ada');

    return handleSuccess(res, 200, 'Berhasil sign in', {
      email: user.email,
      name: user.name,
      id: user.id,
      accessToken: req.session.token,
    });
  } catch (error) {
    console.error(error);
    return handleError(res, 500, 'Terjadi kesalahan di server');
  }
}

export async function signUp(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;
    const newUser = await db.insert(userModel).values({ email, password, name }).returning();

    return handleSuccess(res, 201, 'Berhasil mendaftar', newUser[0]);
  } catch (error) {
    console.error(error);
    return handleError(res, 500, 'Terjadi kesalahan');
  }
}

export async function signOut(req: Request, res: Response) {
  try {
    req.session.destroy((err) => {
      if (err) return handleError(res, 500, 'Gagal sign out');
      return handleSuccess(res, 200, 'Berhasil sign out');
    });
  } catch (error) {
    console.error(error);
    return handleError(res, 500, 'Terjadi kesalahan di server');
  }
}

export async function getMe(req: Request, res: Response) {
  try {
    if (!req?.user) return handleError(res, 401, 'User tidak terautentikasi');

    return handleSuccess(res, 200, 'User is authenticated', {
      email: req.user.email,
      name: req.user.name,
      id: req.user.id,
    });
  } catch (error) {
    console.error(error);
    return handleError(res, 500, 'Terjadi kesalahan di server');
  }
}

import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';

import authRouter from './route/authRoutes';
import pelangganRouter from './route/pelangganRoutes';
import { handleError } from './utils/responseHandler';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SECRET_KEY as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/auth', authRouter);
app.use('/api/v1/pelanggan', pelangganRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  return next(handleError(res, 404, 'Route not found'));
});

export default app;

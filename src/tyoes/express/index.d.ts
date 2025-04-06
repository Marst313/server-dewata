// types/express/index.d.ts
import { User } from '@/src/db/schema/user';
import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    token?: string;
    user?: User;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}

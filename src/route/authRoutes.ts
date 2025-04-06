import { Router } from 'express';
import { Protect, SignInMiddleware, SignUpMiddleware } from '../middleware/authMiddleware';
import { getMe, signIn, signOut, signUp } from '../controller/authController';

const router = Router();

router.post('/sign-in', SignInMiddleware, signIn);
router.post('/sign-up', SignUpMiddleware, signUp);
router.post('/sign-out', signOut);
router.get('/me', Protect, getMe);

export default router;

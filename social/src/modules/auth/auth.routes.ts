import { Router } from 'express';
import { register, login, logout } from './auth.controller';
import { AuthenticatedRequest, requireAuth } from '../../shared/middlewares/requireAuth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// For testing only
router.get('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  // If the code reaches here, the middleware successfully verified the token!
  res.status(200).json({ 
    message: "You have accessed a protected route!", 
    yourUserId: req.user?.id 
  });
});

export default router;
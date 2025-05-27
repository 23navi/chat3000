import express from 'express';
import validateResource from '../middlewares/validateResources';
import { createUserSchema } from '../schemas/user.schema';
import { registerUser, currentUser } from '../controllers/user.controller';
import requireAuth from '../middlewares/requireAuth';

const router = express.Router();

router.post('/register', validateResource(createUserSchema), registerUser);

router.get('/me', requireAuth, currentUser);

export default router;

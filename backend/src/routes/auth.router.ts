import express from 'express';
const router = express.Router();
import validateRequest from '../middlewares/validateResources';
import { createSessionSchema } from '../schemas/auth.schema';
import { creatSessionHandler, refreshSessionHandler } from '../controllers/auth.controller';

router.post('/session', validateRequest(createSessionSchema), creatSessionHandler);

router.post('/session/refresh', refreshSessionHandler);

export default router;

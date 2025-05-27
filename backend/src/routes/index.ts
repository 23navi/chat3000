import userRouter from './user.router';
import authRouter from './auth.router';
import express from 'express';
const router = express.Router();

router.get('/healthcheck', (_, res) => {
  res.status(200).json({
    status: 'available',
    systemInfo: {
      env: process.env.NODE_ENV,

      version: process.env.npm_package_version,
    },
  });
});

router.use('/users', userRouter);
router.use('/auth', authRouter);

export default router;

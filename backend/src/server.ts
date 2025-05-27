import express from 'express';
import 'express-async-errors'; // Handles all async errors
import cookieParser from 'cookie-parser';
import { MONGO_URI, PORT, NODE_ENV, CORS_ORIGIN_LIST } from './config';
import { connectToMongodb } from './connections/mongodb';
import errorHandler from './middlewares/error-handler';
import routes from './routes';
import { deleteExpiredSession, } from './corns';
import deserializeUser from './middlewares/deserialize-user';
import cors from "cors";


const app = express();

app.use(
  cors({
    origin: CORS_ORIGIN_LIST,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(deserializeUser);

app.get('/', (req, res) => {
  res.send('API is UP');
});

app.use("/api", routes);

app.use(errorHandler);

app.listen(PORT, () => {
  connectToMongodb(MONGO_URI);
  console.info(`Server: Listening on port ${PORT} in ${NODE_ENV} mode`);
  console.info({ app_version: process.env.npm_package_version });
});

// Running cron jobs
deleteExpiredSession();
// testCron();

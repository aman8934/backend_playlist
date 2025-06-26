import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({limit : '16kb'}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

import userRouter from './routes/user.routes.js'

// since we are handling router seperately by routes so we cant use app.get we hv to use middleware userRouter
app.use('/api/v1/users' , userRouter)

// url will be 'https://localhost:8000/api/v1/users/register"

export {app};

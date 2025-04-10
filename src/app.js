import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors';
import authRouter from './routes/authRoute.js';
import categoryRoutes from '/routes/categoryRoutes.js';
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";


const app = express();
connectDB();

app.use(cors({
  origin: "http://localhost:5173",  // your frontend origin
  credentials: true,                // allow cookies / auth headers
}));
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser());

app.use('/api/v1/auth',authRouter);
app.use("/api/v1/category", categoryRoutes);


export { app };
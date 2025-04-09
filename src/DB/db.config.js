import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
export const connectDB = (async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`MONGO DB CONNCECTED , DB HOST : ${connectionInstance.connection.host}`)
  } catch (error) {
    console.log(`MIONGO DB conncetion error: `, error);
    process.exit(1);
  }
})
import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {
      useNewUrlParser: true, // still okay to keep
      // 🔥 Removed useUnifiedTopology
    });

    console.log(`✅ MONGO DB CONNECTED, HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(`❌ MONGO DB CONNECTION ERROR:`, error);
    process.exit(1);
  }
};

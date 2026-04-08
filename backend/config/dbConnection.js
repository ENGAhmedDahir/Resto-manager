import mongoose from "mongoose";
import { DBurl } from "./config.js";

export const connectDb = async () => {
  try {
    await mongoose.connect(DBurl).then(() => {
      console.log("connected to db");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

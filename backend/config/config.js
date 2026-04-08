import dotenv from "dotenv";

dotenv.config();
export const DBurl = process.env.DATABASE;
export const NODE_ENV = process.env.NODE_ENV;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIES_IN = process.env.JWT_EXPIES_IN;
export const JWT_COOKIE_EXPRISE_IN = process.env.JWT_COOKIE_EXPRISE_IN;

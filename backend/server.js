import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDb } from "./config/dbConnection.js";
import userRouter from "./routes/userRoute.js";
import { golobalError } from "./controllers/errorController.js";
import AppError from "./utils/appError.js";
import categoryRouter from "./routes/categoryRoute.js";
import menuRouter from "./routes/menuRoute.js";
import orderRouter from "./routes/orderRoute.js";
import reportRouter from "./routes/reportsRoute.js";
import inventoryRouter from "./routes/inventoryRoute.js";
import tableRouter from "./routes/tableRoute.js";
import settingRouter from "./routes/settingRoute.js";
import categoryInventoryRouter from "./routes/categoryInventoryRoute.js";

import path from "path";

const app = express();

// Morgan middleware
app.use(morgan("dev"));
const __dirname = path.resolve();

// body purser
app.use(express.json());
// cookie purser
app.use(cookieParser());

// cors

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/menu", menuRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/reports", reportRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/tables", tableRouter);
app.use("/api/v1/settings", settingRouter);
app.use("/api/v1/category-inventory", categoryInventoryRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.all("/{*any}", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(golobalError);

const PORT = 8000;
connectDb();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

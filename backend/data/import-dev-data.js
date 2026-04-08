import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { connectDb } from "../config/dbConnection.js";
import Category from "../models/categoryModel.js";
import MenuItem from "../models/menuItemModel.js";
import Order from "../models/orderModel.js";

// 🔹 ES Modules __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to DB
connectDb();

// READ JSON FILE
const categories = JSON.parse(
  fs.readFileSync(path.join(__dirname, "categories.json"), "utf-8")
);
const menuItems = JSON.parse(
  fs.readFileSync(path.join(__dirname, "menuItems.json"), "utf-8")
);
const ordersData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "orders.json"), "utf-8")
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Category.create(categories);
    await MenuItem.create(menuItems);
    await Order.create(ordersData);
    console.log("Data Imported...");
    process.exit();
  } catch (e) {
    console.error("Error importing data", e);
    process.exit(1);
  }
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Category.deleteMany();
    await MenuItem.deleteMany();
    await Order.deleteMany();
    console.log("Data deleted...");
    process.exit();
  } catch (e) {
    console.error("Error deleting data", e);
    process.exit(1);
  }
};

// Run based on CLI argument
if (process.argv[2] === "import") {
  importData();
} else if (process.argv[2] === "delete") {
  deleteData();
} else {
  console.log("Please provide 'import' or 'delete' argument");
}

// Run this

// node data/import-dev-data.js import
// node data/import-dev-data.js delete

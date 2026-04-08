import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
    {
        tableNumber: {
            type: Number,
            // type: String, // String to allow "T1", "A2" etc.
            required: [true, "Table number is required"],
            unique: true,
            trim: true,
        },
        capacity: {
            type: Number,
            required: [true, "Capacity is required"],
            min: 1,
        },
        status: {
            type: String,
            enum: ["available", "occupied", "reserved"],
            default: "available",
        },
    },
    { timestamps: true }
);

const Table = mongoose.model("Table", tableSchema);
export default Table;

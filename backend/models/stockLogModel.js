import mongoose from "mongoose";

const stockLogSchema = new mongoose.Schema(
    {
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Inventory",
            required: true,
        },
        type: {
            type: String,
            enum: ["IN", "OUT"],
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
        },
        reason: {
            type: String,
            trim: true,
        },
        doneBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            // required: true, // Optional: might be system-generated
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const StockLog = mongoose.model("StockLog", stockLogSchema);
export default StockLog;

import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
    {
        taxRate: {
            type: Number,
            required: true,
            default: 0,
        },
        // Future settings can be added here
    },
    { timestamps: true }
);

const Setting = mongoose.model("Setting", settingSchema);
export default Setting;

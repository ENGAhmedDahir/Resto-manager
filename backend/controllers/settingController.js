import Setting from "../models/settingModel.js";
import { CatchAsync } from "../utils/CatchAsync.js";
import AppError from "../utils/appError.js";

export const getSettings = CatchAsync(async (req, res, next) => {
    let settings = await Setting.findOne();

    if (!settings) {
        settings = await Setting.create({ taxRate: 0 });
    }

    res.status(200).json({
        status: "success",
        data: settings,
    });
});

export const updateSettings = CatchAsync(async (req, res, next) => {
    let settings = await Setting.findOne();

    if (!settings) {
        settings = await Setting.create(req.body);
    } else {
        // Update fields
        const allowedFields = ["taxRate"];
        Object.keys(req.body).forEach((key) => {
            if (allowedFields.includes(key)) {
                settings[key] = req.body[key];
            }
        });
        await settings.save();
    }

    res.status(200).json({
        status: "success",
        data: settings,
    });
});

import Table from "../models/tableModel.js";
import { CatchAsync } from "../utils/CatchAsync.js";
import AppError from "../utils/appError.js";

export const createTable = CatchAsync(async (req, res, next) => {
    const { tableNumber, capacity } = req.body || {};

    const existingTable = await Table.findOne({ tableNumber });
    if (existingTable) {
        return next(new AppError("Table number already exists", 400));
    }

    const newTable = await Table.create({
        tableNumber,
        capacity,
    });

    res.status(201).json({
        status: "success",
        data: {
            table: newTable,
        },
    });
});

export const getAllTables = CatchAsync(async (req, res, next) => {
    const tables = await Table.find().sort({ tableNumber: 1 });

    res.status(200).json({
        status: "success",
        results: tables.length,
        data: tables,

    });
});

export const getTable = CatchAsync(async (req, res, next) => {
    const table = await Table.findById(req.params.id);

    if (!table) {
        return next(new AppError("Table not found", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            table,
        },
    });
});

export const updateTable = CatchAsync(async (req, res, next) => {
    const { tableNumber, capacity, status } = req.body;

    // If updating table number, check if it conflicts
    if (tableNumber) {
        const existingTable = await Table.findOne({
            tableNumber,
            _id: { $ne: req.params.id },
        });
        if (existingTable) {
            return next(new AppError("Table number already exists", 400));
        }
    }

    const table = await Table.findByIdAndUpdate(
        req.params.id,
        { tableNumber, capacity, status },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!table) {
        return next(new AppError("Table not found", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            table,
        },
    });
});

export const updateTableStatus = CatchAsync(async (req, res, next) => {
    const { status } = req.body;

    if (!["available", "occupied", "reserved"].includes(status)) {
        return next(new AppError("Invalid table status", 400));
    }

    const table = await Table.findByIdAndUpdate(
        req.params.id,
        { status },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!table) {
        return next(new AppError("Table not found", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            table,
        },
    });
});

export const deleteTable = CatchAsync(async (req, res, next) => {
    const table = await Table.findByIdAndDelete(req.params.id);

    if (!table) {
        return next(new AppError("Table not found", 404));
    }

    res.status(204).json({
        status: "success",
        data: null,
    });
});

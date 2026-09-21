const mongoose = require("mongoose");

const cropHealthSchema = new mongoose.Schema(
    {
        health: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        healthScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        status: {
            type: String,
            default: "UNKNOWN"
        },
        diagnosis: {
            type: String,
            default: "ANALYZING"
        },
        imageUrl: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("CropHealth", cropHealthSchema);

const mongoose = require("mongoose");

const pestDetectionSchema = new mongoose.Schema(
    {
        // =====================================================
        // PEST TYPE
        // =====================================================
        pestType: {
            type: String,
            required: true,
            trim: true
        },

        // =====================================================
        // AI CONFIDENCE
        // =====================================================
        confidence: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        // =====================================================
        // NUMBER OF PESTS
        // =====================================================
        pestCount: {
            type: Number,
            default: 0,
            min: 0
        },

        // =====================================================
        // IMAGE
        // =====================================================
        imageUrl: {
            type: String,
            default: null,
            trim: true
        },

        // =====================================================
        // DETECTION STATUS
        // =====================================================
        status: {
            type: String,
            enum: [
                "DETECTED",
                "NOT_DETECTED",
                "REVIEW",
                "RESOLVED"
            ],
            default: "DETECTED"
        },

        // =====================================================
        // CAMERA SOURCE
        // =====================================================
        cameraId: {
            type: String,
            default: null,
            trim: true
        },

        // =====================================================
        // ADDITIONAL INFORMATION
        // =====================================================
        notes: {
            type: String,
            default: "",
            trim: true
        },

        // =====================================================
        // DETECTION TIME
        // =====================================================
        detectedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);


// =====================================================
// PREVENT OverwriteModelError
// =====================================================

module.exports =
    mongoose.models.PestDetection ||
    mongoose.model(
        "PestDetection",
        pestDetectionSchema
    );
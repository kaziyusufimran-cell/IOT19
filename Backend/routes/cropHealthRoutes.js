const express = require("express");
const router = express.Router();
const CropHealth = require("../models/CropHealth");

function toNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}

function normalizeHealth(doc) {
    if (!doc) {
        return {
            health: 0,
            healthScore: 0,
            status: "UNKNOWN",
            diagnosis: "ANALYZING",
            imageUrl: ""
        };
    }

    const score = toNumber(
        doc.healthScore ?? doc.health ?? doc.score,
        0
    );

    return {
        health: score,
        healthScore: score,
        status: doc.status || doc.healthStatus || "UNKNOWN",
        diagnosis:
            doc.diagnosis ||
            doc.disease ||
            doc.result ||
            doc.prediction ||
            "ANALYZING",
        imageUrl: doc.imageUrl || "",
        createdAt: doc.createdAt
    };
}

// GET /api/crop-health/latest
router.get("/latest", async (req, res) => {
    try {
        const health = await CropHealth.findOne()
            .sort({ createdAt: -1 })
            .lean();

        return res.json({
            success: true,
            data: normalizeHealth(health)
        });
    } catch (error) {
        console.error("Latest crop health error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch latest crop health",
            error: error.message
        });
    }
});

// GET /api/crop-health
router.get("/", async (req, res) => {
    try {
        const health = await CropHealth.find()
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        return res.json({
            success: true,
            count: health.length,
            data: health.map(normalizeHealth)
        });
    } catch (error) {
        console.error("Crop health history error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch crop health history",
            error: error.message
        });
    }
});

// POST /api/crop-health
router.post("/", async (req, res) => {
    try {
        const body = req.body || {};

        const score = toNumber(
            body.healthScore ?? body.health ?? body.score,
            0
        );

        if (score < 0 || score > 100) {
            return res.status(400).json({
                success: false,
                message: "Health score must be between 0 and 100"
            });
        }

        const cropHealth = await CropHealth.create({
            health: score,
            healthScore: score,
            status:
                body.status ||
                body.healthStatus ||
                "UNKNOWN",
            diagnosis:
                body.diagnosis ||
                body.disease ||
                body.result ||
                body.prediction ||
                "ANALYZING",
            imageUrl: body.imageUrl || ""
        });

        return res.status(201).json({
            success: true,
            message: "Crop health saved successfully",
            data: normalizeHealth(cropHealth.toObject())
        });
    } catch (error) {
        console.error("Save crop health error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to save crop health",
            error: error.message
        });
    }
});

module.exports = router;

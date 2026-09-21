const express = require("express");
const router = express.Router();

const PestDetection =
    require("../models/PestDetection");


// ============================================================
// GET ALL PEST DETECTIONS
// GET /api/pests
// ============================================================

router.get("/", async (req, res) => {
    try {

        const pests = await PestDetection
            .find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: pests.length,
            pests
        });

    } catch (error) {

        console.error(
            "GET /api/pests error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch pest detections",
            error: error.message
        });
    }
});


// ============================================================
// GET LATEST PEST DETECTION
// GET /api/pests/latest
// ============================================================

router.get("/latest", async (req, res) => {
    try {

        const pest = await PestDetection
            .findOne()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            pest
        });

    } catch (error) {

        console.error(
            "GET /api/pests/latest error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch latest pest detection",
            error: error.message
        });
    }
});


// ============================================================
// GET PEST DETECTIONS BY TYPE
// GET /api/pests/type/:type
// ============================================================

router.get("/type/:type", async (req, res) => {
    try {

        const pests = await PestDetection
            .find({
                pestType: req.params.type
            })
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            success: true,
            count: pests.length,
            pests
        });

    } catch (error) {

        console.error(
            "GET /api/pests/type error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch pest type",
            error: error.message
        });
    }
});


// ============================================================
// CREATE PEST DETECTION
// POST /api/pests
// ============================================================

router.post("/", async (req, res) => {
    try {

        const {
            pestType,
            confidence,
            pestCount,
            imageUrl,
            status
        } = req.body;


        if (!pestType) {
            return res.status(400).json({
                success: false,
                message: "pestType is required"
            });
        }


        const pest = new PestDetection({

            pestType,

            confidence:
                confidence !== undefined
                    ? confidence
                    : 0,

            pestCount:
                pestCount !== undefined
                    ? pestCount
                    : 0,

            imageUrl:
                imageUrl || null,

            status:
                status || "DETECTED"
        });


        await pest.save();


        res.status(201).json({
            success: true,
            message: "Pest detection created successfully",
            pest
        });

    } catch (error) {

        console.error(
            "POST /api/pests error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to create pest detection",
            error: error.message
        });
    }
});


// ============================================================
// GET PEST BY ID
// GET /api/pests/:id
// ============================================================

router.get("/:id", async (req, res) => {
    try {

        const pest =
            await PestDetection.findById(
                req.params.id
            );


        if (!pest) {
            return res.status(404).json({
                success: false,
                message: "Pest detection not found"
            });
        }


        res.status(200).json({
            success: true,
            pest
        });

    } catch (error) {

        console.error(
            "GET /api/pests/:id error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch pest detection",
            error: error.message
        });
    }
});


// ============================================================
// DELETE PEST DETECTION
// DELETE /api/pests/:id
// ============================================================

router.delete("/:id", async (req, res) => {
    try {

        const pest =
            await PestDetection.findByIdAndDelete(
                req.params.id
            );


        if (!pest) {
            return res.status(404).json({
                success: false,
                message: "Pest detection not found"
            });
        }


        res.status(200).json({
            success: true,
            message: "Pest detection deleted successfully",
            pest
        });

    } catch (error) {

        console.error(
            "DELETE /api/pests/:id error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to delete pest detection",
            error: error.message
        });
    }
});


module.exports = router;
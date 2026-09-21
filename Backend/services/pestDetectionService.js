const PestDetection =
    require("../models/PestDetection");

const thresholds =
    require("../config/thresholds");


function calculateSeverity(confidence, count) {

    if (
        confidence >=
        thresholds.pest.criticalConfidence ||
        count >= 10
    ) {
        return "CRITICAL";
    }

    if (
        confidence >=
        thresholds.pest.warningConfidence ||
        count >= 5
    ) {
        return "HIGH";
    }

    if (count >= 2) {
        return "MEDIUM";
    }

    return "LOW";
}


async function savePestDetection({
    pestName,
    confidence,
    count = 1,
    imagePath = "",
    detectedBy = "AI",
    notes = ""
}) {

    const severity =
        calculateSeverity(
            Number(confidence),
            Number(count)
        );

    const detection =
        await PestDetection.create({

            pestName,

            confidence:
                Number(confidence),

            count:
                Number(count),

            severity,

            imagePath,

            detectedBy,

            notes
        });

    return detection;
}


async function getRecentPests(limit = 20) {

    return PestDetection
        .find()
        .sort({
            detectedAt: -1
        })
        .limit(Number(limit));
}


module.exports = {
    savePestDetection,
    getRecentPests,
    calculateSeverity
};
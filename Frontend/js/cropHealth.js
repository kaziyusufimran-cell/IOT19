
// =====================================================
// AI CROP HEALTH
// =====================================================

const CROP_HEALTH_API =
    "http://localhost:5000/api/crop-health/latest";


// =====================================================
// LOAD AI CROP HEALTH
// =====================================================

async function loadCropHealth() {

    try {

        console.log("🤖 Loading AI Crop Health...");


        // =================================================
        // FETCH API
        // =================================================

        const response =
            await fetch(
                CROP_HEALTH_API
            );


        if (!response.ok) {

            throw new Error(
                "Crop health API error: " +
                response.status
            );

        }


        const result =
            await response.json();


        console.log(
            "🤖 Crop Health API:",
            result
        );


        // =================================================
        // GET DATA
        // =================================================

        const data =
            result.data ||
            {};


        // =================================================
        // HEALTH SCORE
        // API:
        // healthScore: 92
        // health: 92
        // =================================================

        const health =
            Number(
                data.healthScore ??
                data.health ??
                data.score ??
                0
            );


        // =================================================
        // STATUS
        // API:
        // status: "Healthy"
        // =================================================

        const status =
            data.status ||
            data.healthStatus ||
            "UNKNOWN";


        // =================================================
        // DIAGNOSIS
        // API:
        // diagnosis: "Excellent"
        // =================================================

        const diagnosis =
            data.diagnosis ||
            data.disease ||
            data.result ||
            data.prediction ||
            "ANALYZING";


        // =================================================
        // IMAGE
        // =================================================

        const imageUrl =
            data.imageUrl ||
            "";


        // =================================================
        // UPDATE HEALTH SCORE
        // HTML ID:
        // healthScore
        // =================================================

        const scoreElement =
            document.getElementById(
                "healthScore"
            );


        if (scoreElement) {

            scoreElement.textContent =
                health > 0
                    ? Math.round(health) + "%"
                    : "0%";

        }


        // =================================================
        // UPDATE STATUS
        // HTML ID:
        // healthStatus
        // =================================================

        const statusElement =
            document.getElementById(
                "healthStatus"
            );


        if (statusElement) {

            statusElement.textContent =
                status;

        }


        // =================================================
        // UPDATE DIAGNOSIS / MESSAGE
        // HTML ID:
        // healthMessage
        // =================================================

        const messageElement =
            document.getElementById(
                "healthMessage"
            );


        if (messageElement) {

            messageElement.textContent =
                diagnosis;

        }


        // =================================================
        // UPDATE BADGE
        // HTML ID:
        // healthBadge
        // =================================================

        const badgeElement =
            document.getElementById(
                "healthBadge"
            );


        if (badgeElement) {

            badgeElement.textContent =
                status.toUpperCase();

        }


        // =================================================
        // OPTIONAL IMAGE
        // =================================================

        if (imageUrl) {

            const imageElement =
                document.getElementById(
                    "cropHealthImage"
                );


            if (imageElement) {

                imageElement.src =
                    "http://localhost:5000" +
                    imageUrl;

                imageElement.style.display =
                    "block";

            }

        }


        // =================================================
        // LOG SUCCESS
        // =================================================

        console.log(
            "✅ Crop Health updated successfully"
        );

        console.log(
            "Health:",
            health
        );

        console.log(
            "Status:",
            status
        );

        console.log(
            "Diagnosis:",
            diagnosis
        );


    }

    catch (error) {

        console.error(
            "❌ Crop Health error:",
            error
        );


        // =================================================
        // FALLBACK
        // =================================================

        updateCropHealthElement(
            "healthScore",
            "0%"
        );

        updateCropHealthElement(
            "healthStatus",
            "UNKNOWN"
        );

        updateCropHealthElement(
            "healthMessage",
            "ANALYZING"
        );

        updateCropHealthElement(
            "healthBadge",
            "ANALYZING"
        );

    }

}


// =====================================================
// SAFE DOM UPDATE
// =====================================================

function updateCropHealthElement(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        console.warn(
            "⚠️ Crop Health element not found:",
            id
        );

        return;

    }


    element.textContent =
        value ?? "--";

}
// =====================================================
// SAFE HTML UPDATE
// =====================================================

function updateCropHealthElement(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (!element) {

        console.warn(
            "Element not found:",
            id
        );

        return;
    }

    element.textContent =
        value ?? "--";
}
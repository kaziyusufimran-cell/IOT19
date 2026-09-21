// =====================================================
// CROP GROWTH
// =====================================================

const CROP_GROWTH_API =
    "http://localhost:5000/api/crop-growth";


// =====================================================
// LOAD CROP GROWTH
// =====================================================

async function loadCropGrowth() {

    try {

        const response =
            await fetch(CROP_GROWTH_API);

        if (!response.ok) {

            throw new Error(
                `Crop health API failed: ${response.status}`
            );

        }

        const result =
            await response.json();

        if (!result.success) {

            throw new Error(
                result.message ||
                "Failed to load crop health"
            );

        }

        const data =
            result.data || {};

        updateCropGrowth(data);

        return data;

    } catch (error) {

        console.error(
            "Crop growth error:",
            error
        );

        updateCropGrowthError();

        return null;
    }
}


// =====================================================
// UPDATE CROP GROWTH UI
// =====================================================

function updateCropGrowth(data) {

    // -------------------------------------------------
    // Plant height
    // -------------------------------------------------

    setText(
        [
            "#plantHeight",
            "#plant-height",
            "[data-crop-value='plantHeight']"
        ],
        `${numberValue(data.plantHeight)} cm`
    );


    // -------------------------------------------------
    // Leaf count
    // -------------------------------------------------

    setText(
        [
            "#leafCount",
            "#leaf-count",
            "[data-crop-value='leafCount']"
        ],
        `${numberValue(data.leafCount)}`
    );


    // -------------------------------------------------
    // Growth rate
    // -------------------------------------------------

    setText(
        [
            "#growthRate",
            "#growth-rate",
            "[data-crop-value='growthRate']"
        ],
        `${numberValue(data.growthRate)}`
    );


    // -------------------------------------------------
    // Growth stage
    // -------------------------------------------------

    setText(
        [
            "#growthStage",
            "#growth-stage",
            "[data-crop-value='growthStage']"
        ],
        data.growthStage || "Seedling"
    );


    // -------------------------------------------------
    // Health score
    // -------------------------------------------------

    setText(
        [
            "#healthScore",
            "#health-score",
            "[data-crop-value='healthScore']"
        ],
        `${numberValue(data.healthScore)}%`
    );


    // -------------------------------------------------
    // Health status
    // -------------------------------------------------

    setText(
        [
            "#healthStatus",
            "#health-status",
            "[data-crop-value='healthStatus']"
        ],
        data.healthStatus || "UNKNOWN"
    );


    // -------------------------------------------------
    // Crop name
    // -------------------------------------------------

    setText(
        [
            "#cropName",
            "#crop-name",
            "[data-crop-value='cropName']"
        ],
        data.cropName || "Tomato"
    );


    // -------------------------------------------------
    // Disease
    // -------------------------------------------------

    const disease =
        data.diseaseDetected
            ? (
                data.diseaseName ||
                "Disease detected"
            )
            : "None detected";


    setText(
        [
            "#diseaseName",
            "#disease-name",
            "[data-crop-value='diseaseName']"
        ],
        disease
    );


    // -------------------------------------------------
    // Health message
    // -------------------------------------------------

    setText(
        [
            "#healthMessage",
            "#health-message",
            "[data-crop-value='healthMessage']"
        ],
        data.message || ""
    );


    // -------------------------------------------------
    // Crop image
    // -------------------------------------------------

    updateCropImage(
        data.cropImage
    );


    // -------------------------------------------------
    // Health circle
    // -------------------------------------------------

    updateHealthCircle(
        data.healthScore
    );


    // -------------------------------------------------
    // Status classes
    // -------------------------------------------------

    updateHealthStatusClass(
        data.healthStatus
    );

}


// =====================================================
// UPDATE CROP IMAGE
// =====================================================

function updateCropImage(
    imagePath
) {

    if (!imagePath) {
        return;
    }


    let image =
        document.querySelector(
            "#cropImage"
        );


    if (!image) {

        image =
            document.querySelector(
                ".crop-image"
            );

    }


    if (!image) {
        return;
    }


    let finalPath =
        imagePath;


    // Backend may return:
    // /uploads/crops/file.jpg

    if (
        imagePath.startsWith("/")
    ) {

        finalPath =
            "http://localhost:5000" +
            imagePath;

    }


    image.src =
        finalPath;


    image.style.display =
        "block";


    image.onerror =
        function () {

            image.style.display =
                "none";

        };

}


// =====================================================
// HEALTH CIRCLE
// =====================================================

function updateHealthCircle(
    score
) {

    const circle =
        document.querySelector(
            ".health-circle"
        );


    if (!circle) {
        return;
    }


    const value =
        Number(score);


    if (!Number.isFinite(value)) {
        return;
    }


    const safeScore =
        Math.max(
            0,
            Math.min(
                100,
                value
            )
        );


    circle.style.background =
        `conic-gradient(
            #176b3a ${safeScore}%,
            #dcefe3 ${safeScore}%
        )`;


    circle.style.border =
        "10px solid #dcefe3";

}


// =====================================================
// HEALTH STATUS CLASS
// =====================================================

function updateHealthStatusClass(
    status
) {

    const elements =
        document.querySelectorAll(
            "#healthStatus, " +
            "#health-status, " +
            ".health-badge"
        );


    elements.forEach(element => {

        element.classList.remove(
            "status-good",
            "status-warning",
            "status-danger"
        );


        const value =
            String(status || "")
                .toUpperCase();


        if (value === "HEALTHY") {

            element.classList.add(
                "status-good"
            );

        } else if (
            value === "MODERATE"
        ) {

            element.classList.add(
                "status-warning"
            );

        } else if (
            value === "CRITICAL"
        ) {

            element.classList.add(
                "status-danger"
            );

        }

    });

}


// =====================================================
// ERROR STATE
// =====================================================

function updateCropGrowthError() {

    setText(
        [
            "#healthStatus",
            "#health-status",
            "[data-crop-value='healthStatus']"
        ],
        "Unavailable"
    );


    setText(
        [
            "#growthStage",
            "#growth-stage",
            "[data-crop-value='growthStage']"
        ],
        "Unavailable"
    );

}


// =====================================================
// NUMBER HELPER
// =====================================================

function numberValue(
    value
) {

    const number =
        Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }


    return Number(
        number.toFixed(2)
    );

}


// =====================================================
// SET TEXT HELPER
// =====================================================

function setText(
    selectors,
    value
) {

    for (
        const selector of selectors
    ) {

        const elements =
            document.querySelectorAll(
                selector
            );


        if (
            elements &&
            elements.length
        ) {

            elements.forEach(
                element => {
                    element.textContent =
                        value;
                }
            );

            return;
        }

    }

}


// =====================================================
// AUTO LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadCropGrowth();


        // Refresh crop health
        // every 15 seconds

        setInterval(
            loadCropGrowth,
            15000
        );

    }
);


// =====================================================
// GLOBAL EXPORT
// =====================================================

window.loadCropGrowth =
    loadCropGrowth;

window.updateCropGrowth =
    updateCropGrowth;
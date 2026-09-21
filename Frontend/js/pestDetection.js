// =====================================================
// PEST DETECTION
// =====================================================

const PEST_API =
    "http://localhost:5000/api/pests";


// =====================================================
// LOAD PEST DATA
// =====================================================

async function loadPestDetection() {

    try {

        const response =
            await fetch(PEST_API);

        if (!response.ok) {

            throw new Error(
                `Pest API failed: ${response.status}`
            );

        }


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.message ||
                "Failed to load pest data"
            );

        }


        const pests =
            result.data ||
            result.pests ||
            [];


        updatePestDetection(
            pests
        );


        return pests;

    } catch (error) {

        console.error(
            "Pest detection error:",
            error
        );

        updatePestError();

        return [];

    }

}


// =====================================================
// UPDATE PEST UI
// =====================================================

function updatePestDetection(
    pests
) {

    if (!Array.isArray(pests)) {

        pests = [];

    }


    // -------------------------------------------------
    // Total detections
    // -------------------------------------------------

    const total =
        pests.length;


    setPestText(
        [
            "#pestCount",
            "#pest-count",
            "[data-pest-value='count']"
        ],
        total
    );


    // -------------------------------------------------
    // Latest pest
    // -------------------------------------------------

    if (!pests.length) {

        setPestText(
            [
                "#pestName",
                "#pest-name",
                "[data-pest-value='name']"
            ],
            "No pests detected"
        );


        setPestText(
            [
                "#pestConfidence",
                "#pest-confidence",
                "[data-pest-value='confidence']"
            ],
            "0%"
        );


        return;

    }


    const latest =
        pests[0];


    const pestName =
        latest.pestName ||
        latest.pest ||
        latest.pestType ||
        latest.className ||
        "Unknown";


    const confidence =
        Number(
            latest.confidence ??
            latest.confidenceScore ??
            0
        );


    setPestText(
        [
            "#pestName",
            "#pest-name",
            "[data-pest-value='name']"
        ],
        pestName
    );


    setPestText(
        [
            "#pestConfidence",
            "#pest-confidence",
            "[data-pest-value='confidence']"
        ],
        `${numberValue(confidence)}%`
    );


    // -------------------------------------------------
    // Detection status
    // -------------------------------------------------

    const status =
        confidence >= 80
            ? "CRITICAL"
            : confidence >= 60
                ? "WARNING"
                : "LOW";


    setPestText(
        [
            "#pestStatus",
            "#pest-status",
            "[data-pest-value='status']"
        ],
        status
    );


    updatePestStatusClass(
        status
    );


    // -------------------------------------------------
    // Render pest cards
    // -------------------------------------------------

    renderPestCards(
        pests
    );

}


// =====================================================
// RENDER PEST CARDS
// =====================================================

function renderPestCards(
    pests
) {

    const container =
        document.querySelector(
            "#pestList"
        );


    if (!container) {
        return;
    }


    if (!pests.length) {

        container.innerHTML = `
            <div class="pest-card">
                <span>Status</span>
                <strong>No pests detected</strong>
            </div>
        `;

        return;

    }


    container.innerHTML =
        pests
            .slice(0, 10)
            .map(pest => {

                const name =
                    pest.pestName ||
                    pest.pest ||
                    pest.pestType ||
                    pest.className ||
                    "Unknown";


                const confidence =
                    Number(
                        pest.confidence ??
                        pest.confidenceScore ??
                        0
                    );


                const count =
                    Number(
                        pest.count ??
                        pest.pestCount ??
                        1
                    );


                return `
                    <div class="pest-card">

                        <span>Pest</span>

                        <strong>
                            ${escapeHtml(name)}
                        </strong>

                        <span>
                            Confidence:
                            ${numberValue(confidence)}%
                        </span>

                        <span>
                            Count:
                            ${count}
                        </span>

                    </div>
                `;

            })
            .join("");

}


// =====================================================
// PEST STATUS CLASS
// =====================================================

function updatePestStatusClass(
    status
) {

    const elements =
        document.querySelectorAll(
            "#pestStatus, " +
            "#pest-status, " +
            ".pest-status"
        );


    elements.forEach(element => {

        element.classList.remove(
            "status-good",
            "status-warning",
            "status-danger"
        );


        if (status === "CRITICAL") {

            element.classList.add(
                "status-danger"
            );

        } else if (
            status === "WARNING"
        ) {

            element.classList.add(
                "status-warning"
            );

        } else {

            element.classList.add(
                "status-good"
            );

        }

    });

}


// =====================================================
// ERROR STATE
// =====================================================

function updatePestError() {

    setPestText(
        [
            "#pestStatus",
            "#pest-status",
            "[data-pest-value='status']"
        ],
        "Unavailable"
    );


    setPestText(
        [
            "#pestName",
            "#pest-name",
            "[data-pest-value='name']"
        ],
        "Unable to load pest data"
    );

}


// =====================================================
// TEXT HELPER
// =====================================================

function setPestText(
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
// HTML ESCAPE
// =====================================================

function escapeHtml(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// =====================================================
// AUTO LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadPestDetection();


        // Refresh every 15 seconds

        setInterval(
            loadPestDetection,
            15000
        );

    }
);


// =====================================================
// GLOBAL EXPORT
// =====================================================

window.loadPestDetection =
    loadPestDetection;

window.updatePestDetection =
    updatePestDetection;
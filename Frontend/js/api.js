// =====================================================
// API.JS
// IOT19 SMART AGRICULTURE DASHBOARD
// =====================================================

const API_BASE_URL = "http://localhost:5000/api";


// =====================================================
// GENERIC API HELPER
// =====================================================

async function fetchAPI(endpoint) {

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`
    );

    if (!response.ok) {

        throw new Error(
            `API failed: ${response.status} ${response.statusText}`
        );

    }

    const result =
        await response.json();

    if (!result.success) {

        throw new Error(
            result.message || "API request failed"
        );

    }

    return result;

}


// =====================================================
// LATEST SENSOR
// =====================================================

async function getLatestSensor() {

    const result =
        await fetchAPI(
            "/sensors/latest"
        );

    return result.data;

}


// =====================================================
// SENSOR HISTORY
// =====================================================

async function getSensorHistory() {

    const result =
        await fetchAPI(
            "/sensors/history"
        );

    return result.data || [];

}


// =====================================================
// SENSOR STATISTICS
// =====================================================

async function getSensorStatistics() {

    const result =
        await fetchAPI(
            "/sensors/statistics"
        );

    return result.data;

}


// =====================================================
// DAILY SUMMARY
// =====================================================

async function getDailySummary() {

    const result =
        await fetchAPI(
            "/sensors/daily-summary"
        );

    return result.data || [];

}


// =====================================================
// LIGHT STATISTICS
// =====================================================

async function getLightStatistics() {

    const result =
        await fetchAPI(
            "/sensors/light-statistics"
        );

    return result.data;

}


// =====================================================
// WATER STATISTICS
// =====================================================

async function getWaterStatistics() {

    const result =
        await fetchAPI(
            "/sensors/water-statistics"
        );

    return result.data;

}


// =====================================================
// IRRIGATION STATISTICS
// =====================================================

async function getIrrigationStatistics() {

    const result =
        await fetchAPI(
            "/sensors/irrigation-statistics"
        );

    return result.data;

}


// =====================================================
// IRRIGATION STATE
// =====================================================

async function getIrrigationState() {

    const result =
        await fetchAPI(
            "/sensors/irrigation"
        );

    return result;

}


// =====================================================
// DASHBOARD ANALYTICS
// =====================================================

async function getDashboardAnalytics() {

    try {

        const [
            statistics,
            light,
            water,
            irrigation,
            daily
        ] = await Promise.all([

            getSensorStatistics(),

            getLightStatistics(),

            getWaterStatistics(),

            getIrrigationStatistics(),

            getDailySummary()

        ]);


        return {

            statistics,

            light,

            water,

            irrigation,

            daily

        };

    } catch (error) {

        console.error(
            "Dashboard analytics error:",
            error
        );

        throw error;

    }

}
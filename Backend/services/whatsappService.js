async function sendWhatsAppMessage(
    phoneNumber,
    message
) {

    console.log(
        "WhatsApp message:",
        phoneNumber,
        message
    );

    // Later you can connect:
    // Twilio WhatsApp
    // Meta WhatsApp Cloud API
    // Another WhatsApp provider

    return {
        success: true,
        message: "WhatsApp notification queued"
    };
}


module.exports = {
    sendWhatsAppMessage
};
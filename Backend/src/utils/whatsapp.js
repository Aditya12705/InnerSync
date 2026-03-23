export const sendWhatsAppNotification = async (message) => {
  const phone = process.env.CALLMEBOT_PHONE;
  const apiKey = process.env.CALLMEBOT_API_KEY;

  if (!phone || !apiKey) {
    console.warn('WhatsApp credentials (CALLMEBOT_PHONE or CALLMEBOT_API_KEY) not configured. Skipping notification.');
    return;
  }

  try {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMessage}&apikey=${apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
        console.error('Failed to send WhatsApp message. Status:', response.status);
    } else {
        console.log('WhatsApp notification sent successfully.');
    }
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
  }
};

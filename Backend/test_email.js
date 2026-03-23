import { sendNotificationEmail } from './src/utils/email.js';
import dotenv from 'dotenv';
dotenv.config();

console.log('Testing email configuration with:');
console.log('USER:', process.env.EMAIL_USER);
console.log('PASS:', process.env.EMAIL_PASS ? '********' : 'NOT SET');
console.log('ADMIN:', process.env.ADMIN_EMAIL);

const test = async () => {
  try {
    await sendNotificationEmail('Test Notification', '<h1>This is a test notification from local machine.</h1>');
    console.log('Test completed successfully. Check your inbox.');
  } catch (error) {
    console.error('Test failed:', error);
  }
};

test();

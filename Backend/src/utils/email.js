import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendNotificationEmail = async (subject, htmlContent) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.ADMIN_EMAIL) {
    console.warn('Email credentials not configured. Skipping email notification.');
    return;
  }

  try {
    const mailOptions = {
      from: `"InnerSync Notifications" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject,
      html: htmlContent,
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Notification email sent: ${subject}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

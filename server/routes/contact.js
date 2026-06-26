const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email and message are required.' });
  }

  try {
    await transporter.sendMail({
      from: `"Kalrav Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New Enquiry: ${subject || 'Contact Form'} — ${name}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fafafa; border: 1px solid #e8e0d0;">
          <h2 style="color: #b8960c; border-bottom: 1px solid #e8e0d0; padding-bottom: 12px;">New Customer Enquiry</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #888; width: 120px;">Name</td><td style="padding: 8px 0; font-weight: bold;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #b8960c;">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Phone</td><td style="padding: 8px 0;">${phone || 'Not provided'}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Subject</td><td style="padding: 8px 0;">${subject || 'General'}</td></tr>
          </table>

          <div style="margin-top: 24px; padding: 16px; background: #fff; border-left: 3px solid #b8960c;">
            <p style="color: #888; margin: 0 0 8px;">Message:</p>
            <p style="margin: 0; line-height: 1.6;">${message}</p>
          </div>

          <p style="margin-top: 24px; font-size: 12px; color: #aaa;">Sent from Kalrav website contact form</p>
        </div>
      `,
    });

    res.json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Email error:', err.message);
    res.status(500).json({ message: 'Failed to send message. Please try again.' });
  }
});

module.exports = router;

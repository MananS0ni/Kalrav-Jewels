const express = require('express');
const nodemailer = require('nodemailer');
const Enquiry = require('../models/Enquiry');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// GET /api/contact (Admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/contact/:id/status (Admin only)
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    enquiry.status = req.body.status;
    await enquiry.save();
    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ message: 'Required fields missing' });

  try {
    await Enquiry.create({ type: 'contact', name, email, phone, subject, message });
    transporter.sendMail({
      from: `"Kalrav Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New Enquiry: ${subject || 'Contact Form'} — ${name}`,
      html: `
        <div style="font-family: Georgia; max-width: 600px; padding: 32px; border: 1px solid #e8e0d0;">
          <h2 style="color: #b8960c;">New Customer Enquiry</h2>
          <p><strong>Name:</strong> ${name}<br/><strong>Email:</strong> ${email}<br/><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong><br/>${message}</p>
        </div>
      `,
    }).catch(err => console.log('Email send failed (but saved to DB):', err.message));
    res.json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

// POST /api/contact/enquire
router.post('/enquire', async (req, res) => {
  const { name, phone, productName } = req.body;
  if (!name || !phone) return res.status(400).json({ message: 'Name and phone required' });

  try {
    await Enquiry.create({ type: 'product', name, phone, productName });
    transporter.sendMail({
      from: `"Kalrav Enquiries" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `Product Callback Request — ${name}`,
      html: `
        <div style="font-family: Georgia; max-width: 600px; padding: 32px; border: 1px solid #e8e0d0;">
          <h2 style="color: #b8960c;">Callback Requested</h2>
          <p><strong>Name:</strong> ${name}<br/><strong>Phone:</strong> ${phone}</p>
          <p><strong>Product:</strong> ${productName}</p>
        </div>
      `,
    }).catch(err => console.log('Email send failed (but saved to DB):', err.message));
    res.json({ success: true, message: 'Enquiry sent successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send enquiry.' });
  }
});

module.exports = router;

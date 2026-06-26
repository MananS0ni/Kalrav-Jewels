const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = async (name, email) => {
  console.log(`Sending welcome email to: ${email}`);
  try {
    await transporter.sendMail({
      from: `"Kalrav Jewels" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Kalrav — Your Account is Ready',
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px 32px; background: #fafafa; border: 1px solid #e8e0d0;">
          <h2 style="color: #b8960c; letter-spacing: 2px; margin: 0 0 8px;">KALRAV</h2>
          <p style="color: #999; font-size: 12px; letter-spacing: 1px; margin: 0 0 32px;">JEWELS</p>
          <h3 style="color: #222;">Welcome, ${name}! 🎉</h3>
          <p style="color: #555; line-height: 1.8;">Your account has been created successfully. You can now browse our collections and place orders.</p>
          <div style="margin: 32px 0; padding: 20px; background: #fff; border-left: 3px solid #b8960c;">
            <p style="margin: 0; color: #888; font-size: 13px;">Registered email</p>
            <p style="margin: 4px 0 0; font-weight: bold;">${email}</p>
          </div>
          <p style="color: #aaa; font-size: 12px; margin-top: 32px;">If you didn't create this account, please ignore this email.</p>
        </div>
      `,
    });
    console.log(`✓ Welcome email sent to: ${email}`);
  } catch (err) {
    console.error('Welcome email failed:', err.message);
  }
};


// Helper: generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.name, user.email);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// GET /api/auth/me — get current user (protected)
router.get('/me', protect, (req, res) => {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email } });
});

module.exports = router;

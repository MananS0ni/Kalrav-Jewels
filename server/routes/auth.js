const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Regex for basic email format validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sendWelcomeEmail = async (name, email) => {
  console.log(`Sending welcome email to: ${email}`);
  try {
    await resend.emails.send({
      from: 'Kalrav Jewels <noreply@kalravjewels.com>',
      to: email,
      subject: 'Welcome to Kalrav — Your Account is Ready',
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 32px; background: #fafafa; border: 1px solid #e8e0d0;">
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
router.post('/register', authLimiter, async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Invalid input format.' });
  }
  
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
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
router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Invalid input format.' });
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

// POST /api/auth/forgot-password
router.post('/forgot-password', authLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string') return res.status(400).json({ message: 'Valid email is required.' });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Return 200 even if user not found to prevent email enumeration
      return res.status(200).json({ message: 'If that email is registered, a password reset link has been sent.' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins

    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email
    await resend.emails.send({
      from: 'Kalrav Jewels <noreply@kalravjewels.com>',
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 32px; background: #fafafa; border: 1px solid #e8e0d0;">
          <h2 style="color: #b8960c; letter-spacing: 2px; margin: 0 0 8px;">KALRAV</h2>
          <p style="color: #999; font-size: 12px; letter-spacing: 1px; margin: 0 0 32px;">JEWELS</p>
          <h3 style="color: #222;">Password Reset Request</h3>
          <p style="color: #555; line-height: 1.8;">You requested a password reset. Click the button below to reset your password. This link is valid for 15 minutes.</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; margin: 24px 0; background-color: #b8960c; color: #fff; text-decoration: none; border-radius: 4px;">Reset Password</a>
          <p style="color: #aaa; font-size: 12px; margin-top: 32px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    res.status(200).json({ message: 'If that email is registered, a password reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'There was an error sending the email. Try again later.' });
  }
});

// POST /api/auth/reset-password/:token
router.post('/reset-password/:token', authLimiter, async (req, res) => {
  const { password } = req.body;
  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  try {
    // Hash token from URL to compare with database
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token.' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been successfully reset. You can now log in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;

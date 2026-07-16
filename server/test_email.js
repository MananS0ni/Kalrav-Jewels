const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log('Using Email User:', process.env.EMAIL_USER);

transporter.sendMail({
  from: `"Kalrav Test" <${process.env.EMAIL_USER}>`,
  to: 'namyasoni4717@gmail.com',
  subject: 'Test Email from Kalrav Server',
  text: 'If you receive this, the email configuration is working!',
}).then(info => {
  console.log('SUCCESS:', info);
  process.exit(0);
}).catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});

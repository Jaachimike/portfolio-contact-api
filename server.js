const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

app.post('/send-email', async (req, res) => {
    const {name, email, message} = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.TO_EMAIL,
        replyTo: email,
        subject: `New message from ${name}`,
        text: `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
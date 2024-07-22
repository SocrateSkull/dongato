const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');

const router = express.Router();

// Generar Key única
const generateKey = (telegramId) => {
  return crypto.createHash('sha256').update(telegramId + Date.now().toString()).digest('hex');
};

// Registro
router.post('/register', async (req, res) => {
  const { username, email, password, telegramId } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const key = generateKey(telegramId);

    user = new User({
      username,
      email,
      password,
      telegramId,
      key
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Enviar correo de verificación
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Verificación de cuenta',
      text: `Por favor verifica tu cuenta usando el siguiente enlace: ${process.env.BASE_URL}/verify/${user.key}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.error(error);
      else console.log(`Email sent: ${info.response}`);
    });

    res.status(201).json({ msg: 'User registered. Please verify your email.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Verificación
router.get('/verify/:key', async (req, res) => {
  try {
    const user = await User.findOne({ key: req.params.key });
    if (!user) return res.status(400).json({ msg: 'Invalid key' });

    user.isVerified = true;
    await user.save();

    res.status(200).json({ msg: 'Account verified' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

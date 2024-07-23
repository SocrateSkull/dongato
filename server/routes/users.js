const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Registro
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const user = new User({ username, email, password });
  user.generateApiKey();
  user.verificationToken = crypto.randomBytes(32).toString('hex');
  
  await user.save();

  // Enviar email de verificación
  const transporter = nodemailer.createTransport({
    service: 'yahoo',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Verifica tu correo electrónico',
    text: `Hola ${user.username},\n\nPor favor verifica tu correo electrónico haciendo clic en el siguiente enlace: ${process.env.FRONTEND_URL}/verify-email?token=${user.verificationToken}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: error.toString() });
    }
    res.status(200).json({ message: 'Usuario registrado. Por favor verifica tu correo electrónico.' });
  });
});

// Inicio de sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Usuario no encontrado.' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Contraseña incorrecta.' });

  if (!user.emailVerified) return res.status(400).json({ error: 'Por favor verifica tu correo electrónico.' });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token, apiKey: user.apiKey });
});

// Verificación de correo electrónico
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;
  const user = await User.findOne({ verificationToken: token });
  if (!user) return res.status(400).json({ error: 'Token de verificación inválido.' });

  user.emailVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.status(200).json({ message: 'Correo electrónico verificado. Ya puedes iniciar sesión.' });
});

module.exports = router;

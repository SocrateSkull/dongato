const express = require('express');
const router = express.Router();
const { generateRandomAddress } = require('../controllers/addressesController');

router.post('/generate', generateRandomAddress);

module.exports = router;

const express = require('express');
const router = express.Router();
const { generateCards, verifyCard, generateCustomCards } = require('../controllers/cardsController');

router.post('/generate', generateCards);
router.post('/verify', verifyCard);
router.post('/custom-generate', generateCustomCards);

module.exports = router;

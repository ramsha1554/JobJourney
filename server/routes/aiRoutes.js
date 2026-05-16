const express = require('express');
const { analyzeJobMatch } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/analyze/:id', analyzeJobMatch);

module.exports = router;

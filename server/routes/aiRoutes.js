const express = require("express");
const {
  analyzeJobMatch,
  generateInterviewQuestionsHandler,
} = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/analyze/:id", analyzeJobMatch);
router.post("/questions/:id", generateInterviewQuestionsHandler);

module.exports = router;

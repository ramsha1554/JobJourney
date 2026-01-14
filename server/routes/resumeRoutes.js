const express = require('express');
const {
    uploadResume,
    getResumes,
    deleteResume
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getResumes)
    .post(upload.single('file'), uploadResume);

router.route('/:id')
    .delete(deleteResume);

module.exports = router;

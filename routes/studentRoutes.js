const express = require('express');
const { getMyClassroom, getMyTimetable } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/myclassroom', protect, getMyClassroom);
router.get('/mytimetable', protect, getMyTimetable);

module.exports = router;

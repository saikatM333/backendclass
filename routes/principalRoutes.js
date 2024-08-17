const express = require('express');
const {
  createTeacher,
  createClassroom,
  createTimetable,
  getClassrooms,
  getTimetables,
} = require('../controllers/principalController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/teacher', protect, admin, createTeacher);
router.post('/classroom', protect, admin, createClassroom);
router.post('/timetable', protect, admin, createTimetable);
router.get('/classrooms', protect, admin, getClassrooms);
router.get('/timetables', protect, admin, getTimetables);

module.exports = router;

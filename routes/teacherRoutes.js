const express = require('express');
const {
  getMyClassroom,
  addStudentToClassroom,
  removeStudentFromClassroom,
  createTimetable,
  getMyTimetable,
  deleteScheduleEntry,
} = require('../controllers/teacherController');
const { protect, teacher } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/myclassroom', protect, teacher, getMyClassroom);
router.post('/student', protect, teacher, addStudentToClassroom);
router.delete('/student', protect, teacher, removeStudentFromClassroom);
router.post('/timetable', protect, teacher, createTimetable);
router.get('/mytimetable',protect, teacher, getMyTimetable);
router.delete('/timetable/entry/:id', protect, teacher, deleteScheduleEntry);
module.exports = router;

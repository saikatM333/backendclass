const Classroom = require('../models/Classroom');
const Timetable = require('../models/Timetable');
const User = require('../models/User');

exports.getMyClassroom = async (req, res) => {
  const classroom = await Classroom.findOne({ teacher: req.user._id }).populate('students');
  if (classroom) {
    res.json(classroom);
  } else {
    res.status(404).json({ message: 'Classroom not found' });
  }
};

exports.addStudentToClassroom = async (req, res) => {
  const { studentId } = req.body;

  const student = await User.findById(studentId);

  if (!student || student.role !== 'Student') {
    return res.status(400).json({ message: 'Invalid student' });
  }

  const classroom = await Classroom.findOneAndUpdate(
    { teacher: req.user._id },
    { $push: { students: studentId } },
    { new: true }
  );

  if (classroom) {
    res.json(classroom);
  } else {
    res.status(404).json({ message: 'Classroom not found' });
  }
};

exports.removeStudentFromClassroom = async (req, res) => {
  const { studentId } = req.body;

  const classroom = await Classroom.findOneAndUpdate(
    { teacher: req.user._id },
    { $pull: { students: studentId } },
    { new: true }
  );

  if (classroom) {
    res.json(classroom);
  } else {
    res.status(404).json({ message: 'Classroom not found' });
  }
};

exports.createTimetable = async (req, res) => {
  const { schedule } = req.body;

  const classroom = await Classroom.findOne({ teacher: req.user._id });

  if (!classroom) {
    return res.status(404).json({ message: 'Classroom not found' });
  }

  const timetable = await Timetable.create({
    classroom: classroom._id,
    schedule,
  });

  res.status(201).json(timetable);
};

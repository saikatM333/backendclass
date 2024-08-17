const User = require('../models/User');
const Classroom = require('../models/Classroom');
const Timetable = require('../models/Timetable');

exports.createTeacher = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'Teacher already exists' });
  }

  const teacher = await User.create({
    name,
    email,
    password,
    role: 'Teacher',
  });

  res.status(201).json(teacher);
};

exports.createClassroom = async (req, res) => {
  const { name, teacherId } = req.body;

  const teacher = await User.findById(teacherId);

  if (!teacher || teacher.role !== 'Teacher') {
    return res.status(400).json({ message: 'Invalid teacher' });
  }

  const classroomExists = await Classroom.findOne({ teacher: teacherId });

  if (classroomExists) {
    return res.status(400).json({ message: 'Teacher already assigned to a classroom' });
  }

  const classroom = await Classroom.create({
    name,
    teacher: teacherId,
  });

  res.status(201).json(classroom);
};

exports.createTimetable = async (req, res) => {
  const { classroomId, schedule } = req.body;

  const timetable = await Timetable.create({
    classroom: classroomId,
    schedule,
  });

  res.status(201).json(timetable);
};

exports.getClassrooms = async (req, res) => {
  const classrooms = await Classroom.find().populate('teacher').populate('students');
  res.json(classrooms);
};

exports.getTimetables = async (req, res) => {
  const timetables = await Timetable.find().populate('classroom');
  res.json(timetables);
};

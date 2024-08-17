const Classroom = require('../models/Classroom');
const Timetable = require('../models/Timetable');

exports.getMyClassroom = async (req, res) => {
  const classroom = await Classroom.findOne({ students: req.user._id }).populate('teacher');
  if (classroom) {
    res.json(classroom);
  } else {
    res.status(404).json({ message: 'Classroom not found' });
  }
};

exports.getMyTimetable = async (req, res) => {
  const classroom = await Classroom.findOne({ students: req.user._id });

  if (!classroom) {
    return res.status(404).json({ message: 'Classroom not found' });
  }

  const timetable = await Timetable.findOne({ classroom: classroom._id });

  if (timetable) {
    res.json(timetable);
  } else {
    res.status(404).json({ message: 'Timetable not found' });
  }
};

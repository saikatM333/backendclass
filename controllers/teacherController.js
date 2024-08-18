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

// exports.addStudentToClassroom = async (req, res) => {
//   const { studentId } = req.body;

//   const student = await User.findById(studentId);

//   if (!student || student.role !== 'Student') {
//     return res.status(400).json({ message: 'Invalid student' });
//   }

//   const classroom = await Classroom.findOneAndUpdate(
//     { teacher: req.user._id },
//     { $push: { students: studentId } },
//     { new: true }
//   );

//   if (classroom) {
//     res.json(classroom);
//   } else {
//     res.status(404).json({ message: 'Classroom not found' });
//   }
// };



exports.addStudentToClassroom = async (req, res) => {
  const { name, email } = req.body;

  try {
    // Check if a student with the given email already exists
    let student = await User.findOne({ email });

    if (!student) {
      // If the student doesn't exist, create a new student record
      student = new User({ name, email, password : '123', role: 'Student' });
      await student.save();
    } else if (student.role !== 'Student') {
      // If the user exists but is not a student, return an error
      return res.status(400).json({ message: 'The user exists but is not a student' });
    }

    // Find the classroom and add the student to it
    const classroom = await Classroom.findOneAndUpdate(
      { teacher: req.user._id },
      { $push: { students: student._id } },
      { new: true }
    );

    if (classroom) {
      res.json(classroom);
    } else {
      res.status(404).json({ message: 'Classroom not found' });
    }
  } catch (error) {
    console.error('Error adding student to classroom:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// exports.removeStudentFromClassroom = async (req, res) => {
//   const { studentId } = req.body;

//   const classroom = await Classroom.findOneAndUpdate(
//     { teacher: req.user._id },
//     { $pull: { students: studentId } },
//     { new: true }
//   );

//   if (classroom) {
//     res.json(classroom);
//   } else {
//     res.status(404).json({ message: 'Classroom not found' });
//   }
// };

exports.removeStudentFromClassroom = async (req, res) => {
  const { studentId } = req.body;

  try {
    // Check if the student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== 'Student') {
      return res.status(400).json({ message: 'Invalid student' });
    }

    // Find the classroom associated with the teacher
    const classroom = await Classroom.findOne({ teacher: req.user._id });

    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    // Check if the student is part of the classroom
    if (!classroom.students.includes(studentId)) {
      return res.status(400).json({ message: 'Student not found in this classroom' });
    }

    // Remove the student from the classroom
    classroom.students.pull(studentId);
    await classroom.save();

    res.json({ message: 'Student removed successfully', classroom });
  } catch (error) {
    console.error('Error removing student from classroom:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// exports.createTimetable = async (req, res) => {
//   const {  day,  subject, time } = req.body;

//   const classroom = await Classroom.findOne({ teacher: req.user._id });

//   if (!classroom) {
//     return res.status(404).json({ message: 'Classroom not found' });
//   }

//   const timetable = await Timetable.create({
//     classroom: classroom._id,
//     schedule,
//   });

//   res.status(201).json(timetable);
// };


exports.createTimetable = async (req, res) => {
  const { day, subject, time } = req.body;

  try {
    // Find the classroom based on the teacher's ID
    const classroom = await Classroom.findOne({ teacher: req.user._id });

    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    // Check if a timetable already exists for this classroom
    let timetable = await Timetable.findOne({ classroom: classroom._id });

    if (timetable) {
      // If a timetable exists, update it by adding a new schedule entry
      timetable.schedule.push({ day, subject, time });
    } else {
      // If no timetable exists, create a new one
      timetable = new Timetable({
        classroom: classroom._id,
        schedule: [{ day, subject, time }],
      });
    }

    // Save the updated or new timetable
    await timetable.save();

    res.status(201).json(timetable);
  } catch (error) {
    console.error('Error creating timetable:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyTimetable = async (req, res) => {
  const classroom = await Classroom.findOne({ teacher: req.user._id });

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
exports.deleteScheduleEntry = async (req, res) => {
  const { id } = req.params; // Timetable ID
  const { day, subject, time } = req.body; // Schedule entry details

  try {
    const timetable = await Timetable.findByIdAndUpdate(
      id,
      {
        $pull: { schedule: { day, subject, time } },
      },
      { new: true }
    );

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    res.json({ message: 'Schedule entry deleted successfully', timetable });
  } catch (error) {
    console.error('Error deleting schedule entry:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

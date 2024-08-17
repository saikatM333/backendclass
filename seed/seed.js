const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./db');
const User = require('./models/User');
const Classroom = require('./models/Classroom');
const Timetable = require('./models/Timetable');

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Classroom.deleteMany({});
    await Timetable.deleteMany({});

    // Create users
    const principal = await User.create({
      name: 'Principal',
      email: 'principal@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'Principal',
    });

    const teacher1 = await User.create({
      name: 'Teacher One',
      email: 'teacher1@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'Teacher',
    });

    const teacher2 = await User.create({
      name: 'Teacher Two',
      email: 'teacher2@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'Teacher',
    });

    const student1 = await User.create({
      name: 'Student One',
      email: 'student1@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'Student',
    });

    const student2 = await User.create({
      name: 'Student Two',
      email: 'student2@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'Student',
    });

    // Create classrooms and timetable
    const classroom1 = await Classroom.create({
      name: 'Class 1A',
      teacher: teacher1._id,
      students: [student1._id, student2._id],
    });

    await Timetable.create({
      classroom: classroom1._id,
      schedule: [
        { day: 'Monday', subject: 'Math', time: '09:00 AM' },
        { day: 'Tuesday', subject: 'English', time: '10:00 AM' },
      ],
    });

    console.log('Database seeded successfully');
  } catch (err) {
    console.error('Error seeding database:', err.message);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();

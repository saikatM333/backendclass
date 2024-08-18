const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Update with the correct path to your User model
const Classroom = require('./models/Classroom');
const Timetable = require('./models/Timetable');
// Function to hash a password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Seed data
const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/classroomDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
console.log("statted")
    // Data to seed
    await User.deleteMany({});
    await Classroom.deleteMany({});
    await Timetable.deleteMany({});
    // Data to seed
    const principal = await User.create({
      name: 'Principal',
      email: 'principal@example.com',
      password:'123',
      role: 'Principal',
    });

    const teacher1 = await User.create({
      name: 'Teacher One',
      email: 'teacher1@example.com',
      password: '123',
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
      password: '123',
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



    console.log('Data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
};

// Run the seed function
seedData();

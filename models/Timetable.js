const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
  schedule: [
    {
      day: { type: String, required: true },
      subject: { type: String, required: true },
      time: { type: String, required: true },
    },
  ],
});

const Timetable = mongoose.model('Timetable', timetableSchema);
module.exports = Timetable;

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    trainingSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TrainingSession',
      required: [true, 'Training session ID is required'],
      index: true,
    },
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Player ID is required'],
      index: true,
    },
    status: {
      type: String,
      enum: ['UNMARKED', 'PRESENT', 'LATE', 'EXCUSED', 'ABSENT'],
      default: 'UNMARKED',
      index: true,
    },
    note: {
      type: String,
      default: null,
      trim: true,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// One attendance record per player per training session
attendanceSchema.index({ trainingSessionId: 1, playerId: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;


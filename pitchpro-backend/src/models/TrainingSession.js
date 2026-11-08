const mongoose = require('mongoose');

const trainingSessionSchema = new mongoose.Schema(
  {
    seasonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Season',
      required: [true, 'Season ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Session title is required'],
      trim: true,
    },
    objective: {
      type: String,
      default: null,
      trim: true,
    },
    startsAt: {
      type: Date,
      required: [true, 'Start time is required'],
      index: true,
    },
    endsAt: {
      type: Date,
      required: [true, 'End time is required'],
      validate: {
        validator: function (val) {
          return !this.startsAt || val >= this.startsAt;
        },
        message: 'End time must be greater than or equal to start time',
      },
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    participantIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED'],
      default: 'DRAFT',
      index: true,
    },
    attendanceState: {
      type: String,
      enum: ['OPEN', 'FINALIZED'],
      default: 'OPEN',
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: 'version',
  }
);

trainingSessionSchema.index({ seasonId: 1, startsAt: 1 });

const TrainingSession = mongoose.model('TrainingSession', trainingSessionSchema);
module.exports = TrainingSession;


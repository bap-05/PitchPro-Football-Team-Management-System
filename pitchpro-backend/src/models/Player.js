const mongoose = require('mongoose');

const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'DM', 'CM', 'AM', 'LW', 'RW', 'ST'];

const playerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    dob: {
      type: Date,
      required: [true, 'Date of birth is required'],
      validate: {
        validator: function (val) {
          return val <= new Date();
        },
        message: 'Date of birth cannot be in the future',
      },
    },
    nationality: {
      type: String,
      default: null,
      trim: true,
    },
    primaryPosition: {
      type: String,
      enum: POSITIONS,
      required: [true, 'Primary position is required'],
    },
    secondaryPositions: {
      type: [
        {
          type: String,
          enum: POSITIONS,
        },
      ],
      default: [],
    },
    heightCm: {
      type: Number,
      min: [100, 'Height must be at least 100 cm'],
      max: [230, 'Height cannot exceed 230 cm'],
      default: null,
    },
    weightKg: {
      type: Number,
      min: [25, 'Weight must be at least 25 kg'],
      max: [200, 'Weight cannot exceed 200 kg'],
      default: null,
    },
    preferredFoot: {
      type: String,
      enum: ['LEFT', 'RIGHT', 'BOTH'],
      required: [true, 'Preferred foot is required'],
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    avatarPublicId: {
      type: String,
      default: null,
    },
    fitnessStatus: {
      type: String,
      enum: ['FIT', 'INJURED'],
      default: 'FIT',
    },
    archivedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: 'version',
  }
);

// Text search on full name
playerSchema.index({ fullName: 'text' });

const Player = mongoose.model('Player', playerSchema);
module.exports = Player;


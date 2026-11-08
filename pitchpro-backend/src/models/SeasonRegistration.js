const mongoose = require('mongoose');

const seasonRegistrationSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Team ID is required'],
      index: true,
    },
    seasonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Season',
      required: [true, 'Season ID is required'],
      index: true,
    },
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Player ID is required'],
      index: true,
    },
    shirtNumber: {
      type: Number,
      required: [true, 'Shirt number is required'],
      min: [1, 'Shirt number must be at least 1'],
      max: [99, 'Shirt number cannot exceed 99'],
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ON_LOAN', 'LEFT'],
      default: 'ACTIVE',
      index: true,
    },
    joinedOn: {
      type: Date,
      default: Date.now,
    },
    leftOn: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: 'version',
  }
);

// One registration per player per season
seasonRegistrationSchema.index({ seasonId: 1, playerId: 1 }, { unique: true });

// Shirt number is unique per team and season among ACTIVE registrations
seasonRegistrationSchema.index(
  { teamId: 1, seasonId: 1, shirtNumber: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'ACTIVE' },
  }
);

const SeasonRegistration = mongoose.model('SeasonRegistration', seasonRegistrationSchema);
module.exports = SeasonRegistration;


const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
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
    opponent: {
      type: String,
      required: [true, 'Opponent name is required'],
      trim: true,
    },
    competition: {
      type: String,
      required: [true, 'Competition name is required'],
      trim: true,
    },
    scheduledAt: {
      type: Date,
      required: [true, 'Scheduled time is required'],
      index: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    venueType: {
      type: String,
      enum: ['HOME', 'AWAY', 'NEUTRAL'],
      default: 'HOME',
    },
    status: {
      type: String,
      enum: ['SCHEDULED', 'POSTPONED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'SCHEDULED',
      index: true,
    },
    publicationState: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED'],
      default: 'DRAFT',
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    expectedEndsAt: {
      type: Date,
      default: null,
    },
    resultState: {
      type: String,
      enum: ['DRAFT', 'CONFIRMED'],
      default: 'DRAFT',
      index: true,
    },
    scoreFor: {
      type: Number,
      default: null, // Null when unentered or match not played
    },
    scoreAgainst: {
      type: Number,
      default: null,
    },
    regulationMinutes: {
      type: Number,
      default: 90,
    },
    actualDurationSeconds: {
      type: Number,
      default: null,
    },
    maxSubstitutes: {
      type: Number,
      default: 9,
    },
    maxSubstitutions: {
      type: Number,
      default: 5,
    },
    confirmedAt: {
      type: Date,
      default: null,
    },
    confirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: 'version',
  }
);

// Query index for match listings by season and time
matchSchema.index({ seasonId: 1, scheduledAt: 1 });

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;


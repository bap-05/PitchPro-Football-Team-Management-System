const mongoose = require('mongoose');

const starterSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    shirtNumber: {
      type: Number,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
  },
  { _id: false }
);

const substituteSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    shirtNumber: {
      type: Number,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const eligibilitySnapshotSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    fitnessStatus: { type: String, default: 'FIT' },
    isSuspended: { type: Boolean, default: false },
    isEligible: { type: Boolean, default: true },
  },
  { _id: false }
);

const lineupSchema = new mongoose.Schema(
  {
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
      required: [true, 'Match ID is required'],
      unique: true,
    },
    formation: {
      type: String,
      required: [true, 'Formation is required'],
      trim: true,
    },
    starters: {
      type: [starterSchema],
      default: [],
    },
    substitutes: {
      type: [substituteSchema],
      default: [],
    },
    eligibilitySnapshot: {
      type: [eligibilitySnapshotSchema],
      default: [],
    },
    eligibilityCheckedAt: {
      type: Date,
      default: null,
    },
    lockedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED'],
      default: 'DRAFT',
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: 'version',
  }
);

const Lineup = mongoose.model('Lineup', lineupSchema);
module.exports = Lineup;


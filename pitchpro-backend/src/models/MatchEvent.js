const mongoose = require('mongoose');

const matchEventSchema = new mongoose.Schema(
  {
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
      required: [true, 'Match ID is required'],
      index: true,
    },
    eventType: {
      type: String,
      enum: ['GOAL', 'OWN_GOAL', 'YELLOW', 'SECOND_YELLOW', 'RED', 'SUBSTITUTION'],
      required: [true, 'Event type is required'],
    },
    side: {
      type: String,
      enum: ['TEAM', 'OPPONENT'],
      required: [true, 'Side is required'],
    },
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      default: null,
    },
    assistPlayerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      default: null,
    },
    playerOutId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      default: null,
    },
    playerInId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      default: null,
    },
    elapsedSeconds: {
      type: Number,
      required: [true, 'Elapsed seconds is required'],
      min: [0, 'Elapsed seconds cannot be negative'],
    },
    sequence: {
      type: Number,
      required: [true, 'Event sequence is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Sequence must be unique within a match
matchEventSchema.index({ matchId: 1, sequence: 1 }, { unique: true });

// Query index for events sorted chronologically
matchEventSchema.index({ matchId: 1, elapsedSeconds: 1, sequence: 1 });

const MatchEvent = mongoose.model('MatchEvent', matchEventSchema);
module.exports = MatchEvent;


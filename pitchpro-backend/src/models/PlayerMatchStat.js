const mongoose = require('mongoose');

const playerMatchStatSchema = new mongoose.Schema(
  {
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
      required: [true, 'Match ID is required'],
      index: true,
    },
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Player ID is required'],
      index: true,
    },
    started: {
      type: Boolean,
      default: false,
    },
    played: {
      type: Boolean,
      default: false,
    },
    minutesPlayed: {
      type: Number,
      default: 0,
      min: [0, 'Minutes played cannot be negative'],
    },
    passesCompleted: {
      type: Number,
      default: null,
      min: [0, 'Passes completed cannot be negative'],
    },
    passesAttempted: {
      type: Number,
      default: null,
      min: [0, 'Passes attempted cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Unique combination of match and player
playerMatchStatSchema.index({ matchId: 1, playerId: 1 }, { unique: true });

const PlayerMatchStat = mongoose.model('PlayerMatchStat', playerMatchStatSchema);
module.exports = PlayerMatchStat;


const mongoose = require('mongoose');

const suspensionSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: [true, 'Player ID is required'],
      index: true,
    },
    seasonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Season',
      required: [true, 'Season ID is required'],
      index: true,
    },
    matchIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
      },
    ],
    reason: {
      type: String,
      required: [true, 'Suspension reason is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'REVOKED'],
      default: 'ACTIVE',
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: 'version',
  }
);

suspensionSchema.index({ playerId: 1, seasonId: 1, status: 1 });

const Suspension = mongoose.model('Suspension', suspensionSchema);
module.exports = Suspension;


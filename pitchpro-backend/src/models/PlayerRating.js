const mongoose = require('mongoose');

const ratingValidation = {
  type: Number,
  min: [1, 'Rating must be at least 1'],
  max: [99, 'Rating cannot exceed 99'],
  default: null,
};

const playerRatingSchema = new mongoose.Schema(
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
    pace: ratingValidation,
    shooting: ratingValidation,
    passing: ratingValidation,
    stamina: ratingValidation,
    defending: ratingValidation,
    tackling: ratingValidation,
    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    evaluatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: 'version',
  }
);

// One active rating profile per player per season
playerRatingSchema.index({ playerId: 1, seasonId: 1 }, { unique: true });

const PlayerRating = mongoose.model('PlayerRating', playerRatingSchema);
module.exports = PlayerRating;


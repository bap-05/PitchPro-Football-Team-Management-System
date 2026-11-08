const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
    },
    logoUrl: {
      type: String,
      default: null,
    },
    logoPublicId: {
      type: String,
      default: null,
    },
    timezone: {
      type: String,
      default: 'Asia/Ho_Chi_Minh',
      trim: true,
    },
    defaultVenue: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: 'version',
  }
);

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;


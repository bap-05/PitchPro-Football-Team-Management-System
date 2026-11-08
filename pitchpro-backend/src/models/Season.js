const mongoose = require('mongoose');

const seasonSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Team ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Season name is required'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (val) {
          return !this.startDate || val >= this.startDate;
        },
        message: 'End date must be greater than or equal to start date',
      },
    },
    status: {
      type: String,
      enum: ['PLANNED', 'ACTIVE', 'CLOSED'],
      default: 'PLANNED',
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: 'version',
  }
);

// Unique season name per team
seasonSchema.index({ teamId: 1, name: 1 }, { unique: true });

// Partial unique index: Max 1 ACTIVE season per team
seasonSchema.index(
  { teamId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'ACTIVE' },
  }
);

const Season = mongoose.model('Season', seasonSchema);
module.exports = Season;


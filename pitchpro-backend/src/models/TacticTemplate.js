const mongoose = require('mongoose');

const tacticTemplateSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Team ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Tactic name is required'],
      trim: true,
    },
    formation: {
      type: String,
      required: [true, 'Formation is required'],
      trim: true,
    },
    slots: [
      {
        role: { type: String, required: true },
        x: { type: Number, required: true }, // 0 - 100 percentage
        y: { type: Number, required: true }, // 0 - 100 percentage
      },
    ],
    createdBy: {
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

const TacticTemplate = mongoose.model('TacticTemplate', tacticTemplateSchema);
module.exports = TacticTemplate;


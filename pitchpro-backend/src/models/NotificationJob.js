const mongoose = require('mongoose');

const notificationJobSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      required: true,
      trim: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    entityVersion: {
      type: Number,
      default: 0,
    },
    recipientIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    type: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'SENT', 'FAILED'],
      default: 'PENDING',
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    nextAttemptAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

notificationJobSchema.index({ status: 1, nextAttemptAt: 1 });

const NotificationJob = mongoose.model('NotificationJob', notificationJobSchema);
module.exports = NotificationJob;


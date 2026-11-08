const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient ID is required'],
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Notification type is required'],
      trim: true,
    },
    entityType: {
      type: String,
      required: [true, 'Entity type is required'],
      trim: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Entity ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    content: {
      type: String,
      default: null,
      trim: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    deduplicationKey: {
      type: String,
      required: [true, 'Deduplication key is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate notification for same recipient and event
notificationSchema.index({ recipientId: 1, deduplicationKey: 1 }, { unique: true });

// Query notifications by recipient sorted by creation time
notificationSchema.index({ recipientId: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;


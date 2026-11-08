const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    role: {
      type: String,
      enum: ['ADMIN', 'MANAGER', 'PLAYER'],
      required: [true, 'Role is required'],
    },
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      default: null,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'LOCKED'],
      default: 'ACTIVE',
    },
    mustChangePassword: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: 'version',
  }
);

// Partial unique index: A player can only be linked to one user account at a time
userSchema.index(
  { playerId: 1 },
  { unique: true, partialFilterExpression: { playerId: { $exists: true, $type: 'objectId' } } }
);

// Helper method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Static helper to hash password
userSchema.statics.hashPassword = async function (plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

const User = mongoose.model('User', userSchema);
module.exports = User;

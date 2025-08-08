const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalFileName: {
    type: String,
    required: true
  },
  fileData: {
    type: Buffer,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  extractedText: {
    type: String,
    default: ''
  },
  analysis: {
    skills: [String],
    experience: [String],
    education: [String],
    contact: {
      email: String,
      phone: String,
      location: String
    },
    summary: String,
    score: {
      type: Number,
      default: 0
    },
    suggestions: [String]
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

resumeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Resume', resumeSchema);

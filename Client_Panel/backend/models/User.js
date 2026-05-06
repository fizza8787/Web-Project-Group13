const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  password:     { type: String, required: true },
  role:         { type: String, enum: ['client', 'freelancer', 'admin'], default: 'client' },
  skills:       [String],
  bio:          { type: String, default: '' },
  rating:       { type: Number, min: 0, max: 5, default: 0 },
  hourlyRate:   { type: Number, min: 0, default: 0 },
  availability: { type: String, enum: ['available', 'busy', 'limited'], default: 'available' },
  profileImage: { type: String, default: '' },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
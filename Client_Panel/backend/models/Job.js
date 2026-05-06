const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title:          { type: String, required: true },
  description:    { type: String, required: true },
  budget:         { type: Number, required: true },
  budgetUSD:      { type: Number, default: 0 },
  category:       { type: String, required: true },
  skillsRequired: [String],
  clientId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:         { type: String, enum: ['open', 'in-progress', 'closed'], default: 'open' },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
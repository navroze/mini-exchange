const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  countries: [String],
  bid: Number,
  category: String,
  budget: Number
}, { timestamps: true });

companySchema.index({ countries: 1, category: 1 });
const Company = mongoose.model('company', companySchema, 'company');

module.exports = Company;

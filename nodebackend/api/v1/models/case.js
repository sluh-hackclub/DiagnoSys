const mongoose = require('mongoose');
const validator = require('validator');

const caseSchema = new mongoose.Schema({
  symptoms: {
    type: Array,
    required: true
  },
  primary_doctor: {
    type: String,
    required: true
  },
  secondary_doctor: {
    type: String
  }
});

module.exports = mongoose.model('Case', caseSchema);

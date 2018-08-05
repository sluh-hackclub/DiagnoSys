const mongoose = require('mongoose');
// const validator = require('validator');

const doctorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
    // lowercase: true
    // validate: (value) => {
    //   return validator.isEmail(value);
    // }
  },
  first_name: {
    type: String,
    required: true
    // trim: true
  },
  last_name: {
    type: String,
    required: true
    // trim: true
  },
  hospital: {
    type: String,
    required: true
    // trim: true
  },
  // salt is not required if bcrypt is used
  // salt: {
  //   type: String,
  //   required: true
  // },
  password: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  },
  totp_secret_base32: {
    type: String
  }
});

module.exports = mongoose.model('Doctor', doctorSchema);

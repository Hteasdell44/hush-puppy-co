const { Schema, model } = require('mongoose');

const userSchema = new Schema({

  firstName: {
    type: String,
    required: true,
    trim: true,
  },

  lastName: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Must match an email address!'],
  },

  password: {
    type: String,
    required: true,
    minlength: [5, 'Password must be 5 characters or longer!'],
  },

  isAdmin: {
    type: Boolean,
    default: false,
    allowNull: false,
  },

});

const User = model('User', userSchema);

module.exports = User;
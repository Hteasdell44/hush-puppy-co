const mongoose = require('mongoose');

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hush-puppy-co'
);

module.exports = mongoose.connection;

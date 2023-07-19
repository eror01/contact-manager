const mongoose = require('mongoose');

const db = async () => {
  return mongoose.connect(process.env.MONGO_URL);
};

module.exports = db;
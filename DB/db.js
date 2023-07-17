const mongoose = require('mongoose');

const db = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log('Database connected:', connect.connection.host, connect.connection.name);
  } catch (error) {
    console.log(error);
    process.exit(1)
  }
}

module.exports = db;
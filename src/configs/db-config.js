const mongoose = require("mongoose");

const databaseConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected ${conn.connection.host}`);
} catch (err) {
    console.log(`Uh, something unexpected happens: ${err}`);
    process.exit(1);
  }
};

module.exports = databaseConnection;

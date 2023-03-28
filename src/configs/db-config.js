const mongoose = require("mongoose");

const databaseConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      keepAlive: true,
      maxPoolSize: 1000,
      noDelay: true,
    });
  } catch (err) {
    console.log(`Uh, something unexpected happens: ${err}`);
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  const { host, port, name } = mongoose.connection;
  console.log("Mongoose connected to DB!");
  console.log(`- Host: ${host}`);
  console.log(`- Port: ${port}`);
  console.log(`- Name: ${name}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from DB!");
});

mongoose.connection.on("error", (err) => {
  console.log(`Mongoose connection error: ${err}`);
});

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("Mongoose disconnected from DB due to app termination!");
    process.exit(0);
  });
});

module.exports = databaseConnection;

const mongoose = require("mongoose");
const { URI, DB_NAME } = require("../constants");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${URI}`, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(
      `✅ MongoDB connected | HOST: ${conn.connection.host} | DB: ${conn.connection.name}`
    );
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  }
};

const gracefulShutdown = async (signal) => {
  console.log(`⚠️ Received ${signal}. Closing MongoDB connection...`);

  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }

  console.log("🔌 MongoDB disconnected");
  process.exit(0);
};

["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
  process.on(signal, gracefulShutdown);
});

module.exports = { connectDB };

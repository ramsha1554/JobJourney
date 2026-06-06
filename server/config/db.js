const dotenv = require("dotenv");
dotenv.config({ path: require("path").resolve(__dirname, ".env") });

const mongoose = require("mongoose");

const connectDB = async () => {
  const uri =
    process.env.MONGO_URI || process.env.MONGODB_URI || process.env.MONGO_URL;

  if (!uri) {
    console.error(
      "MongoDB connection URI is missing. Expected one of: MONGO_URI, MONGODB_URI, or MONGO_URL",
    );
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

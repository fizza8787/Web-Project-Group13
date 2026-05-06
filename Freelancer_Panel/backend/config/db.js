const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;
  if (!uri) {
    console.error(
      "Missing Mongo connection string. Set MONGO_URI in backend/.env (copy from .env.example). Example: mongodb://127.0.0.1:27017/freelancehub"
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.error(
      "If you see ECONNREFUSED on 127.0.0.1:27017, MongoDB is not running locally OR your MONGO_URI is wrong. Fix by starting MongoDB locally, using Docker Mongo, or switching MONGO_URI to MongoDB Atlas."
    );
    process.exit(1);
  }
};

module.exports = connectDB;

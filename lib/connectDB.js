import mongoose from "mongoose";

export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB is already connected");
      return;
    }
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process with failure
  }
}

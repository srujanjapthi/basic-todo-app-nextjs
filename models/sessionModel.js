import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 * 24 * 7,
  },
});

const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);
export default Session;

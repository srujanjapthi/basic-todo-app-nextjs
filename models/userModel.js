import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    strict: "throw",
    statics: {
      findByEmail(email) {
        return this.findOne({ email });
      },
    },
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

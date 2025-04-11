import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Important!
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: {Object},
    required: true,
  },

  answer :   {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export const userModel = mongoose.model('User', userSchema);

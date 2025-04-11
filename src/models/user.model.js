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
    type: new mongoose.Schema({ // Define a nested schema
      street: { type: String },
      city: { type: String },
      postalCode: { type: String },
      // ... other address fields
    }, { _id: false }), // _id: false prevents Mongoose from creating a separate _id for the subdocument
    required: true,
  },

  answer: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export const userModel = mongoose.model('User', userSchema);

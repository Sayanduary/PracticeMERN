import { userModel } from "../models/user.model.js";
import { hashPassword, comparePassword } from "../Helpers/authHelper.js";
import JWT from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });


export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    // validation checking
    if (!name || !email || !password || !phone || !address || !answer) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }
    // check user is already registered or not
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }
    // password length should be 8 characters
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password length should be 8 characters'
      });
    }
    // hash password
    const hashedPassword = await hashPassword(password);

    // create user - FIXED: don't chain .save() after create()
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      answer
    });

    return res.status(200).json({
      success: true,
      message: 'User registered successfully',
      newUser
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error in Registration',
      error: error.message
    });
  }
}

export const loginController = async (req, res) => {

  try {

    const { email, password } = req.body;

    //validation checking 
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    //check user is registered or not
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      })
    }

    //compare password
    const isPasswordMatched = await comparePassword(password, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    //generate token
    const token = JWT.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // or however long you want
    );


    //send response
    res.status(200).json({
      success: true,
      message: 'Login successfully',
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      },
      token,
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Something Went Wrong When Log In',
      error: error.message
    })
  }
};


//forgotPasswordController

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newpassword } = req.body; // Changed to match frontend field name

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    if (!answer) {
      return res.status(400).json({
        success: false,
        message: 'Answer is required'
      });
    }
    if (!newpassword) {
      return res.status(400).json({
        success: false,
        message: 'New Password is required'
      });
    }

    // Check
    const user = await userModel.findOne({ email, answer });

    // Validation
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Wrong Email or Answer'
      });
    }

    const hashed = await hashPassword(newpassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};
// admin access 

export const isAdmin = async (req, res, next) => {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    // Ensure user has admin privileges
    if (req.user.role !== 1) {
      return res.status(403).json({
        success: false,
        message: 'Access denied - Admins only',
      });
    }

    next();
  } catch (error) {
    console.error('isAdmin middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in admin check',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};


export const testController = (req, res) => {
  res.json({
    success: true,
    message: 'Protected route accessed successfully!',
    user: req.user, // Optional: shows the authenticated user's info
  });
};
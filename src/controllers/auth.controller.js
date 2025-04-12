import { userModel } from "../models/user.model.js";
import { hashPassword, comparePassword } from "../Helpers/authHelper.js";
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator'; // For validation
import Order from "../models/order.model.js";

dotenv.config({ path: './.env' });

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    // Input validation
    await body('name').notEmpty().withMessage('Name is required').run(req);
    await body('email').isEmail().withMessage('Valid email is required').run(req);
    await body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters').run(req);
    await body('phone').notEmpty().withMessage('Phone number is required').run(req);
    await body('address').notEmpty().withMessage('Address is required').run(req);
    await body('answer').notEmpty().withMessage('Answer is required').run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
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
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  SERVER_ERROR: 500,
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    await Promise.all([
      body('email').isEmail().withMessage('Valid email is required').run(req),
      body('password').notEmpty().withMessage('Password is required').run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: errors.array() });
    }

    // Check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'User not found' });
    }

    // Compare password
    const isPasswordMatched = await comparePassword(password, user.password);
    if (!isPasswordMatched) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token including the user role
    const token = JWT.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Send response
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Login successfully',
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong when logging in',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// forgotPasswordController
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newpassword } = req.body;

    // Input validation
    await body('email').isEmail().withMessage('Valid email is required').run(req);
    await body('answer').notEmpty().withMessage('Answer is required').run(req);
    await body('newpassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters').run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array() });
    }

    // Check user
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Invalid Email or Answer' });
    }

    // Update password
    const hashedPassword = await hashPassword(newpassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Admin access middleware
const ROLES = {
  ADMIN: 1,
  USER: 0,
  // Add other roles as necessary
};

// export const isAdmin = async (req, res, next) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: 'User not authenticated',
//       });
//     }

//     // Check if user is an admin
//     if (req.user.role !== ROLES.ADMIN) {
//       return res.status(403).json({
//         success: false,
//         message: 'Access denied - Admins only',
//       });
//     }

//     // Proceed to the next middleware or route handler
//     next();
//   } catch (error) {
//     console.error('isAdmin middleware error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Server error in admin check',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined,
//     });
//   }
// };

// Test controller
export const testController = (req, res) => {
  res.json({
    success: true,
    message: 'Protected route accessed successfully!',
    user: req.user, // Optional: shows the authenticated user's info
  });
};





export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const user = await userModel.findById(req.user._id);
    
    if(password && password.length <6){
      return res.status(400).json({
        success: false,
        message: 'Password is required and must be at least 6 characters',
      });
    }
    const hashedPassword = password ? (await hashPassword(password)) : user.password;
    const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
      name:name ||user.name,
      email:email || user.email,
      password:hashPassword || user.password,
      phone:phone || user.phone,
      address:address ||user.address,
    }, 
    { new: true });
    res.status(200).send({
      success: true,
      message: 'Profile updated successfully',
      updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error
    });
  }
};



export const getOrdersController = async (req, res) => {
  try {
    const orders = await orders.find({buyer:req.user._id }).populate("products","-photo").populate("buyer","name")
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch orders",
      error
    });
  }
};





















    
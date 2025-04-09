import JWT from 'jsonwebtoken';
import { userModel } from '../models/user.model.js';

export const requireSignIn = async (req, res, next) => {
  try {
    // Get the token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    // Verify and decode the token
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database
    const user = await userModel.findById(decoded._id).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    const message =
      error.name === 'TokenExpiredError'
        ? 'Token expired. Please login again.'
        : 'Invalid token';

    res.status(401).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

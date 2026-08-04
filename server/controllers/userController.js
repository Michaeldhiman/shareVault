import * as authService from '../services/authService.js';

/**
 * Controller handling user profile management.
 */

/**
 * GET /api/user/profile
 * Get authenticated user profile.
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getUserProfile(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/user/profile
 * Update user profile.
 */
export const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await authService.updateUserProfile(req.user._id, req.body);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

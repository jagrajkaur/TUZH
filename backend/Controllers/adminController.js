// adminController.js

import User from '../models/User.js'; // Import your User model

// Approve a user
export const approveUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isApproved = "Approved"; // Assuming you have a field isApproved in your User model
    await user.save();

    res.status(200).json({ message: "User approved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reject a user
export const rejectUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isApproved = "Rejected"; // Assuming you have a field isApproved in your User model
    await user.save();

    res.status(200).json({ message: "User Rejected successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get list of pending doctors
export const getPendingDoctors = async (req, res) => {
    try {
      const pendingDoctors = await User.find({ user_type: "Doctor", isApproved: "Pending" })
                                        .select('first_name last_name speciality'); // Select specific fields
      res.status(200).json(pendingDoctors);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
};

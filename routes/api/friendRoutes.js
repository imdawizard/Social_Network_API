const express = require('express');
const router = express.Router();
const User = require('../../models/user');

// POST to add a new friend to a user's friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    // Find the user by userId and update their friend list to add friendId
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { friends: friendId } }, // Use $addToSet to prevent duplicate friends
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Friend added successfully', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE to remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    // Find the user by userId and update their friend list to remove friendId
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } }, // Use $pull to remove friendId
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Friend removed successfully', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
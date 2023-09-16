const express = require('express');
const router = express.Router();
const User = require('../../models/user');



router.post('/:userId/:friendId', async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    console.log('userId:', userId);
    console.log('friendId:', friendId);
    

    // Verify user existence, !user print user not found
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    //push new friend id to friends array
    const updatedUser = await User.findByIdAndUpdate(userId, {$push: {friends: friendId}});

    res.json({ message: 'Friend added successfully', updatedUser, friendCount: user.friendCount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:userId/:friendId', async (req, res) => {
  try {
    const {userId, friendId } = req.params;

     // Find the user by userId and update their friend list to remove friendId
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } }, // Use $pull to remove friendId
      { new: true }
    );

    //verify user
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    //remove friend from friend array

    //send success or error message
    res.json({ message: 'Friend removed successfully', user, friendCount: user.friendCount });
    } catch (err) {
    res.status(400).json({ error: err.message });
    }
});


module.exports = router;
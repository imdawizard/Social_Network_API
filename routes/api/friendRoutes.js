const express = require('express');
const router = express.Router();
const User = require('../../models/user');

// POST to add a new friend to a user's friend list
// router.post('/', async (req, res) => {
//   try {
//     const { userId, friendId } = req.params;

//     // Find the user by userId and update their friend list to add friendId
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { $addToSet: { friends: friendId } }, // Use $addToSet to prevent duplicate friends
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({ message: 'Friend added successfully', user });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // DELETE to remove a friend from a user's friend list
// router.delete('/', async (req, res) => {
//   try {
//     const { userId, friendId } = req.params;

//     // Find the user by userId and update their friend list to remove friendId
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { $pull: { friends: friendId } }, // Use $pull to remove friendId
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({ message: 'Friend removed successfully', user });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });



// POST to increase the friend count for a user
// router.post('/', async (req, res) => {
//   try {
//     const { userId, friendId } = req.params;

//     // Find the user by userId and increment the friendCount
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { $inc: { friendCount: 1 } }, // Increment friendCount by 1
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({ message: 'Friend added successfully', user });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// DELETE to decrease the friend count for a user
// router.delete(':userId/friends/:friendId', async (req, res) => {
//   try {
//     const { userId, friendId } = req.params;

//     // Find the user by userId and decrement the friendCount
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { $inc: { friendCount: -1 } }, // Decrement friendCount by 1
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({ message: 'Friend removed successfully', user });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    console.log('userId:', userId);
    console.log('friendId:', friendId);
    
    // Verify user existence
    const user = await User.findById(userId).populate('friends');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    user.friendCount++;
    await user.save();
    // Increment the friend count
    // const updatedUser = await User.findByIdAndUpdate(
    //   userId,
    //   { $inc: { friendCount: 1 } }, // Increment friendCount by 1
    //   { new: true }
    // );

    res.json({ message: 'Friend added successfully', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Thought = require('../../models/thought');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single user by its _id and populate thought and friend data
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .populate('thoughts') // Populate user's thoughts
      console.log(`The friendCount is ${user.friendCount}`);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new user
router.post('/', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT to update a user by its _id
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true, // Return the updated user
      runValidators: true, // Run model validations
    });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE to remove a user by its _id
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // BONUS: Remove a user's associated thoughts when deleted
    await Thought.deleteMany({ username: userId });

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
// In this code:

// The GET route at /api/users fetches all users.
// The GET route at /api/users/:id fetches a single user by their _id and populates their thoughts and friends data.
// The POST route at /api/users creates a new user.
// The PUT route at /api/users/:id updates a user by their _id.
// The DELETE route at /api/users/:id removes a user by their _id and, as a bonus, also deletes their associated thoughts.






const express = require('express');
const router = express.Router();
const Thought = require('../../models/thought');
const User = require('../../models/user');

// GET to get all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    const thoughtsRC = thoughts.map((thoughts) => ({
      ...thoughts.toJSON(),
      reactionCount: thoughts.reactionCount,
    }));
    res.json(thoughtsRC);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET  a single thought by its _id
router.get('/:thoughtId', async (req, res) => {
  try {
    const thoughtId = req.params.thoughtId;
    const thought = await Thought.findById(thoughtId);
    if (!thought) {
      return res.status(404).json('Thought not found');
    }
    res.json({message: thought, reactionCount: thought.reactionCount});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST to create a new thought
router.post('/', async (req, res) => {
  try {
    const { thoughtText, username, userId } = req.body;
    
    // Create the thought
    const newThought = await Thought.create({ thoughtText, username });

    // Push the created thought's _id to the associated user's thoughts array field
    await User.findByIdAndUpdate(userId, { $push: { thoughts: newThought._id } });

    res.status(201).json({message: newThought, reactionCount: newThought.reactionCount});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT to update a thought by its _id
router.put('/:thoughtId', async (req, res) => {
  try {
    const thoughtId = req.params.thoughtId;
    const updatedThought = await Thought.findByIdAndUpdate(thoughtId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    res.json({messagee: updatedThought, reactionCount: updatedThought.reactionCount});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE to remove a thought by its _id
router.delete('/:thoughtId', async (req, res) => {
  try {
    const thoughtId = req.params.thoughtId;

    // Remove the thought from the associated user's thoughts array
    const thought = await Thought.findByIdAndRemove(thoughtId);
    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }
    
    // Remove the thought's _id from the user's thoughts array
    await User.findByIdAndUpdate(thought.userId, { $pull: { thoughts: thoughtId } });

    res.json({ message: 'Thought removed successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST to create a reaction stored in a single thought's reactions array field
router.post('/:thoughtId/reactions', async (req, res) => {
  try {
    const thoughtId = req.params.thoughtId;
    const { reactionBody, username } = req.body;

    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $push: { reactions: { reactionBody, username } } },
      { new: true, runValidators: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    res.status(201).json({message: updatedThought, reactionCount: updatedThought.reactionCount});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE to pull and remove a reaction by the reaction's reactionId value
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const thoughtId = req.params.thoughtId;
    const reactionId = req.params.reactionId;

    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $pull: { reactions: { _id: reactionId } } },
      { new: true }
    );

    if (!updatedThought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    res.json({message: 'Reaction deleted successfully'});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
const User = require('../models/user');

module.exports = {
  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async updateUser(req, res) {
    try {
      const userId = req.params.userId;
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
        runValidators: true,
      });
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async deleteUser(req, res) {
    try {
      const userId = req.params.userId;
      await User.findByIdAndRemove(userId);
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  
  async addFriend(req, res) {
    try {
      const { userId, friendId } = req.params;
  
      // Specify _id field in the update object
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { friends: friendId }, _id: userId },
        { new: true }
      );
  
      res.json({ message: 'Friend added successfully', user: updatedUser });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async removeFriend(req, res) {
    try {
      const { userId, friendId } = req.params;
      await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
      res.json({ message: 'Friend removed successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
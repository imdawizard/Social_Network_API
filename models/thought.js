const mongoose = require('mongoose');

// Define the Reaction Schema
const reactionSchema = new mongoose.Schema(
  {
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280, // Limit reaction body to 280 characters
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // Use a getter method to format the timestamp on query
      get: (timestamp) => formatDate(timestamp),
    },
  },
  {
    _id: false, // Disable auto-generation of _id for nested documents
  }
);

// Define the Thought Schema
const thoughtSchema = new mongoose.Schema({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // Use a getter method to format the timestamp on query
    get: (timestamp) => formatDate(timestamp),
  },
  username: {
    type: String,
    required: true,
  },
  reactions: [reactionSchema], // Array of nested reaction documents
});

// Create a virtual property 'reactionCount' to get the length of the 'reactions' array
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

// Helper function to format timestamps
function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString(); // You can customize the format
}

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;
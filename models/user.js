const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match:  /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, // Email format validation
    },
    thoughts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thought',
        },
    ],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Self-reference to User model
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Create a virtual property 'friendCount' to get the length of the 'friends' array
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
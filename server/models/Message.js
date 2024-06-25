// models/Message.js

const mongoose = require('mongoose');


// Define the schema for the Messages collection
const messageSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    channel_id: { type: String, required: true },
    user_id: { type: Number, required: true },
    creator_id: { type: Number, required: true },
    created_npmat: { type: Date, applyDefaults: Date.now }
    // id: { type: Number, required: true },
    // // message_id: { type: Number, required: true, unique: true },
    // channel_id: { type: Number, required: true },
    // user_id: { type: Number, required: true },
    // content: { type: String, required: true },
    // created_at: { type: Date, required: true }
});

// Create a model using the schema
const Message = mongoose.model('Message', messageSchema);

// Export the model to use in other parts of the application
module.exports = Message;
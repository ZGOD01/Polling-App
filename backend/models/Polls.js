const mongoose = require('mongoose'); // Import mongoose
const { Schema } = mongoose; // Extract Schema from mongoose

const PollSchema = new Schema({
    question: { type: String, required: true },
    type: { type: String, required: true },
    options: [
        { 
            optionText: { type: String, required: true },
            votes: { type: Number, default: 0 }, // For tracking votes
        },
    ],
    imageUrl: { type: String },
    responses: [
        {
            voterId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // For open-ended polls
            responseText: { type: String }, // User-submitted text response
            createdAt: { type: Date, default: Date.now },
        },
    ],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Fixed typo
    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Prevent multiple votes
    createdAt: { type: Date, default: Date.now }, // Fixed default Date.now
    closed: { type: Boolean, default: false }, // To mark polls as closed
});

module.exports = mongoose.model('Poll', PollSchema);

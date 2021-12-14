const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goalSchema = new Schema({
    title: String,
    content: String
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);


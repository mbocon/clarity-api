const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, unique: true },
    password: String,
    birthdate: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);


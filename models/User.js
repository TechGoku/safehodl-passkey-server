const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    rawId: { type: String, required: true,  unique: true },
    pubkeyX: { type: Buffer, required: true, unique: true },
    pubkeyY: { type: Buffer, required: true,  unique: true }
});


module.exports = mongoose.model('User', userSchema);

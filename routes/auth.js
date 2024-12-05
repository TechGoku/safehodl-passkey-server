const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
// const authenticateToken = require('../middlewares/authMiddleware.js')

require('dotenv').config();
const router = express.Router();

// Signup
router.post('/signup',async (req, res)=>{
    const {rawId, X, Y } = req.body;

    try {
        //Check if the user already exists
        const existingUser = await User.findOne({rawId});

        console.log('existingUser',existingUser);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Convert hex string to Buffer (removing "0x" prefix)
        const pubkeyX = Buffer.from(X.slice(2), 'hex');
        const pubkeyY = Buffer.from(Y.slice(2), 'hex');

        // Create a User
        const newUser = new User({rawId, pubkeyX, pubkeyY});
        await newUser.save();

        res.status(201).json({message:'User created successfully'});
    }catch(err){
        res.status(500).json({ message: 'Server error', error: err.message });
    }

});

// Login
router.post('/login',async (req, res)=>{
    const { rawId } = req.body;

    try {
        //Check if the user already exists
        const user = await User.findOne({rawId});
        console.log('user details (login) from DB', user);
        
        if (!user) {
            return res.status(404).json({ message: 'User not exists' });
        }
    
        const pubkeyXHex = "0x" + user.pubkeyX.toString('hex'); // Converts Buffer to hex string
        const pubkeyYHex = "0x" + user.pubkeyY.toString('hex');

        res.status(200).json({
            message: 'Profile details retrieved successfully',
            data: {
                rawId: user.rawId,
                pubkeyX: pubkeyXHex,
                pubkeyY: pubkeyYHex
            }
        });

    }catch(err){
        res.status(500).json({ message: 'Server error', error: err.message });
    }

})

module.exports = router;
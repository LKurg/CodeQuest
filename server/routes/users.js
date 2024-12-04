const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Log the value of JWT_SECRET to ensure it's being loaded correctly
console.log('JWT_SECRET:', JWT_SECRET);

// Register a new user
router.post('/register', async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        next(error); // Pass errors to the global error handler
    }
});

// Login a user
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Log the payload before signing the token to verify it's correct
        console.log('User Payload:', { id: user._id, email: user.email });

        // Log the JWT_SECRET to verify it's correctly loaded
        console.log('JWT_SECRET:', JWT_SECRET);

        // Sign the JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        
        // Log the generated token to verify it's being created
        console.log('Generated Token:', token);

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        next(error); // Pass errors to the global error handler
    }
});

// Logout a user
router.post('/logout', (req, res, next) => {
    try {
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        next(error); // Pass errors to the global error handler
    }
});

module.exports = router;

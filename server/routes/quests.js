const express = require('express');
const Quest = require('../models/Quest');

const router = express.Router();

// Get all quests
router.get('/', async (req, res) => {
    try {
        const quests = await Quest.find();
        res.json(quests);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching quests' });
    }
});

// Create a new quest
router.post('/', async (req, res) => {
    const { title, description, difficulty } = req.body;

    try {
        const newQuest = new Quest({ title, description, difficulty });
        await newQuest.save();
        res.status(201).json(newQuest);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

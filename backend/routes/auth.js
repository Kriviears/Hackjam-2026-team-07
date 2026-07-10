const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


router.post('/register', async (req, res) => {
  try {
    const { name, email, password, roadmapData } = req.body;

    if (!name || !email || !password || !roadmapData) {
      return res.status(400).json({ error: "Name, email, password, and roadmapData are required." });
    }

    if (!roadmapData.track_id || !roadmapData.title || !roadmapData.match_reason) {
      return res.status(400).json({ error: "roadmapData must include track_id, title, and match_reason." });
    }

 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered." });
    }

 
    const hashedPassword = await bcryptjs.hash(password, 10);

   
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      persona: "aspiring_candidate",
      track: {
        track_id: roadmapData.track_id,
        title: roadmapData.title,
        match_reason: roadmapData.match_reason
      },
      progress: {
        coursePercent: 0,
        completedSkills: []
      }
    });

    await newUser.save();

   
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(201).json({
      token,
      userId: newUser._id,
      message: "Registration successful!"
    });

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ error: "Server error during registration." });
  }
});

 
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

     
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

 
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

   
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

   
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      token,
      userId: user._id,
      message: "Login successful!"
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Server error during login." });
  }
});

module.exports = router;

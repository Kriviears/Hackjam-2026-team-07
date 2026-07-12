const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PERSONAS = ['aspiring_candidate', 'learner', 'alumni'];

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, persona, roadmapData } = req.body;
    const trackTitle = roadmapData && (roadmapData.title || roadmapData.track_title);

    if (!name || !email || !password || !roadmapData) {
      return res.status(400).json({ error: "Name, email, password, and roadmapData are required." });
    }
    if (persona !== undefined && !PERSONAS.includes(persona)) {
      return res.status(400).json({ error: "persona must be aspiring_candidate, learner, or alumni." });
    }

    if (!roadmapData.track_id || !trackTitle || !roadmapData.match_reason) {
      return res.status(400).json({ error: "roadmapData must include track_id, title or track_title, and match_reason." });
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
      persona: persona || 'aspiring_candidate',
      track: {
        track_id: roadmapData.track_id,
        title: trackTitle,
      },
      ai_profile: {
        soft_skills: Array.isArray(roadmapData.soft_skills) ? roadmapData.soft_skills : [],
        mentor_style_match: typeof roadmapData.mentor_style_match === 'string' ? roadmapData.mentor_style_match : "",
        match_reason: roadmapData.match_reason,
        growth_areas: Array.isArray(roadmapData.growth_areas) ? roadmapData.growth_areas : []
      },
      progress: {
        courses: []
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
      persona: newUser.persona,
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
      persona: user.persona,
      message: "Login successful!"
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Server error during login." });
  }
});

module.exports = router;

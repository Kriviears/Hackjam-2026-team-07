const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { Mistral } = require('@mistralai/mistralai');
const Track = require('../models/Track');
const { loadSystemPrompt } = require('../utils/loadSystemPrompt');

const onboardingLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1-minute window
  max: 3, // Limit each IP to 3 requests per minute
  message: { error: "Too many attempts. Please wait a minute before trying again." },
  standardHeaders: true,
  legacyHeaders: false,
});

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

// @route   POST /api/onboarding
// @desc    Process candidate's soft skills text via Mistral AI & return merged roadmap on-the-fly
// @access  Public (Protected by Rate Limiter)
router.post('/', onboardingLimiter, async (req, res) => {
  try {
    const { userResponse } = req.body; // Expects raw text from frontend textarea

    // 2. INPUT VALIDATION: Basic protection against empty or oversized text floods
    if (!userResponse || typeof userResponse !== 'string') {
      return res.status(400).json({ error: "Please enter your response." });
    }
    
    const textLength = userResponse.trim().length;
    if (textLength < 10) {
      return res.status(400).json({ error: "Your response is too short. Please write at least 1-2 complete sentences." });
    }
    if (textLength > 400) {
      return res.status(400).json({ error: "Your response is too long. Please keep it under 400 characters." });
    }

    // 3. SYSTEM PROMPT: Guides the LLM to strictly classify the user and output clean JSON
    const systemPrompt = loadSystemPrompt();
 //   Allowed values for track_id are exactly: "cloud" or "cybersecurity".
    // 4. MISTRAL API CALL: Requesting structured JSON chat completion
    const aiResponse = await mistral.chat.complete({
      model: "mistral-small-latest",  
      responseFormat: { type: "json_object" },  
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `User Answer: "${userResponse}"` }
      ],
      temperature: 0.7,
      maxTokens: 300
    });

    // Parse Mistral AI output safely
    const rawAiContent = aiResponse.choices[0].message.content;
    const aiData = JSON.parse(rawAiContent.trim());
    const selectedTrackId = aiData.track_id; // expectation: 'cloud' or 'cybersecurity'

    // 5. THE MERGE ENGINE LOGIC: Load the selected track and courses from MongoDB.
    const trackConfig = await Track.findOne({ track_id: selectedTrackId }).lean();
    
    if (!trackConfig) {
      return res.status(404).json({ error: "Matched track is not available." });
    }

    // Inject the AI personalized reason into the response track object
    const trackData =  {
        track_id: trackConfig.track_id,
        title: trackConfig.track_title,
        track_title: trackConfig.track_title,
        avg_salary: aiData.avg_salary,
        match_reason: aiData.match_reason,
        soft_skills: Array.isArray(aiData.soft_skills) ? aiData.soft_skills : [],
        mentor_style_match: typeof aiData.mentor_style_match === 'string' ? aiData.mentor_style_match : "",
        growth_areas: Array.isArray(aiData.growth_areas) ? aiData.growth_areas : []
    };    

   // Initialize all skills to 'isMastered: false' because this is a brand new anonymous Guest/Candidate
    const formatTierSkills = (courses) => {
      if (!courses) return [];
      return courses.map(course => ({
        ...course,
        skills: course.skills.map(skillName => ({
          name: skillName,
          isMastered: false // Fresh candidate always starts at zero score
        }))
      }));
    };

 
    const dynamicResponsePayload = {
      userId: "guest_session_" + Math.random().toString(36).substr(2, 9), // Temporary session ID
      persona: "aspiring_candidate",
      track: trackData, 
      timeline: {
        junior: {
          status: "active",
          label: trackConfig.timeline.junior.label,
          courses: formatTierSkills(trackConfig.timeline.junior.courses)
        },
        middle: {
          status: "locked",
          label: trackConfig.timeline.middle.label,
          courses: formatTierSkills(trackConfig.timeline.middle.courses)
        },
        senior: {
          status: "locked",
          label: trackConfig.timeline.senior.label,
          courses: formatTierSkills(trackConfig.timeline.senior.courses)
        }
      },
    };

    
    return res.status(200).json(dynamicResponsePayload);

  } catch (error) {
    console.error("Mistral AI Onboarding Route Error:", error);
    return res.status(500).json({ error: "Internal Server Error during AI classification process." });
  }
});

module.exports = router;
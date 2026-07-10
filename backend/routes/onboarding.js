const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const { Mistral } = require('@mistralai/mistralai'); 

const onboardingLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1-minute window
  max: 3, // Limit each IP to 3 requests per minute
  message: { error: "Too many attempts. Please wait a minute before trying again." },
  standardHeaders: true,
  legacyHeaders: false,
});

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

const getTrackMetadata = (trackId) => {
  try {
    const filePath = path.join(__dirname, '..', 'metadata', `${trackId}.json`);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const parsedData = JSON.parse(rawData);
    // Return the nested track object (e.g., parsedData.cloud)
    return parsedData[trackId];
  } catch (error) {
    console.error(`Error reading metadata file for track: ${trackId}`, error);
    return null;
  }
};

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
    const systemPrompt = `
You are an AI Career Coach for Per Scholas. The user is a complete beginner. You must analyze their answer to the situational question and match them with EXACTLY ONE of these 5 platform courses:

1. Cloud Support Associate (If they enjoy fast-paced environments, server setups, and helping clients fix live systems).
2. Cybersecurity Analyst (If they mention safety, catching hackers, fixing vulnerabilities, or auditing systems for risks).
3. Data Engineer (If they prefer working quietly with large databases, structured folders, spreadsheets, or long backend puzzles).
4. Software Engineer (If they explicitly talk about building creative tools, coding apps, making websites, or designing user features).
5. Systems Support Specialist (If they like hardware, setting up physical computers/routers, operating systems, and classic IT support).

 
 Return your response STRICTLY as a JSON object with 3 fields. Do not wrap it in \`\`\`json markdown blocks:
track_id (cloud/cybersecurity/data_engineering/software_engineering/systems_support),
title (Full Role Title),
match_reason (A personalized explanation referencing the user's own words).
    `;
 //   Allowed values for track_id are exactly: "cloud" or "cybersecurity".
    // 4. MISTRAL API CALL: Requesting structured JSON chat completion
    const aiResponse = await mistral.chat.complete({
      model: "mistral-small-latest",  
      responseFormat: { type: "json_object" },  
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `User Answer: "${userResponse}"` }
      ]
    });

    // Parse Mistral AI output safely
    const rawAiContent = aiResponse.choices[0].message.content;
    const aiData = JSON.parse(rawAiContent.trim());
    const selectedTrackId = aiData.track_id; // expectation: 'cloud' or 'cybersecurity'

    // 5. THE MERGE ENGINE LOGIC: Read static content from files without hitting MongoDB
    const trackConfig = getTrackMetadata(selectedTrackId);
    
    if (!trackConfig) {
      return res.status(500).json({ error: "Matched track metadata file not found on server." });
    }

    // Inject the AI personalized reason into the response track object
    const trackData = {
      track_id: trackConfig.track_id,
      track_title: trackConfig.track_title,
      avg_salary: trackConfig.avg_salary,
      match_reason: aiData.match_reason
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
      mentors: [
        { name: "Sample Mentor", role: `Senior ${trackConfig.track_title}`, track: selectedTrackId }
      ]
    };

    
    return res.status(200).json(dynamicResponsePayload);

  } catch (error) {
    console.error("Mistral AI Onboarding Route Error:", error);
    return res.status(500).json({ error: "Internal Server Error during AI classification process." });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const requireAuth  = require('../middleware/requireAuth');
const { getTrackMetadata } = require('../utils/trackMetadata');

// @route   GET /api/roadmap/:userId
// @desc    Dynamic Merge Engine. Combines user's DB progress with static JSON metadata configs
// @access  Private (caller must be the owner of :userId)
router.get('/:userId', requireAuth, async (req, res) => {
  try {
    if (req.params.userId !== req.userId) {
      return res.status(403).json({ error: "You are not allowed to view this user's roadmap." });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User profile not found in database." });
    }

    // 1. Pull the master static design configuration from the file system
    const trackConfig = getTrackMetadata(user.track.track_id);
    if (!trackConfig) {
      return res.status(500).json({ error: "Configuration template file missing for this track ID." });
    }

    const completedSkills = user.progress && Array.isArray(user.progress.completedSkills)
      ? user.progress.completedSkills
      : [];
    const coursePercent = user.progress && typeof user.progress.coursePercent === 'number'
      ? user.progress.coursePercent
      : 0;
    const aiProfile = user.ai_profile || {};
    const matchReason = aiProfile.match_reason || user.track.match_reason || trackConfig.match_reason || "";
    const softSkills = Array.isArray(aiProfile.soft_skills) ? aiProfile.soft_skills : [];
    const mentorStyleMatch = typeof aiProfile.mentor_style_match === 'string' ? aiProfile.mentor_style_match : "";
    const growthAreas = Array.isArray(aiProfile.growth_areas) ? aiProfile.growth_areas : [];

    // 2. MERGE LOGIC FUNCTION: Maps string arrays from DB to active boolean flags for React UI checkboxes
    const mergeCourseSkills = (courses) => {
      if (!courses) return [];
      return courses.map(course => ({
        ...course,
        skills: course.skills.map(skillName => ({
          name: skillName,
          // True if user has manually completed it and saved it in their MongoDB progress score array
          isMastered: completedSkills.includes(skillName)
        }))
      }));
    };

    // 3. UI LAYOUT STATE CONTROL: Adapts card locks dynamically based on the current user persona
    const juniorStatus = user.persona === 'alumni' ? 'completed' : 'active';
    const middleStatus = user.persona === 'alumni' ? 'active' : 'locked';
    const seniorStatus = 'locked'; // Always locked to show future 5-year trajectory scope

    const structuralTimelinePayload = {
      junior: {
        status: juniorStatus,
        label: trackConfig.timeline.junior.label,
        progress_percent: coursePercent, // Feeds React progress bar slider component
        courses: mergeCourseSkills(trackConfig.timeline.junior.courses)
      },
      middle: {
        status: middleStatus,
        label: trackConfig.timeline.middle.label,
        courses: mergeCourseSkills(trackConfig.timeline.middle.courses)
      },
      senior: {
        status: seniorStatus,
        label: trackConfig.timeline.senior.label,
        courses: mergeCourseSkills(trackConfig.timeline.senior.courses)
      }
    };

    // 4. Return combined dataset
    const trackInfo = {
      track_id: trackConfig.track_id,
      title: user.track.title || trackConfig.track_title,
      track_title: trackConfig.track_title,
      avg_salary: trackConfig.avg_salary,
      match_reason: matchReason,
      soft_skills: softSkills,
      mentor_style_match: mentorStyleMatch,
      growth_areas: growthAreas
    };

    return res.status(200).json({
      userId: user._id,
      persona: user.persona,
      track: trackInfo,
      timeline: structuralTimelinePayload,
      mentors: [
        { name: "Sarah Jenkins", role: `Lead Alumni Mentor - ${trackConfig.track_title}`, track: user.track.track_id }
      ]
    });

  } catch (error) {
    console.error("Merge Engine Error:", error);
    return res.status(500).json({ error: "Failed to resolve and merge user roadmap trajectory." });
  }
});

// @route   PATCH /api/roadmap/toggle-skill
// @desc    Progress Scoring Controller. Toggles individual skill string strings inside user's MongoDB array
// @access  Private
router.patch('/toggle-skill', requireAuth, async (req, res) => {
  try {
    const { skillName } = req.body;

    if (!skillName) {
      return res.status(400).json({ error: "skillName is required to register progress score changes." });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const skillIndex = user.progress.completedSkills.indexOf(skillName);

    if (skillIndex > -1) {
      // Skill found -> User unchecked it -> Pull it out of MongoDB array
      user.progress.completedSkills.splice(skillIndex, 1);
    } else {
      // Skill not found -> New checkmark registered -> Push it into MongoDB array
      user.progress.completedSkills.push(skillName);
    }

    await user.save();
    return res.status(200).json({ success: true, completedSkills: user.progress.completedSkills });

  } catch (error) {
    console.error("Progress Checkbox Scoring Error:", error);
    return res.status(500).json({ error: "Failed to persist score status change to database." });
  }
});

module.exports = router;
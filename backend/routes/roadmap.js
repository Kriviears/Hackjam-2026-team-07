const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Track = require('../models/Track');
const requireAuth  = require('../middleware/requireAuth');
const PROGRESS_ENABLED_PERSONAS = ['learner', 'alumni'];

const getTierSkills = (trackConfig, tierName) => {
  const tier = trackConfig.timeline && trackConfig.timeline[tierName];

  if (!tier || !Array.isArray(tier.courses)) {
    return [];
  }

  return tier.courses.flatMap((course) => Array.isArray(course.skills) ? course.skills : []);
};

const calculateProgressPercent = (completedSkills, tierSkills) => {
  if (!tierSkills.length) {
    return 0;
  }

  const completedCount = tierSkills.filter((skillName) => completedSkills.includes(skillName)).length;
  return Math.round((completedCount / tierSkills.length) * 100);
};

const getCourseProgress = (user, course) => {
  const savedProgress = user.progress && Array.isArray(user.progress.courses)
    ? user.progress.courses.find((progress) => progress.course_id === course.course_id)
    : null;
  const completedSkills = savedProgress ? savedProgress.completedSkills : [];
  const coursePercent = calculateProgressPercent(completedSkills, course.skills);

  return {
    completedSkills,
    coursePercent,
    status: savedProgress
      ? savedProgress.status
      : coursePercent === 100 ? 'completed' : coursePercent > 0 ? 'active' : 'locked'
  };
};

const getTierProgress = (user, tier) => {
  const courses = Array.isArray(tier.courses) ? tier.courses : [];
  const skills = courses.flatMap((course) => course.skills);
  const completedSkills = courses.flatMap((course) => {
    const courseProgress = getCourseProgress(user, course);
    return courseProgress.completedSkills;
  });

  return {
    completedSkills,
    percent: calculateProgressPercent(completedSkills, skills)
  };
};

// @route   GET /api/roadmap/:userId
// @desc    Dynamic Merge Engine. Combines user's DB progress with MongoDB track configs
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

    // 1. Pull the master track design configuration from MongoDB.
    const trackConfig = await Track.findOne({ track_id: user.track.track_id }).lean();
    if (!trackConfig) {
      return res.status(404).json({ error: "Track configuration not found for this user." });
    }

    const canTrackProgress = PROGRESS_ENABLED_PERSONAS.includes(user.persona);
    const aiProfile = user.ai_profile || {};
    const matchReason = aiProfile.match_reason || user.track.match_reason || trackConfig.match_reason || "";
    const softSkills = Array.isArray(aiProfile.soft_skills) ? aiProfile.soft_skills : [];
    const mentorStyleMatch = typeof aiProfile.mentor_style_match === 'string' ? aiProfile.mentor_style_match : "";
    const growthAreas = Array.isArray(aiProfile.growth_areas) ? aiProfile.growth_areas : [];
    const juniorProgress = canTrackProgress
      ? getTierProgress(user, trackConfig.timeline.junior)
      : { completedSkills: [], percent: 0 };
    const middleProgress = canTrackProgress
      ? getTierProgress(user, trackConfig.timeline.middle)
      : { completedSkills: [], percent: 0 };
    const juniorSkills = getTierSkills(trackConfig, 'junior');
    const middleSkills = getTierSkills(trackConfig, 'middle');
    const isJuniorCompleted = juniorSkills.length > 0 && juniorProgress.percent === 100;
    const isMiddleCompleted = middleSkills.length > 0 && middleProgress.percent === 100;

    // 2. MERGE LOGIC FUNCTION: Maps string arrays from DB to active boolean flags for React UI checkboxes
    const mergeCourseSkills = (courses) => {
      if (!courses) return [];
      return courses.map(course => ({
        ...course,
        progress: getCourseProgress(user, course),
        skills: course.skills.map(skillName => ({
          name: skillName,
          isMastered: canTrackProgress && getCourseProgress(user, course).completedSkills.includes(skillName)
        }))
      }));
    };

    // 3. UI LAYOUT STATE CONTROL: Adapts card locks dynamically based on the current user persona
    const juniorStatus = user.persona === 'alumni' || isJuniorCompleted ? 'completed' : 'active';
    const middleStatus = isMiddleCompleted ? 'completed' : (user.persona === 'alumni' || isJuniorCompleted ? 'active' : 'locked');
    const seniorStatus = isMiddleCompleted ? 'active' : 'locked';

    const structuralTimelinePayload = {
      junior: {
        status: juniorStatus,
        label: trackConfig.timeline.junior.label,
        progress_percent: juniorProgress.percent,
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
    const { courseId, skillName } = req.body;

    if (!courseId || !skillName) {
      return res.status(400).json({ error: "courseId and skillName are required to register progress." });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (!PROGRESS_ENABLED_PERSONAS.includes(user.persona)) {
      return res.status(200).json({
        success: true,
        completedSkills: [],
        tierProgressPercent: 0,
        isCourseCompleted: false
      });
    }

    const trackConfig = await Track.findOne({ track_id: user.track.track_id }).lean();
    if (!trackConfig) {
      return res.status(404).json({ error: "Track configuration not found for this user." });
    }

    const courses = Object.values(trackConfig.timeline).flatMap((tier) => tier.courses);
    const course = courses.find((item) => item.course_id === courseId);
    if (!course) {
      return res.status(400).json({ error: "Course does not belong to this user's track." });
    }
    if (!course.skills.includes(skillName)) {
      return res.status(400).json({ error: "Skill does not belong to this course." });
    }

    let courseProgress = user.progress.courses.find((progress) => progress.course_id === courseId);
    if (!courseProgress) {
      user.progress.courses.push({
        course_id: courseId,
        completedSkills: []
      });
      courseProgress = user.progress.courses[user.progress.courses.length - 1];
    }

    const skillIndex = courseProgress.completedSkills.indexOf(skillName);
    if (skillIndex > -1) {
      courseProgress.completedSkills.splice(skillIndex, 1);
    } else {
      courseProgress.completedSkills.push(skillName);
    }

    courseProgress.coursePercent = calculateProgressPercent(courseProgress.completedSkills, course.skills);
    courseProgress.status = courseProgress.coursePercent === 100
      ? 'completed'
      : courseProgress.coursePercent > 0 ? 'active' : 'locked';
    courseProgress.completedAt = courseProgress.status === 'completed' ? new Date() : undefined;

    const juniorProgress = getTierProgress(user, trackConfig.timeline.junior);

    await user.save();
    return res.status(200).json({
      success: true,
      courseId,
      completedSkills: courseProgress.completedSkills,
      tierProgressPercent: juniorProgress.percent,
      courseProgressPercent: courseProgress.coursePercent,
      courseStatus: courseProgress.status,
      isCourseCompleted: courseProgress.status === 'completed'
    });

  } catch (error) {
    console.error("Progress Checkbox Scoring Error:", error);
    return res.status(500).json({ error: "Failed to persist score status change to database." });
  }
});

module.exports = router;
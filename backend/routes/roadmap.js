const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Track = require('../models/Track');
const requireAuth  = require('../middleware/requireAuth');
const { getMentorsForTrack } = require('../data/mentors');
const PROGRESS_ENABLED_PERSONAS = ['learner', 'alumni'];

const calculateProgressPercent = (completedSkills, courseSkills) => {
  if (!courseSkills.length) {
    return 0;
  }

  const completedCount = courseSkills.filter((skillName) => completedSkills.includes(skillName)).length;
  return Math.round((completedCount / courseSkills.length) * 100);
};

// completedSkills is the only source of truth read here — coursePercent/status are always derived from it.
//  This function is used in both the GET /roadmap/:userId and PATCH /roadmap/toggle-skill endpoints.
const getCourseProgress = (user, course) => {
  const savedProgress = user.progress && Array.isArray(user.progress.courses)
    ? user.progress.courses.find((progress) => progress.course_id === course.course_id)
    : null;
  const completedSkills = savedProgress ? savedProgress.completedSkills : [];
  const coursePercent = calculateProgressPercent(completedSkills, course.skills);

  return {
    completedSkills,
    coursePercent
  };
};

// Percent-only helper for places that don't need the full rendered course list (e.g. toggle-skill).
const getTierPercent = (user, tier) => {
  const courses = Array.isArray(tier.courses) ? tier.courses : [];
  return courses.reduce((best, course) => Math.max(best, getCourseProgress(user, course).coursePercent), 0);
};

// Computes each course's progress exactly once, reusing it for both the skill checkmarks
// and the tier's overall percent — a tier is "passed" once ANY ONE of its courses hits 100%.
const buildTierView = (user, tier, canTrackProgress) => {
  const courses = Array.isArray(tier.courses) ? tier.courses : [];

  const renderedCourses = courses.map((course) => {
    const progress = canTrackProgress
      ? getCourseProgress(user, course)
      : { completedSkills: [], coursePercent: 0 };

    return {
      ...course,
      progress,
      skills: course.skills.map((skillName) => ({
        name: skillName,
        isMastered: progress.completedSkills.includes(skillName)
      }))
    };
  });

  const percent = renderedCourses.reduce((best, course) => Math.max(best, course.progress.coursePercent), 0);

  return {
    courses: renderedCourses,
    percent,
    isCompleted: percent === 100
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
    const matchReason = aiProfile.match_reason || "";
    const softSkills = Array.isArray(aiProfile.soft_skills) ? aiProfile.soft_skills : [];
    const mentorStyleMatch = typeof aiProfile.mentor_style_match === 'string' ? aiProfile.mentor_style_match : "";
    const growthAreas = Array.isArray(aiProfile.growth_areas) ? aiProfile.growth_areas : [];

    // 2. Build each tier once — course progress is computed a single time per course and reused
    // for both the skill checkmarks and the tier's overall percent.
    const junior = buildTierView(user, trackConfig.timeline.junior, canTrackProgress);
    const middle = buildTierView(user, trackConfig.timeline.middle, canTrackProgress);
    const senior = buildTierView(user, trackConfig.timeline.senior, canTrackProgress);

    // 3. UI LAYOUT STATE CONTROL: Unlock tiers solely from completed course progress.
    const juniorStatus = junior.isCompleted ? 'completed' : 'active';
    const middleStatus = middle.isCompleted ? 'completed' : (junior.isCompleted ? 'active' : 'locked');
    const seniorStatus = senior.isCompleted
      ? 'completed'
      : middle.isCompleted ? 'active' : 'locked';

    const structuralTimelinePayload = {
      junior: {
        status: juniorStatus,
        label: trackConfig.timeline.junior.label,
        progress_percent: junior.percent,
        courses: junior.courses
      },
      middle: {
        status: middleStatus,
        label: trackConfig.timeline.middle.label,
        progress_percent: middle.percent,
        courses: middle.courses
      },
      senior: {
        status: seniorStatus,
        label: trackConfig.timeline.senior.label,
        progress_percent: senior.percent,
        courses: senior.courses
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
      name: user.name,
      persona: user.persona,
      track: trackInfo,
      timeline: structuralTimelinePayload,
      mentors: getMentorsForTrack(user.track.track_id)
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

    const tierEntries = Object.entries(trackConfig.timeline);
    const courses = tierEntries.flatMap(([, tier]) => tier.courses);
    const course = courses.find((item) => item.course_id === courseId);
    if (!course) {
      return res.status(400).json({ error: "Course does not belong to this user's track." });
    }
    if (!course.skills.includes(skillName)) {
      return res.status(400).json({ error: "Skill does not belong to this course." });
    }

    let courseProgress = user.progress.courses.find((savedCourseProgress) => savedCourseProgress.course_id === courseId);
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

    const courseProgressPercent = calculateProgressPercent(courseProgress.completedSkills, course.skills);
    const courseStatus = courseProgressPercent === 100
      ? 'completed'
      : courseProgressPercent > 0 ? 'active' : 'locked';
    courseProgress.completedAt = courseStatus === 'completed' ? new Date() : undefined;

    // Recompute progress for whichever tier this course actually belongs to (not always junior).
    const [, ownerTier] = tierEntries.find(([, tier]) => tier.courses.some((item) => item.course_id === courseId));
    const tierProgressPercent = getTierPercent(user, ownerTier);

    await user.save();
    return res.status(200).json({
      success: true,
      courseId,
      completedSkills: courseProgress.completedSkills,
      tierProgressPercent,
      courseProgressPercent,
      courseStatus,
      isCourseCompleted: courseStatus === 'completed'
    });

  } catch (error) {
    console.error("Progress Checkbox Scoring Error:", error);
    return res.status(500).json({ error: "Failed to persist score status change to database." });
  }
});

module.exports = router;
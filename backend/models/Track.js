const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
  location: { type: String, required: true, trim: true },
  date: { type: String, required: true, trim: true }
}, { _id: false });

const CourseSchema = new mongoose.Schema({
  course_id: { type: String, required: true, trim: true },
  course_name: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  place: { type: [PlaceSchema], default: [] },
  skills: { type: [String], default: [] },
  target_roles: { type: [String], default: [] }
}, { _id: false });

const TierSchema = new mongoose.Schema({
  label: { type: String, required: true, trim: true },
  courses: { type: [CourseSchema], default: [] }
}, { _id: false });

const TrackSchema = new mongoose.Schema({
  track_id: { type: String, required: true, unique: true, trim: true },
  track_title: { type: String, required: true, trim: true },
  avg_salary: { type: String, required: false, trim: true },
  timeline: {
    junior: { type: TierSchema, required: true },
    middle: { type: TierSchema, required: true },
    senior: { type: TierSchema, required: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('Track', TrackSchema);

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  email: { 
    type: String, 
    required: true,
    unique: true 
  },
  password: { 
    type: String,
    required: true 
  },
  persona: { 
    type: String, 
    enum: ['aspiring_candidate', 'learner', 'alumni'], 
    default: 'aspiring_candidate' 
  },
  track: {
    track_id: { 
      type: String, 
      enum: ['cloud', 'cybersecurity', 'data_engineering', 'software_engineering', 'systems_support'], 
      required: true 
    },
    title: { 
      type: String, 
      required: true 
    },
  },

  progress: {
    coursePercent: { 
      type: Number, 
      default: 0
    },
 
    completedSkills: { 
      type: [String], 
      default: [] 
    }
  },

  ai_profile: {
    soft_skills: { 
      type: [String], 
      required: false, 
    },
    mentor_style_match: { 
      type: String, 
      required: false 
    },
    match_reason: { 
      type: String, 
      required: true 
    },
    growth_areas    : { 
      type: [String], 
      required: false, 
    },
  },
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', UserSchema);
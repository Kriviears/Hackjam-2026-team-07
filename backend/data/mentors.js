// Static, track-matched mentor directory keyed by track_id. Lets both the
// onboarding (guest) and roadmap (saved user) routes surface mentors without a
// schema/seed change. Promote to a Mongo-backed collection later if needed —
// getMentorsForTrack is the single seam callers depend on.
const MENTORS_BY_TRACK = {
  cloud: [
    { name: 'Sarah Jenkins', role: 'Lead Cloud Engineer @ AWS', expertise: 'EC2, IAM, and cost optimization for early-career support engineers.' },
    { name: 'Marcus Reed', role: 'DevOps Manager @ Rackspace', expertise: 'CI/CD pipelines and moving from helpdesk into infrastructure roles.' },
  ],
  cybersecurity: [
    { name: 'Aisha Bello', role: 'SOC Analyst Lead @ CrowdStrike', expertise: 'Incident response and breaking into blue-team roles.' },
    { name: 'David Chen', role: 'Security Engineer @ Okta', expertise: 'Identity, threat modeling, and your first security certification.' },
  ],
  data_engineering: [
    { name: 'Priya Nair', role: 'Senior Data Engineer @ Snowflake', expertise: 'SQL, pipelines, and moving from analyst to engineer.' },
    { name: 'Tom Alvarez', role: 'Analytics Engineering Lead @ dbt Labs', expertise: 'Data modeling, warehousing, and portfolio projects.' },
  ],
  software_engineering: [
    { name: 'Elena Rodriguez', role: 'Staff Engineer @ Stripe', expertise: 'Full-stack fundamentals and technical interview prep.' },
    { name: 'James Okoro', role: 'Frontend Lead @ Vercel', expertise: 'React, clean architecture, and shipping real projects.' },
  ],
  systems_support: [
    { name: 'Grace Lin', role: 'IT Operations Manager @ Cisco', expertise: 'Networking foundations and the helpdesk-to-sysadmin path.' },
    { name: 'Andre Foster', role: 'Senior Systems Administrator @ Dell', expertise: 'Troubleshooting, ticketing workflows, and certifications.' },
  ],
};

// Returns the mentor list for a track, or [] for an unknown track_id so callers
// can render an empty state without special-casing undefined.
function getMentorsForTrack(trackId) {
  return MENTORS_BY_TRACK[trackId] || [];
}

module.exports = { getMentorsForTrack };

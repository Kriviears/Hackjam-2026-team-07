// Fake data shaped like what the real backend will return. Lets the
// frontend build and test against realistic data before the real
// /api/roadmap endpoint is ready. Swap USE_MOCK in api.js to switch over.
//
// Shape note: each tier (junior/middle/senior) now holds a `courses` array
// instead of a flat `skills` array, since a tier can contain more than one
// course (matches CourseCard.jsx, which flatMaps skills across courses).
export const mockRoadmap = {
  userId: "guest_or_real_id",
  persona: "aspiring_candidate",
  track: {
    track_id: "cloud",
    title: "Cloud Support Associate",
    track_title: "Cloud Support Associate",
    match_reason: "You mentioned checking systems calmly under pressure, which points to infrastructure and support work.",
    soft_skills: ["Patience", "Problem-solving", "Attention to detail"],
    mentor_style_match: "A practical mentor with strong technical troubleshooting experience.",
    growth_areas: ["Time management under pressure", "Structured troubleshooting"]
  },
  mentors: [
    { name: "Sarah Jenkins", role: "Lead Cloud Engineer @ AWS", expertise: "EC2, IAM, and cost optimization for early-career support engineers." },
    { name: "Marcus Reed", role: "DevOps Manager @ Rackspace", expertise: "CI/CD pipelines and moving from helpdesk into infrastructure roles." }
  ],
  timeline: {
    junior: {
      status: "active",
      label: "Step 1: Junior Level Foundations",
      courses: [
        {
          course_id: "aws_restart",
          course_name: "AWS re/Start Training",
          type: "core_course",
          skills: [
            { name: "Linux CLI & Basic Bash Scripting", isMastered: true },
            { name: "Basic Networking (DNS, TCP/IP)", isMastered: true },
            { name: "Core AWS Services (EC2, S3, IAM)", isMastered: false },
            { name: "Helpdesk Ticket Management", isMastered: false }
          ],
          target_roles: ["Cloud Support Associate", "Junior Systems Administrator"]
        }
      ]
    },
    middle: {
      status: "locked",
      label: "Step 2: Mid-Level Upskilling (Alumni Program)",
      courses: [
        {
          course_id: "azure_devops",
          course_name: "Advanced Azure & DevOps Upskilling",
          type: "upskilling_course",
          skills: [
            { name: "Multi-Cloud (Microsoft Azure)", isMastered: false },
            { name: "Containers Basics (Docker)", isMastered: false },
            { name: "Infrastructure as Code (Terraform)", isMastered: false }
          ],
          target_roles: ["Azure Cloud Engineer", "Cloud Support Specialist"]
        }
      ]
    },
    senior: {
      status: "locked",
      label: "Step 3: Senior Level Specialization",
      courses: [
        {
          course_id: "enterprise_cloud",
          course_name: "Enterprise Cloud Architecture",
          type: "upskilling_course",
          skills: [
            { name: "Container Orchestration (Kubernetes)", isMastered: false },
            { name: "FinOps (Cost Optimization)", isMastered: false }
          ],
          target_roles: ["Senior Cloud Architect"]
        }
      ]
    }
  }
};

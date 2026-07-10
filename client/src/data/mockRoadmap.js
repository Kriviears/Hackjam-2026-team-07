// Fake data shaped exactly like wht the real backend api will returb 
//This Lets the fronted build and test again realistic data befpre the 
//Real /api/roadmap endpoint is ready Swap USE_MOCk in api.js to switch over 

export const mockRoadmap = {
    userId: "guest_or_real_id", // "guest " until they register or login, then a real Mongo _id 
    persona: "aspiring_candiate", //drives which UI states show (candidatre/learner/alumni)

    tracks: {
        trackId: "cloud",
            title: "Cloud Support Associate",
            match_reason: "You menttioned checking systems calmly under pressure, which points to infrastucture and support work.",
            avg_salary: "$55,000 -$65,000 / year "
        },


        // Career levels, in order. Only  "junior" is unlocked for brand-new  user
        //Middle/senior stay locked until they progress ( shown as grayed- out in the UI)

        timeline: {
            junior: {
                status: "active",
                course: "AWS re/Start Training Program",
                progress_percent: 46,
                //Each skill tracks whether tge user has already mastered it Powers the chackmark vs, circle icon in CourseCard
                skills: [
                    { name: "Linux CLI & basic bash Scripts", isMastered: true },
                    { name: "Basic Networking (DNS, TCP/IP)", isMastered: true },
                    {name: "Core AWS Services (EC2, S3, IAM)", isMastered: false },
                    {name: "Helpdesk Ticket Management", isMastered: false },
                ]

        },
        middle: {
            status: "locked",
            course: "Advanced Azure & DevOps Upskilling",
            skills: [
                {name: "Multi_Cloud (Microsoft Azure", isMastered: false },
                {name: "Containers basics (Docker)", isMastered: false },
                {name: " Infrastructure as Code (Terraform)", isMastered: false },
            ]
        },
        senior: {
            status: "locked",
            course: "Enterprise Cloud Architect ",
            skills: [
                {name: "Container Orchestration (Kubernetes)", isMastered: false },
                {name: "FinOps (Cost Optimixation)", isMastered: false },

            ]
    }
},

//Sample mentor (s) tied to this track - real version would query actual alumni

mentors: [
    {name: "Sampple Mentor", role: "Cloud Support Associate", track: "cloud"}
]
};
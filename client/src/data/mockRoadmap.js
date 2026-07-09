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
                progress_precent: 46,
                //Each skill tracks whether tge user has already mastered it Powers the chackmark vs, circle icon in CourseCard
                skills: [
                    { name: "Linux CLI & basic bash Scripts", isMAstered: true },
                    { name: "Basic Networking (DNS, TCP/IP)", isMAstered: true },
                    {name: "Core AWS Services (EC2, S3, IAM)", isMAstered: false },
                    {name: "Helpdesk Ticket Management", isMAstered: false },
                ]

        },
        middle: {
            status: "locked",
            course: "Advanced Azure & DevOps Upskilling",
            Skills: [
                {name: "Multi_Cloud (Microsoft Azure", isMAstered: false },
                {name: "Containers basics (Docker)", isMAstered: false },
                {name: " Infrastructure as Code (Terraform)", isMAstered: false },
            ]
        },
        senior: {
            status: "locked",
            course: "Enterprise Cloud Architect ",
            Skills: [
                {name: "Container Orchestration (Kubernetes)", isMAstered: false },
                {name: "FinOps (Cost Optimixation)", isMAstered: false },
            
            ]
    }
},

//Sample mentor (s) tied to this track - real version would query actual alumni

mentors: [
    {name: "Sampple Mentor", role: "Cloud Support Associate", track: "cloud"}
]
};
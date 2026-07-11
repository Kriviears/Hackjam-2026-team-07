require('dotenv').config();

const mongoose = require('mongoose');
const Track = require('../models/Track');

const course = (course_id, course_name, type, place, skills, target_roles) => ({
  course_id,
  course_name,
  type,
  place,
  skills,
  target_roles
});

const locations = [
  { location: 'Atlanta', date: '2026-09-18' },
  { location: 'New York City', date: '2026-09-28' },
  { location: 'remote', date: '2026-09-02' }
];

const remote = [{ location: 'remote', date: '2026-09-02' }];

const tracks = [
  {
    track_id: 'cloud',
    track_title: 'Cloud & DevOps Specialist',
    avg_salary: '$60,000 - $75,000 / year',
    timeline: {
      junior: {
        label: 'Step 1: Junior Level Foundations',
        courses: [
          course('aws_restart_training', 'AWS re/Start Training', 'core_course', locations,
            ['Linux CLI & Basic Bash Scripting', 'Networking Fundamentals (DNS, TCP/IP, Ports)', 'Core AWS Services (EC2, S3, IAM, VPC)', 'Helpdesk & Support Ticket Management'],
            ['Cloud Support Associate', 'Junior Systems Administrator'])
        ]
      },
      middle: {
        label: 'Step 2: Mid-Level Upskilling (Alumni Program)',
        courses: [
          course('azure_cloud_practitioner', 'Cloud Azure Cloud Practitioner', 'upskilling_course', remote,
            ['Multi-Cloud Administration (Microsoft Azure Core)', 'Containers Management & Basics (Docker)', 'Infrastructure as Code (Intro to Terraform)', 'Automation & Scripting (Python / Advanced Shell)'],
            ['Azure Cloud Engineer', 'Cloud Support Associate', 'Cloud Application Support Specialist'])
        ]
      },
      senior: {
        label: 'Step 3: Senior Expert Level (On-the-job Growth)',
        courses: [
          course('enterprise_cloud_architecture', 'Enterprise Cloud Architecture', 'upskilling_course', remote,
            ['Enterprise Container Orchestration (Kubernetes / EKS)', 'End-to-End CI/CD Automation Pipelines (GitHub Actions, GitLab)', 'Application Performance Monitoring & Alerting (Grafana, Prometheus)', 'FinOps & Cloud Cost Optimization Engineering'],
            ['Senior Cloud Architect', 'Senior DevOps Engineer', 'Infrastructure Operations Manager'])
        ]
      }
    }
  },
  {
    track_id: 'cybersecurity',
    track_title: 'Cybersecurity Specialist',
    avg_salary: '$70,000 - $85,000 / year',
    timeline: {
      junior: {
        label: 'Step 1: Junior Level Foundations',
        courses: [
          course('cybersecurity_analyst_training', 'Cybersecurity Analyst Training', 'core_course', locations,
            ['Network Security Basics', 'Log Analysis & Incident Response', 'Firewall & IDS/IPS Configuration', 'OWASP Top 10 Vulnerabilities'],
            ['Cybersecurity Analyst', 'IT Security Engineer', 'Network Security Analyst']),
          course('cybersecurity_ai_tools_training', 'Cybersecurity with AI Tools Training', 'core_course', locations,
            ['AI-Powered Threat Detection', 'Automated Log Auditing', 'Security Automation Scripts', 'Anomalous Behavior Identification'],
            ['Systems Administrator', 'IT Security Administrator', 'Cybersecurity Analyst'])
        ]
      },
      middle: {
        label: 'Step 2: Mid-Level Upskilling',
        courses: [
          course('advanced_pentesting', 'Advanced Ethical Hacking & Penetration Testing', 'upskilling_course', remote,
            ['Penetration Testing Frameworks', 'Vulnerability Assessment', 'Exploit Development Basics'],
            ['Penetration Tester', 'SecOps Engineer'])
        ]
      },
      senior: {
        label: 'Step 3: Senior Expert Level (Long-Term Trajectory)',
        courses: [
          course('enterprise_security_leadership', 'Enterprise Security Leadership & Risk Management', 'upskilling_course', remote,
            ['Enterprise Risk Management & Corporate CISO Strategy', 'Compliance & Regulations (GDPR, HIPAA, SOC2, ISO27001)', 'Incident Crisis Management & Disaster Recovery Leadership', 'Security Budgeting, Vendor Management & Tech Team Leadership'],
            ['Chief Information Security Officer (CISO)', 'Lead Security Architect', 'Director of IT Infrastructure'])
        ]
      }
    }
  },
  {
    track_id: 'data_engineering',
    track_title: 'AI Native Business Intelligence Training',
    avg_salary: '$55,000 - $70,000 / year',
    timeline: {
      junior: {
        label: 'Step 1: Junior Level Foundations',
        courses: [
          course('bi_fundamentals_analyst', 'Business Intelligence Foundations', 'core_course', locations,
            ['SQL Queries & Relational Databases (PostgreSQL / MySQL)', 'Data Visualization Tools (Tableau, Power BI)', 'Data Cleansing & Basic ETL/ELT Concepts', 'Business Metrics & KPI Dashboarding'],
            ['Data Analyst', 'Business Intelligence Associate'])
        ]
      },
      middle: {
        label: 'Step 2: Mid-Level Upskilling (Alumni Program)',
        courses: [
          course('ai_native_data_analytics', 'AI Native Analytics & Engineering', 'upskilling_course', remote,
            ['Advanced Python for Data Analysis (Pandas, NumPy)', 'AI-Powered BI Tools & LLM Data Agents', 'Data Warehousing Concepts (Snowflake / BigQuery)', 'Automated Reporting Pipelines & Scripting'],
            ['BI Developer', 'Junior Data Engineer', 'Data Analytics Specialist'])
        ]
      },
      senior: {
        label: 'Step 3: Senior Expert Level (On-the-job Growth)',
        courses: [
          course('enterprise_data_engineering', 'Enterprise Data Engineering & AI Infrastructure', 'upskilling_course', remote,
            ['Big Data Orchestration (Apache Airflow / Prefect)', 'Distributed Computing & Processing (Apache Spark / Databricks)', 'Vector Databases & RAG Pipelines for Enterprise BI', 'Data Governance, Security & Quality Monitoring'],
            ['Data Engineer', 'Senior BI Architect', 'Analytics Engineer Lead'])
        ]
      }
    }
  },
  {
    track_id: 'software_engineering',
    track_title: 'Software Engineering Training',
    avg_salary: '$65,000 - $85,000 / year',
    timeline: {
      junior: {
        label: 'Step 1: Junior Level Foundations',
        courses: [
          course('frontend_react_developer', 'React Developer Essentials', 'core_course', locations,
            ['Advanced JavaScript (ES6+) & TypeScript Basics', 'React Core Concepts (Hooks, Context API, Component Lifecycle)', 'State Management (Redux Toolkit / Zustand)', 'Responsive UI Development (Tailwind CSS, HTML5/CSS3)'],
            ['Junior Frontend Developer', 'React Developer'])
        ]
      },
      middle: {
        label: 'Step 2: Mid-Level Upskilling (Alumni Program)',
        courses: [
          course('fullstack_node_integration', 'Full Stack Developer Program', 'upskilling_course', remote,
            ['Backend Development (Node.js, Express.js / NestJS)', 'Database Design & Management (PostgreSQL, MongoDB, Prisma)', 'RESTful API Design & Authentication (JWT, OAuth2)', 'Unit & Integration Testing (Jest, React Testing Library)'],
            ['Full Stack Developer', 'Frontend Engineer', 'Backend Developer'])
        ]
      },
      senior: {
        label: 'Step 3: Senior Expert Level (On-the-job Growth)',
        courses: [
          course('enterprise_software_architecture', 'Advanced Software Engineering', 'upskilling_course', remote,
            ['System Design & Microservices Architecture', 'Performance Optimization & Caching Strategies (Redis)', 'CI/CD Workflows for Web Applications (Docker, GitHub Actions)', 'Software Design Patterns & Clean Architecture Principles'],
            ['Senior Software Engineer', 'Full Stack Tech Lead', 'Software Architect'])
        ]
      }
    }
  },
  {
    track_id: 'systems_support',
    track_title: 'Systems Support & Infrastructure Specialist',
    avg_salary: '$50,000 - $68,000 / year',
    timeline: {
      junior: {
        label: 'Step 1: Junior Level Foundations',
        courses: [
          course('it_support_training', 'IT Support Training', 'core_course', locations,
            ['Hardware & Software Troubleshooting', 'Operating Systems (Windows, macOS, Linux)', 'Customer Service & Communication', 'Basic Network Setup & Configuration'],
            ['IT Technician', 'System Administrator', 'Help Desk Analyst', 'Desktop Support Technician']),
          course('low_voltage_telecom_training', 'Low Voltage Telecom Training', 'core_course', locations,
            ['Structured Cabling & Wire Termination', 'AV Systems Setup & Calibration', 'Security & Alarm System Installation', 'Safety Standards & Telecommunication Codes'],
            ['Low Voltage Technicians', 'Audio Video Technicians', 'Alarm Technicians'])
        ]
      },
      middle: {
        label: 'Step 2: Mid-Level Upskilling (Alumni Program)',
        courses: [
          course('nextgen_it_support_ai_powered', 'NextGen IT Support (AI-Powered) Training', 'upskilling_course', remote,
            ['AI-Driven Ticket Categorization & Analysis', 'Automated Remote Management & Monitoring (RMM)', 'Smart Knowledge Base Management', 'AI Chatbot Triage Configuration'],
            ['IT Technician', 'System Administrator', 'Help Desk Analyst', 'Desktop Support Technician']),
          course('ai_enabled_healthcare_it_technician', 'AI-Enabled Healthcare IT Technician Training', 'upskilling_course', remote,
            ['HIPAA & Healthcare Data Privacy Standards', 'Electronic Health Records (EHR) Systems Support', 'AI Diagnostics Infrastructure Maintenance', 'Clinical Telemetry Network Troubleshooting'],
            ['Healthcare IT Support Specialists', 'Clinical Systems Support Technicians', 'Healthcare Help Desk Analysts']),
          course('ai_enabled_it_support_training', 'AI-Enabled IT Support Training', 'upskilling_course', remote,
            ['Prompt Engineering for IT Service Desks', 'Scripting with Copilot / AI Assistants', 'Incident Auto-Remediation Workflow Setup', 'Advanced Endpoint Security Automation'],
            ['IT Technician', 'System Administrator', 'Help Desk Analyst', 'Desktop Support Technician'])
        ]
      },
      senior: {
        label: 'Step 3: Senior Expert Level (On-the-job Growth)',
        courses: [
          course('data_center_technician_ai_tools', 'Data Center Technician with AI Tools Training', 'upskilling_course', remote,
            ['AI-Powered Power & Cooling Optimization (FinOps)', 'Server Hardware Architecture & SAS/SATA/NVMe', 'Disaster Recovery & Redundancy Planning', 'Network Switches & Enterprise Routers Configuration'],
            ['Network Technicians', 'Data Center Technicians', 'IT Infrastructure Managers']),
          course('salesforce_administrator_training', 'Salesforce Administrator Training', 'upskilling_course', remote,
            ['Salesforce Platform Configuration & Customization', 'CRM Workflow & Process Automation (Flow Builder)', 'User Management, Security, and Data Governance', 'Advanced Reporting, Dashboards, and Analytics'],
            ['Salesforce Platform Administrator', 'CRM Specialist', 'Salesforce Consultants', 'Salesforce Business Analyst'])
        ]
      }
    }
  }
];

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/perscholas';

const seedTracks = async () => {
  await mongoose.connect(mongoURI);

  const result = await Track.bulkWrite(tracks.map((track) => ({
    updateOne: {
      filter: { track_id: track.track_id },
      update: { $set: track },
      upsert: true
    }
  })));

  console.log(`Seeded ${tracks.length} tracks (${result.upsertedCount} created, ${result.modifiedCount} updated).`);
};

seedTracks()
  .catch((error) => {
    console.error('Track seed failed:', error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());

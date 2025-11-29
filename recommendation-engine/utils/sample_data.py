"""
Sample data for testing the recommendation engine
"""

from models.schemas import Opportunity

SAMPLE_JOBS = [
    Opportunity(
        id="job_001",
        title="Software Engineering Intern",
        description="Join our engineering team to build scalable web applications. You'll work with React, Node.js, and cloud technologies.",
        type="internship",
        location="Bangalore",
        status="active",
        salary="₹25,000/month",
        requirements=[
            "Currently pursuing B.Tech/B.E. in Computer Science or related field",
            "Strong problem-solving skills",
            "Good communication skills",
            "Batch: 2026, 2027"
        ],
        eligibleDepartments=["Computer Science", "Information Technology", "Electronics"],
        skillsRequired=["Python", "JavaScript", "React", "Node.js", "SQL"],
        additionalInfo="6-month internship with possibility of PPO"
    ),
    Opportunity(
        id="job_002",
        title="Data Science Intern",
        description="Work on machine learning projects and data analysis. Help build predictive models for business insights.",
        type="internship",
        location="Mumbai",
        status="active",
        salary="₹30,000/month",
        requirements=[
            "Knowledge of statistics and probability",
            "Experience with data visualization",
            "Pursuing degree in relevant field",
            "Batch: 2026, 2027"
        ],
        eligibleDepartments=["Computer Science", "Mathematics", "Statistics", "Data Science"],
        skillsRequired=["Python", "Machine Learning", "Pandas", "NumPy", "SQL", "TensorFlow"],
        additionalInfo="Remote work available"
    ),
    Opportunity(
        id="job_003",
        title="Full Stack Developer",
        description="Build and maintain web applications using modern technologies. Work in an agile environment.",
        type="full-time",
        location="Delhi",
        status="active",
        salary="₹8-12 LPA",
        requirements=[
            "B.Tech/B.E. in Computer Science or equivalent",
            "1+ years of experience (internships count)",
            "Strong understanding of web technologies",
            "Batch: 2024, 2025"
        ],
        eligibleDepartments=["Computer Science", "Information Technology"],
        skillsRequired=["JavaScript", "TypeScript", "React", "Node.js", "MongoDB", "AWS"],
        additionalInfo="Health insurance and stock options included"
    ),
    Opportunity(
        id="job_004",
        title="Machine Learning Engineer",
        description="Design and implement ML models for production systems. Work with large-scale data pipelines.",
        type="full-time",
        location="Hyderabad",
        status="active",
        salary="₹15-25 LPA",
        requirements=[
            "M.Tech or B.Tech with ML experience",
            "Published research is a plus",
            "Experience with production ML systems",
            "Batch: 2024, 2025"
        ],
        eligibleDepartments=["Computer Science", "Artificial Intelligence", "Data Science"],
        skillsRequired=["Python", "TensorFlow", "PyTorch", "Deep Learning", "MLOps", "Docker"],
        additionalInfo="Work on cutting-edge AI projects"
    ),
    Opportunity(
        id="job_005",
        title="UI/UX Design Intern",
        description="Create beautiful and intuitive user interfaces. Work closely with product and engineering teams.",
        type="internship",
        location="Pune",
        status="active",
        salary="₹20,000/month",
        requirements=[
            "Portfolio of design work",
            "Understanding of design principles",
            "Pursuing design or related degree",
            "Batch: 2026, 2027, 2028"
        ],
        eligibleDepartments=["Design", "Computer Science", "Human-Computer Interaction"],
        skillsRequired=["Figma", "Adobe XD", "UI Design", "UX Research", "Prototyping"],
        additionalInfo="Mentorship from senior designers"
    ),
    Opportunity(
        id="job_006",
        title="Backend Developer Intern",
        description="Build robust APIs and backend services. Work with microservices architecture.",
        type="internship",
        location="Chennai",
        status="active",
        salary="₹22,000/month",
        requirements=[
            "Understanding of REST APIs",
            "Basic knowledge of databases",
            "Currently pursuing engineering degree",
            "Batch: 2026, 2027"
        ],
        eligibleDepartments=["Computer Science", "Information Technology", "Electronics"],
        skillsRequired=["Java", "Spring Boot", "PostgreSQL", "Redis", "Docker"],
        additionalInfo="Learn from industry experts"
    ),
    Opportunity(
        id="job_007",
        title="DevOps Engineer",
        description="Manage cloud infrastructure and CI/CD pipelines. Ensure high availability of services.",
        type="full-time",
        location="Bangalore",
        status="active",
        salary="₹12-18 LPA",
        requirements=[
            "Experience with cloud platforms",
            "Knowledge of containerization",
            "B.Tech in CS/IT or equivalent",
            "Batch: 2024, 2025"
        ],
        eligibleDepartments=["Computer Science", "Information Technology"],
        skillsRequired=["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform", "Linux"],
        additionalInfo="Work with cutting-edge cloud technologies"
    ),
    Opportunity(
        id="job_008",
        title="Mobile App Developer Intern",
        description="Develop cross-platform mobile applications using Flutter or React Native.",
        type="internship",
        location="Gurgaon",
        status="active",
        salary="₹25,000/month",
        requirements=[
            "Experience with mobile development",
            "Published apps is a plus",
            "Currently pursuing B.Tech/BCA",
            "Batch: 2026, 2027"
        ],
        eligibleDepartments=["Computer Science", "Information Technology", "MCA"],
        skillsRequired=["Flutter", "Dart", "React Native", "JavaScript", "Firebase"],
        additionalInfo="Build apps used by millions"
    ),
    Opportunity(
        id="job_009",
        title="Cybersecurity Analyst Intern",
        description="Help protect systems from security threats. Conduct vulnerability assessments and security audits.",
        type="internship",
        location="Noida",
        status="active",
        salary="₹28,000/month",
        requirements=[
            "Knowledge of network security",
            "Understanding of common vulnerabilities",
            "Pursuing degree in CS/IT/Security",
            "Batch: 2026, 2027"
        ],
        eligibleDepartments=["Computer Science", "Information Technology", "Cybersecurity"],
        skillsRequired=["Network Security", "Penetration Testing", "Linux", "Python", "SIEM"],
        additionalInfo="Security certifications provided"
    ),
    Opportunity(
        id="job_010",
        title="Product Manager",
        description="Drive product strategy and roadmap. Work with cross-functional teams to deliver value.",
        type="full-time",
        location="Bangalore",
        status="active",
        salary="₹18-28 LPA",
        requirements=[
            "MBA or equivalent experience",
            "2+ years in product roles",
            "Technical background preferred",
            "Batch: 2023, 2024"
        ],
        eligibleDepartments=["Management", "Computer Science", "Business Administration"],
        skillsRequired=["Product Management", "Agile", "Data Analysis", "SQL", "Communication"],
        additionalInfo="Lead high-impact products"
    ),
    Opportunity(
        id="job_011",
        title="Closed Position - Data Analyst",
        description="This position has been filled.",
        type="full-time",
        location="Mumbai",
        status="closed",
        salary="₹10 LPA",
        requirements=[
            "B.Tech required",
            "Batch: 2024, 2025"
        ],
        eligibleDepartments=["Computer Science", "Statistics"],
        skillsRequired=["Python", "SQL", "Tableau"],
        additionalInfo="Position closed"
    ),
    Opportunity(
        id="job_012",
        title="AI Research Intern",
        description="Conduct research in natural language processing and computer vision. Publish papers at top conferences.",
        type="internship",
        location="Bangalore",
        status="active",
        salary="₹35,000/month",
        requirements=[
            "Strong mathematical background",
            "Experience with deep learning frameworks",
            "Research experience preferred",
            "Batch: 2026, 2027"
        ],
        eligibleDepartments=["Computer Science", "Artificial Intelligence", "Mathematics"],
        skillsRequired=["Python", "PyTorch", "NLP", "Computer Vision", "Deep Learning", "Research"],
        additionalInfo="Work with published researchers"
    ),
    Opportunity(
        id="job_013",
        title="Cloud Solutions Architect",
        description="Design and implement cloud-native solutions for enterprise clients. Lead migration projects to AWS/Azure.",
        type="full-time",
        location="Bangalore",
        status="active",
        salary="₹20-35 LPA",
        requirements=[
            "5+ years of cloud experience",
            "AWS/Azure certifications preferred",
            "Experience with enterprise architecture",
            "Batch: 2020, 2021, 2022"
        ],
        eligibleDepartments=["Computer Science", "Information Technology"],
        skillsRequired=["AWS", "Azure", "Terraform", "Kubernetes", "Microservices", "System Design"],
        additionalInfo="Lead architect role with client-facing responsibilities"
    ),
    Opportunity(
        id="job_014",
        title="Blockchain Developer Intern",
        description="Build decentralized applications and smart contracts. Work on Web3 projects.",
        type="internship",
        location="Mumbai",
        status="active",
        salary="₹30,000/month",
        requirements=[
            "Understanding of blockchain fundamentals",
            "Knowledge of cryptography basics",
            "Currently pursuing engineering degree",
            "Batch: 2026, 2027"
        ],
        eligibleDepartments=["Computer Science", "Information Technology", "Mathematics"],
        skillsRequired=["Solidity", "Ethereum", "Web3.js", "JavaScript", "Smart Contracts"],
        additionalInfo="Work on cutting-edge Web3 projects"
    ),
    Opportunity(
        id="job_015",
        title="QA Automation Engineer",
        description="Design and implement automated testing frameworks. Ensure quality across all product releases.",
        type="full-time",
        location="Pune",
        status="active",
        salary="₹8-14 LPA",
        requirements=[
            "Experience with test automation tools",
            "Understanding of CI/CD pipelines",
            "B.Tech in CS/IT",
            "Batch: 2024, 2025"
        ],
        eligibleDepartments=["Computer Science", "Information Technology"],
        skillsRequired=["Selenium", "Python", "Java", "Jenkins", "TestNG", "API Testing"],
        additionalInfo="Build robust testing infrastructure"
    ),
    Opportunity(
        id="job_016",
        title="Technical Content Writer Intern",
        description="Create technical documentation, tutorials, and blog posts for developer audience.",
        type="internship",
        location="Remote",
        status="active",
        salary="₹18,000/month",
        requirements=[
            "Strong written communication skills",
            "Basic programming knowledge",
            "Portfolio of writing samples",
            "Batch: 2026, 2027, 2028"
        ],
        eligibleDepartments=["Computer Science", "English", "Journalism", "Information Technology"],
        skillsRequired=["Technical Writing", "Documentation", "Markdown", "Git", "API Documentation"],
        additionalInfo="Fully remote position with flexible hours"
    ),
    Opportunity(
        id="job_017",
        title="Game Developer",
        description="Create engaging mobile and PC games. Work with Unity and Unreal Engine.",
        type="full-time",
        location="Hyderabad",
        status="active",
        salary="₹10-18 LPA",
        requirements=[
            "Experience with game engines",
            "Published games is a plus",
            "Strong 3D math skills",
            "Batch: 2024, 2025"
        ],
        eligibleDepartments=["Computer Science", "Game Design", "Animation"],
        skillsRequired=["Unity", "C#", "Unreal Engine", "C++", "3D Modeling", "Game Physics"],
        additionalInfo="Work on AAA mobile game titles"
    ),
    Opportunity(
        id="job_018",
        title="Data Engineer",
        description="Build and maintain data pipelines. Design data warehouses and ETL processes.",
        type="full-time",
        location="Bangalore",
        status="active",
        salary="₹12-20 LPA",
        requirements=[
            "Experience with big data technologies",
            "Strong SQL skills",
            "B.Tech/M.Tech in relevant field",
            "Batch: 2024, 2025"
        ],
        eligibleDepartments=["Computer Science", "Data Science", "Information Technology"],
        skillsRequired=["Python", "Apache Spark", "Airflow", "SQL", "AWS", "Kafka"],
        additionalInfo="Work with petabyte-scale data"
    ),
    Opportunity(
        id="job_019",
        title="Embedded Systems Intern",
        description="Work on IoT devices and embedded systems. Program microcontrollers and sensors.",
        type="internship",
        location="Chennai",
        status="active",
        salary="₹20,000/month",
        requirements=[
            "Knowledge of microcontrollers",
            "Basic electronics understanding",
            "Pursuing ECE/EE/CS degree",
            "Batch: 2026, 2027"
        ],
        eligibleDepartments=["Electronics", "Electrical Engineering", "Computer Science"],
        skillsRequired=["C", "C++", "Arduino", "Raspberry Pi", "RTOS", "IoT"],
        additionalInfo="Work on smart home products"
    ),
    Opportunity(
        id="job_020",
        title="Site Reliability Engineer",
        description="Ensure 99.99% uptime for production systems. Implement monitoring and alerting.",
        type="full-time",
        location="Gurgaon",
        status="active",
        salary="₹15-25 LPA",
        requirements=[
            "Experience with monitoring tools",
            "Strong Linux administration skills",
            "On-call rotation experience",
            "Batch: 2023, 2024, 2025"
        ],
        eligibleDepartments=["Computer Science", "Information Technology"],
        skillsRequired=["Linux", "Prometheus", "Grafana", "Kubernetes", "Python", "Ansible"],
        additionalInfo="Join our world-class SRE team"
    ),
    Opportunity(
        id="job_021",
        title="Natural Language Processing Engineer",
        description="Build NLP models for chatbots and text analysis. Work on language understanding systems.",
        type="full-time",
        location="Bangalore",
        status="active",
        salary="₹18-30 LPA",
        requirements=[
            "Strong NLP background",
            "Experience with transformer models",
            "M.Tech/PhD preferred",
            "Batch: 2023, 2024, 2025"
        ],
        eligibleDepartments=["Computer Science", "Artificial Intelligence", "Linguistics"],
        skillsRequired=["Python", "NLP", "Transformers", "BERT", "GPT", "Hugging Face"],
        additionalInfo="Build next-gen conversational AI"
    ),
    Opportunity(
        id="job_022",
        title="Business Analyst Intern",
        description="Analyze business requirements and translate them into technical specifications.",
        type="internship",
        location="Delhi",
        status="active",
        salary="₹22,000/month",
        requirements=[
            "Strong analytical skills",
            "Good communication abilities",
            "Pursuing MBA/BBA/Engineering",
            "Batch: 2026, 2027"
        ],
        eligibleDepartments=["Management", "Computer Science", "Business Administration", "Economics"],
        skillsRequired=["Excel", "SQL", "Data Analysis", "PowerBI", "Communication", "Documentation"],
        additionalInfo="Bridge between business and technology teams"
    ),
    Opportunity(
        id="job_023",
        title="Computer Vision Engineer",
        description="Develop image and video processing algorithms. Build object detection and recognition systems.",
        type="full-time",
        location="Hyderabad",
        status="active",
        salary="₹16-28 LPA",
        requirements=[
            "Experience with CV frameworks",
            "Strong mathematical foundation",
            "Publications are a plus",
            "Batch: 2024, 2025"
        ],
        eligibleDepartments=["Computer Science", "Artificial Intelligence", "Electronics"],
        skillsRequired=["Python", "OpenCV", "TensorFlow", "YOLO", "Image Processing", "Deep Learning"],
        additionalInfo="Work on autonomous systems"
    ),
    Opportunity(
        id="job_024",
        title="React Native Developer Intern",
        description="Build beautiful cross-platform mobile apps using React Native and Expo.",
        type="internship",
        location="Pune",
        status="active",
        salary="₹25,000/month",
        requirements=[
            "Experience with React",
            "Basic mobile development knowledge",
            "Currently pursuing degree",
            "Batch: 2026, 2027"
        ],
        eligibleDepartments=["Computer Science", "Information Technology"],
        skillsRequired=["React Native", "JavaScript", "TypeScript", "Redux", "Expo", "REST APIs"],
        additionalInfo="Build apps with millions of users"
    ),
    Opportunity(
        id="job_025",
        title="Database Administrator",
        description="Manage and optimize database systems. Ensure data integrity and high availability.",
        type="full-time",
        location="Mumbai",
        status="active",
        salary="₹10-16 LPA",
        requirements=[
            "Experience with database management",
            "Knowledge of backup and recovery",
            "Performance tuning experience",
            "Batch: 2024, 2025"
        ],
        eligibleDepartments=["Computer Science", "Information Technology"],
        skillsRequired=["MySQL", "PostgreSQL", "MongoDB", "Redis", "Database Optimization", "SQL"],
        additionalInfo="Manage mission-critical databases"
    ),
    Opportunity(
        id="job_026",
        title="AR/VR Developer Intern",
        description="Create immersive augmented and virtual reality experiences for education and entertainment.",
        type="internship",
        location="Bangalore",
        status="active",
        salary="₹28,000/month",
        requirements=[
            "Experience with 3D development",
            "Understanding of AR/VR concepts",
            "Portfolio of projects",
            "Batch: 2026, 2027"
        ],
        eligibleDepartments=["Computer Science", "Design", "Game Design"],
        skillsRequired=["Unity", "C#", "ARKit", "ARCore", "Oculus SDK", "3D Modeling"],
        additionalInfo="Build the metaverse experiences"
    ),
    Opportunity(
        id="job_027",
        title="Security Engineer",
        description="Design and implement security solutions. Conduct security assessments and penetration testing.",
        type="full-time",
        location="Noida",
        status="active",
        salary="₹14-24 LPA",
        requirements=[
            "Security certifications (CEH, OSCP)",
            "Experience with security tools",
            "Strong networking knowledge",
            "Batch: 2023, 2024, 2025"
        ],
        eligibleDepartments=["Computer Science", "Information Technology", "Cybersecurity"],
        skillsRequired=["Penetration Testing", "Network Security", "SIEM", "Python", "Forensics", "Compliance"],
        additionalInfo="Protect critical infrastructure"
    ),
    Opportunity(
        id="job_028",
        title="iOS Developer",
        description="Build native iOS applications using Swift and SwiftUI. Create smooth user experiences.",
        type="full-time",
        location="Bangalore",
        status="active",
        salary="₹12-22 LPA",
        requirements=[
            "Experience with iOS development",
            "Published App Store apps",
            "Understanding of Apple guidelines",
            "Batch: 2024, 2025"
        ],
        eligibleDepartments=["Computer Science", "Information Technology"],
        skillsRequired=["Swift", "SwiftUI", "iOS SDK", "Xcode", "CoreData", "REST APIs"],
        additionalInfo="Build apps for Apple ecosystem"
    ),
    Opportunity(
        id="job_029",
        title="Robotics Engineer Intern",
        description="Work on robotic systems and automation. Program robot navigation and manipulation.",
        type="internship",
        location="Chennai",
        status="active",
        salary="₹25,000/month",
        requirements=[
            "Knowledge of robotics fundamentals",
            "Experience with ROS",
            "Pursuing relevant engineering degree",
            "Batch: 2026, 2027"
        ],
        eligibleDepartments=["Mechanical Engineering", "Electronics", "Computer Science", "Robotics"],
        skillsRequired=["ROS", "Python", "C++", "Computer Vision", "Motion Planning", "Sensors"],
        additionalInfo="Work on industrial automation"
    ),
    Opportunity(
        id="job_030",
        title="Platform Engineer",
        description="Build internal developer platforms and tools. Improve developer productivity and experience.",
        type="full-time",
        location="Bangalore",
        status="active",
        salary="₹16-26 LPA",
        requirements=[
            "Experience with platform engineering",
            "Strong DevOps background",
            "Understanding of developer workflows",
            "Batch: 2023, 2024, 2025"
        ],
        eligibleDepartments=["Computer Science", "Information Technology"],
        skillsRequired=["Kubernetes", "Go", "Terraform", "AWS", "CI/CD", "Platform Engineering"],
        additionalInfo="Build tools used by 500+ engineers"
    ),
    Opportunity(
        id="job_031",
        title="Bioinformatics Analyst Intern",
        description="Analyze genomic data and develop computational biology tools. Work on drug discovery projects.",
        type="internship",
        location="Hyderabad",
        status="active",
        salary="₹30,000/month",
        requirements=[
            "Background in biology and programming",
            "Knowledge of bioinformatics tools",
            "Pursuing relevant degree",
            "Batch: 2026, 2027"
        ],
        eligibleDepartments=["Bioinformatics", "Computer Science", "Biotechnology", "Life Sciences"],
        skillsRequired=["Python", "R", "Bioinformatics", "Machine Learning", "Genomics", "Statistics"],
        additionalInfo="Contribute to healthcare innovation"
    ),
    Opportunity(
        id="job_032",
        title="Technical Program Manager",
        description="Drive complex technical programs across multiple teams. Ensure on-time delivery of key initiatives.",
        type="full-time",
        location="Gurgaon",
        status="active",
        salary="₹22-35 LPA",
        requirements=[
            "Experience managing technical programs",
            "Strong organizational skills",
            "Technical background required",
            "Batch: 2022, 2023, 2024"
        ],
        eligibleDepartments=["Computer Science", "Management", "Information Technology"],
        skillsRequired=["Program Management", "Agile", "Scrum", "JIRA", "Communication", "Technical Architecture"],
        additionalInfo="Lead strategic company initiatives"
    )
]


def get_sample_jobs():
    """Return sample jobs for testing."""
    return SAMPLE_JOBS

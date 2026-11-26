import { PortfolioData } from '../types/portfolio';

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  profile: {
    name: 'MD. Asraful Islam Adib',
    title: 'AI Developer & Web Designer',
    portraitUrl: '/assets/aistudio/Professional_Young_Man_Headshot_dfdf701d.png',
    bioPrimary:
      "I'm MD. Asraful Islam Adib, an AI Developer and Web Designer passionate about building modern digital products, intelligent AI-powered solutions, and visually engaging websites.",
    bioSecondary: 'I enjoy transforming ideas into practical digital experiences.',
    highlights: [
      {
        id: 'hl-ai-arch',
        title: 'AI-First Product Architecture',
        detail:
          'Integrating generative AI, structured prompt systems, and automated workflows into usable digital products.',
      },
      {
        id: 'hl-web-eng',
        title: 'Modern Web Engineering',
        detail:
          'Building responsive, high-contrast web interfaces with React, TypeScript, and interactive 3D experiences.',
      },
      {
        id: 'hl-creative',
        title: 'Creative Digital Design',
        detail:
          'Combining UI/UX discipline, editorial typography, and AI-assisted visual production for cohesive brand identity.',
      },
    ],
    aboutDetails: [],
  },
  stats: [
    {
      id: 'stat-featured',
      label: 'Featured Concepts',
      value: '04',
      note: 'Editable in Studio',
    },
    {
      id: 'stat-experience',
      label: 'Years Experience',
      value: 'Edit',
      note: 'Set your real number',
    },
    {
      id: 'stat-projects',
      label: 'Shipped Projects',
      value: 'Edit',
      note: 'Set your real count',
    },
    {
      id: 'stat-clients',
      label: 'Collaborations',
      value: 'Edit',
      note: 'Set your real count',
    },
  ],
  skills: [
    // AI & Automation
    {
      id: 'skill-ai-tools',
      name: 'AI Tools',
      category: 'AI & Automation',
      levelLabel: 'Editable',
      levelUnits: 0,
      iconKey: 'cpu',
    },
    {
      id: 'skill-gemini-ai',
      name: 'Gemini AI',
      category: 'AI & Automation',
      levelLabel: 'Editable',
      levelUnits: 0,
      iconKey: 'bot',
    },
    {
      id: 'skill-ai-content',
      name: 'AI Content Creation',
      category: 'AI & Automation',
      levelLabel: 'Editable',
      levelUnits: 0,
      iconKey: 'wand',
    },
    {
      id: 'skill-ai-workflow',
      name: 'AI Workflow Automation',
      category: 'AI & Automation',
      levelLabel: 'Editable',
      levelUnits: 0,
      iconKey: 'workflow',
    },
    {
      id: 'skill-prompt-eng',
      name: 'Prompt Engineering',
      category: 'AI & Automation',
      levelLabel: 'Editable',
      levelUnits: 0,
      iconKey: 'terminal',
    },

    // Web Development
    {
      id: 'skill-html',
      name: 'HTML',
      category: 'Web Development',
      levelLabel: 'Editable',
      levelUnits: 0,
      iconKey: 'code',
    },
    {
      id: 'skill-css',
      name: 'CSS',
      category: 'Web Development',
      levelLabel: 'Editable',
      levelUnits: 0,
      iconKey: 'layers',
    },
    {
      id: 'skill-js',
      name: 'JavaScript',
      category: 'Web Development',
      levelLabel: 'Editable',
      levelUnits: 0,
      iconKey: 'braces',
    },
    {
      id: 'skill-react',
      name: 'React',
      category: 'Web Development',
      levelLabel: 'Editable',
      levelUnits: 0,
      iconKey: 'atom',
    },
    {
      id: 'skill-ts',
      name: 'TypeScript',
      category: 'Web Development',
      levelLabel: 'Editable',
      levelUnits: 0,
      iconKey: 'shield',
    },
    {
      id: 'skill-rwd',
      name: 'Responsive Web Design',
      category: 'Web Development',
      levelLabel: 'Editable',
      levelUnits: 0,
      iconKey: 'monitor',
    },

    // Creative Design
    {
      id: 'skill-graphic',
      name: 'Graphic Design',
      category: 'Creative Design',
      levelLabel: 'Editable',
      levelUnits: 0,
      iconKey: 'pen',
    },
    {
      id: 'skill-ai-img',
      name: 'AI Image Generation',
      category: 'Creative Design',
      levelLabel: 'Editable',
      levelUnits: 0,
      iconKey: 'image',
    },
    {
      id: 'skill-video',
      name: 'Video Content Creation',
      category: 'Creative Design',
      levelLabel: 'Editable',
      levelUnits: 0,
      iconKey: 'film',
    },
    {
      id: 'skill-uiux',
      name: 'UI/UX Design',
      category: 'Creative Design',
      levelLabel: 'Editable',
      levelUnits: 0,
      iconKey: 'compass',
    },
  ],
  services: [
    {
      id: 'service-ai-web',
      title: 'AI-Powered Website Development',
      description:
        'Full-stack React and TypeScript websites integrated with intelligent conversational workflows, smart generation tools, and responsive UI.',
      iconKey: 'globe',
    },
    {
      id: 'service-portfolio',
      title: 'Modern Portfolio Website Design',
      description:
        'Custom interactive portfolios engineered with refined typography, spatial motion, and memorable visual storytelling.',
      iconKey: 'layout',
    },
    {
      id: 'service-automation',
      title: 'AI Automation Solutions',
      description:
        'Streamlined AI pipelines and structured prompt systems designed to eliminate repetitive manual work and accelerate output.',
      iconKey: 'workflow',
    },
    {
      id: 'service-content',
      title: 'AI Image & Content Creation',
      description:
        'Cohesive visual assets, art-directed AI imagery, and tailored digital media crafted for modern brands and editorial platforms.',
      iconKey: 'image',
    },
    {
      id: 'service-creative',
      title: 'Creative Digital Design',
      description:
        'High-craft UI/UX design systems, brand identity direction, and graphic compositions built for clarity and distinction.',
      iconKey: 'palette',
    },
    {
      id: 'service-business',
      title: 'AI-Powered Business Solutions',
      description:
        'Practical AI tools, customer-facing web experiences, and digital operational workflows tailored to real business needs.',
      iconKey: 'briefcase',
    },
  ],
  projects: [
    {
      id: 'project-mememind-ai',
      title: 'MemeMind AI',
      category: 'AI Web Application',
      description:
        'An AI-powered creative platform for generating captions and creating memes.',
      imageUrl: '/src/assets/images/project_mememind_ai_1795672645464.jpg',
      liveUrl: '',
      repoUrl: '',
      highlights: ['AI Captioning', 'Creative Studio', 'Modern Web UI'],
    },
    {
      id: 'project-carebridge',
      title: 'CareBridge',
      category: 'Healthcare Web Application',
      description:
        'A healthcare consultation platform concept featuring AI-assisted health conversations and doctor information.',
      imageUrl: '/src/assets/images/project_carebridge_health_1795672645729.jpg',
      liveUrl: '',
      repoUrl: '',
      highlights: ['AI Consultation Flow', 'Doctor Directory', 'Accessible UX'],
    },
    {
      id: 'project-fashal-bondhu',
      title: 'Fashal Bondhu',
      category: 'Agriculture Web Platform',
      description: 'An agriculture-focused digital platform concept.',
      imageUrl: '/src/assets/images/project_fashal_bondhu_1795672646345.jpg',
      liveUrl: '',
      repoUrl: '',
      highlights: ['AgriTech Concept', 'Responsive Web', 'Farmer-First Design'],
    },
    {
      id: 'project-antimatter',
      title: 'Antimatter',
      category: 'E-commerce & Brand Website',
      description: 'A modern streetwear brand and e-commerce website concept.',
      imageUrl: '/src/assets/images/project_antimatter_brand_1795672646668.jpg',
      liveUrl: '',
      repoUrl: '',
      highlights: ['Brand Identity', 'E-commerce UI', 'Editorial Showcase'],
    },
  ],
  experience: [
    {
      id: 'exp-hello-dbox',
      company: 'Hello Dbox',
      role: 'AI Image Creation & Sports News Updates',
      period: 'September 2026 - Present',
      summary:
        'Producing AI-generated visual assets and managing timely, high-clarity sports news updates for digital publishing.',
    },
    {
      id: 'exp-squarefit',
      company: 'Squarefit',
      role: 'Office Management, Invoice Handling & Accounts Support',
      period: 'June 2024 - November 2024',
      summary:
        'Handled day-to-day office coordination, structured invoice processing, and operational accounts support.',
    },
  ],
  contact: {
    email: '',
    whatsapp: '',
    facebook: '',
    linkedin: '',
    github: '',
    webhookUrl: '',
    location: 'Available for remote collaborations worldwide',
  },
};

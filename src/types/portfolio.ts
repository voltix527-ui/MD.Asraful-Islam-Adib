export type SkillCategory = 'AI & Automation' | 'Web Development' | 'Creative Design';

export interface StatItem {
  id: string;
  label: string;
  value: string;
  note: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  levelLabel: string;
  levelUnits: number; // 0 = unset/editable, 1..5 qualitative segments
  iconKey: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconKey: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  liveUrl: string;
  repoUrl: string;
  highlights: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  summary: string;
}

export interface ContactInfo {
  email: string;
  whatsapp: string;
  facebook: string;
  linkedin: string;
  github: string;
  webhookUrl: string;
  location: string;
}

export interface AboutDetailItem {
  id: string;
  label: string;
  value: string;
}

export interface AboutHighlightItem {
  id: string;
  title: string;
  detail: string;
}

export interface ProfileInfo {
  name: string;
  title: string;
  portraitUrl: string;
  bioPrimary: string;
  bioSecondary: string;
  highlights: AboutHighlightItem[];
  aboutDetails: AboutDetailItem[];
}

export interface PortfolioData {
  profile: ProfileInfo;
  stats: StatItem[];
  skills: SkillItem[];
  services: ServiceItem[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  contact: ContactInfo;
}

import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_PORTFOLIO_DATA } from '../data/defaultPortfolio';
import {
  ContactInfo,
  ExperienceItem,
  PortfolioData,
  ProfileInfo,
  ProjectItem,
  SkillItem,
  StatItem,
} from '../types/portfolio';

const STORAGE_KEY = 'adib_portfolio_studio_v1';

function loadInitialData(): PortfolioData {
  if (typeof window === 'undefined') return DEFAULT_PORTFOLIO_DATA;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PORTFOLIO_DATA;
    const parsed = JSON.parse(raw) as Partial<PortfolioData>;
    const rawPortrait = parsed.profile?.portraitUrl;
    const migratedPortrait =
      !rawPortrait ||
      rawPortrait === '/src/assets/images/adib_studio_portrait_1795672645087.jpg'
        ? DEFAULT_PORTFOLIO_DATA.profile.portraitUrl
        : rawPortrait;

    return {
      profile: {
        ...DEFAULT_PORTFOLIO_DATA.profile,
        ...(parsed.profile || {}),
        portraitUrl: migratedPortrait,
        highlights:
          Array.isArray(parsed.profile?.highlights) && parsed.profile.highlights.length > 0
            ? parsed.profile.highlights
            : DEFAULT_PORTFOLIO_DATA.profile.highlights,
        aboutDetails: Array.isArray(parsed.profile?.aboutDetails)
          ? parsed.profile.aboutDetails
          : DEFAULT_PORTFOLIO_DATA.profile.aboutDetails,
      },
      stats: Array.isArray(parsed.stats) && parsed.stats.length > 0 ? parsed.stats : DEFAULT_PORTFOLIO_DATA.stats,
      skills: Array.isArray(parsed.skills) && parsed.skills.length > 0 ? parsed.skills : DEFAULT_PORTFOLIO_DATA.skills,
      services:
        Array.isArray(parsed.services) && parsed.services.length > 0
          ? parsed.services
          : DEFAULT_PORTFOLIO_DATA.services,
      projects:
        Array.isArray(parsed.projects) && parsed.projects.length > 0
          ? parsed.projects
          : DEFAULT_PORTFOLIO_DATA.projects,
      experience:
        Array.isArray(parsed.experience) && parsed.experience.length > 0
          ? parsed.experience
          : DEFAULT_PORTFOLIO_DATA.experience,
      contact: { ...DEFAULT_PORTFOLIO_DATA.contact, ...(parsed.contact || {}) },
    };
  } catch {
    return DEFAULT_PORTFOLIO_DATA;
  }
}

export function usePortfolioStore() {
  const [data, setData] = useState<PortfolioData>(loadInitialData);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [data]);

  const updateProfile = useCallback((profile: ProfileInfo) => {
    setData((prev) => ({ ...prev, profile }));
  }, []);

  const updateStats = useCallback((stats: StatItem[]) => {
    setData((prev) => ({ ...prev, stats }));
  }, []);

  const updateSkills = useCallback((skills: SkillItem[]) => {
    setData((prev) => ({ ...prev, skills }));
  }, []);

  const updateProjects = useCallback((projects: ProjectItem[]) => {
    setData((prev) => ({ ...prev, projects }));
  }, []);

  const updateExperience = useCallback((experience: ExperienceItem[]) => {
    setData((prev) => ({ ...prev, experience }));
  }, []);

  const updateContact = useCallback((contact: ContactInfo) => {
    setData((prev) => ({ ...prev, contact }));
  }, []);

  const resetDefaults = useCallback(() => {
    setData(DEFAULT_PORTFOLIO_DATA);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return {
    data,
    updateProfile,
    updateStats,
    updateSkills,
    updateProjects,
    updateExperience,
    updateContact,
    resetDefaults,
  };
}

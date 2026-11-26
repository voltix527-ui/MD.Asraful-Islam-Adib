/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MotionConfig } from 'motion/react';
import { lazy, Suspense, useCallback, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { AmbientParticles } from './components/AmbientParticles';
import { ContactSection } from './components/ContactSection';
import { CustomCursor, MouseSpotlight } from './components/CustomCursor';
import { ExperienceSection } from './components/ExperienceSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { type StudioTab } from './components/PortfolioStudioModal';
import { Preloader } from './components/Preloader';
import { ServicesSection } from './components/ServicesSection';
import { SkillsSection } from './components/SkillsSection';
import { usePortfolioStore } from './hooks/usePortfolioStore';

const ProjectsSection = lazy(() =>
  import('./components/ProjectsSection').then((m) => ({ default: m.ProjectsSection }))
);
const PortfolioStudioModal = lazy(() =>
  import('./components/PortfolioStudioModal').then((m) => ({
    default: m.PortfolioStudioModal,
  }))
);

export default function App() {
  const {
    data,
    updateProfile,
    updateStats,
    updateSkills,
    updateProjects,
    updateExperience,
    updateContact,
    resetDefaults,
  } = usePortfolioStore();

  const [preloaderDone, setPreloaderDone] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [studioTab, setStudioTab] = useState<StudioTab>('profile');

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  const openStudio = useCallback((tab: StudioTab = 'profile') => {
    setStudioTab(tab);
    setStudioOpen(true);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-[#080A12] text-[#F5F7FF]">
        {/* Preloader */}
        {!preloaderDone && <Preloader onComplete={handlePreloaderComplete} />}

        {/* Ambient Floating Particles & Desktop Pointer Polish */}
        <AmbientParticles />
        <MouseSpotlight />
        <CustomCursor />

        {/* Skip to Content Accessibility Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-[#1677FF] focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-[#F5F7FF]"
        >
          Skip to main content
        </a>

        {/* Sticky Glass Navigation */}
        <Navbar />

        {/* Main Content */}
        <main id="main-content" className="relative z-10">
          <HeroSection
            profile={data.profile}
            contact={data.contact}
            onOpenStudio={(tab) => openStudio(tab)}
          />

          <AboutSection
            profile={data.profile}
            stats={data.stats}
            onEditSection={(tab) => openStudio(tab)}
            onUpdateProfile={updateProfile}
          />

          <SkillsSection
            skills={data.skills}
            onEditSkills={() => openStudio('skills')}
          />

          <ServicesSection services={data.services} />

          <Suspense
            fallback={
              <div className="mx-auto max-w-7xl px-4 py-24 text-center text-sm text-[#A0A8BC]">
                Loading projects...
              </div>
            }
          >
            <ProjectsSection
              projects={data.projects}
              onEditProjects={() => openStudio('projects')}
            />
          </Suspense>

          <ExperienceSection
            experience={data.experience}
            onEditExperience={() => openStudio('experience')}
          />

          <ContactSection
            contact={data.contact}
            onEditContact={() => openStudio('contact')}
          />
        </main>

        <Footer
          profile={data.profile}
          contact={data.contact}
          onOpenStudio={() => openStudio('profile')}
        />

        {/* Lazy-Loaded Interactive Portfolio Editor */}
        {studioOpen && (
          <Suspense fallback={null}>
            <PortfolioStudioModal
              open={studioOpen}
              initialTab={studioTab}
              data={data}
              onClose={() => setStudioOpen(false)}
              onSaveProfile={updateProfile}
              onSaveStats={updateStats}
              onSaveSkills={updateSkills}
              onSaveProjects={updateProjects}
              onSaveExperience={updateExperience}
              onSaveContact={updateContact}
              onResetDefaults={resetDefaults}
            />
          </Suspense>
        )}
      </div>
    </MotionConfig>
  );
}

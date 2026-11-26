import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Facebook, Github, Linkedin, Mail } from 'lucide-react';
import { useRef } from 'react';
import { ContactInfo, ProfileInfo } from '../types/portfolio';
import { Hero3DCanvas } from './Hero3DCanvas';
import { MagneticButton } from './MagneticButton';

interface HeroSectionProps {
  profile: ProfileInfo;
  contact: ContactInfo;
  onOpenStudio: (tab: 'contact') => void;
}

export function HeroSection({ profile, contact, onOpenStudio }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const socialItems = [
    { label: 'Facebook', url: contact.facebook, icon: Facebook },
    { label: 'LinkedIn', url: contact.linkedin, icon: Linkedin },
    { label: 'GitHub', url: contact.github, icon: Github },
  ];

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative overflow-hidden pt-10 pb-20 sm:pt-14 sm:pb-24 lg:min-h-[calc(100vh-4rem)] lg:py-16 flex items-center"
    >
      {/* Subtle Animated Parallax Ambient Gradient */}
      <motion.div
        style={{ y: backgroundY }}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute -top-28 left-1/4 h-[520px] w-[520px] rounded-full opacity-25 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(22,119,255,0.42) 0%, rgba(135,59,255,0.22) 55%, transparent 75%)',
          }}
        />
        <div
          className="absolute right-0 bottom-0 h-[440px] w-[440px] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(135,59,255,0.45) 0%, rgba(22,119,255,0.18) 55%, transparent 75%)',
          }}
        />
      </motion.div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
        {/* Left Column: Typographic Hierarchy */}
        <div className="lg:col-span-6 flex flex-col items-start">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono-tabular text-xs font-medium tracking-[0.22em] text-[#1677FF]"
          >
            HELLO, I&apos;M
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 font-display text-4xl font-bold tracking-tight text-[#F5F7FF] sm:text-5xl xl:text-[3.75rem] xl:leading-[1.06]"
            style={{ textWrap: 'balance' }}
          >
            {profile.name.toUpperCase()}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 bg-gradient-to-r from-[#1677FF] via-[#6B7CFF] to-[#873BFF] bg-clip-text font-display text-xl font-semibold text-transparent sm:text-2xl"
          >
            {profile.title}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 max-w-xl text-base leading-relaxed text-[#A0A8BC] sm:text-lg"
          >
            I create intelligent digital experiences by combining artificial intelligence, modern
            web technologies, creative design, and innovative ideas.
          </motion.p>

          {/* Primary & Secondary CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <MagneticButton
              onClick={() => scrollToSection('projects')}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#1677FF] to-[#873BFF] px-6 py-3 text-sm font-semibold text-[#F5F7FF] whitespace-nowrap shrink-0 shadow-[0_8px_30px_rgba(22,119,255,0.3)] transition-shadow duration-200 hover:shadow-[0_12px_36px_rgba(135,59,255,0.4)]"
            >
              <span>Explore My Work</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </MagneticButton>

            <MagneticButton
              onClick={() => scrollToSection('contact')}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#F5F7FF]/15 bg-[#101426]/80 px-6 py-3 text-sm font-semibold text-[#F5F7FF] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[#1677FF]/60 hover:bg-[#101426]"
            >
              <Mail className="h-4 w-4 text-[#1677FF]" aria-hidden="true" />
              <span>Contact Me</span>
            </MagneticButton>
          </motion.div>

          {/* Social Media Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-9 flex items-center gap-3"
          >
            <span className="mr-1 text-xs font-medium tracking-wider text-[#A0A8BC]">
              Connect
            </span>
            {socialItems.map(({ label, url, icon: Icon }) =>
              url ? (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#F5F7FF]/12 bg-[#101426]/70 text-[#A0A8BC] transition-all duration-150 hover:-translate-y-0.5 hover:border-[#1677FF]/50 hover:text-[#F5F7FF]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ) : (
                <button
                  key={label}
                  type="button"
                  onClick={() => onOpenStudio('contact')}
                  aria-label={`${label} (Set profile URL in Portfolio Studio)`}
                  title={`${label} URL not set — click to configure`}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#F5F7FF]/10 bg-[#101426]/50 text-[#A0A8BC]/70 transition-all duration-150 hover:border-[#873BFF]/50 hover:text-[#F5F7FF]"
                >
                  <Icon className="h-4 w-4" />
                </button>
              )
            )}
          </motion.div>
        </div>

        {/* Right Column: Interactive 3D Neural Core */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 relative h-[340px] sm:h-[420px] lg:h-[540px] w-full"
        >
          <Hero3DCanvas />
        </motion.div>
      </div>
    </section>
  );
}

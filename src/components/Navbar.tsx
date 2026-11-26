import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const;

export function Navbar() {
  const [activeId, setActiveId] = useState<string>('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0.1, 0.25, 0.5] }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    setActiveId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
        scrolled
          ? 'border-b border-[#F5F7FF]/10 bg-[#080A12]/85 backdrop-blur-md'
          : 'border-b border-transparent bg-[#080A12]/50 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:rounded-md"
          aria-label="MD. Asraful Islam Adib — Home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F5F7FF]/15 bg-[#101426] font-display text-xs font-bold tracking-wider text-[#F5F7FF]">
            AD
          </span>
          <span className="font-display text-base font-semibold tracking-tight text-[#F5F7FF]">
            Asraful Adib
          </span>
        </a>

        {/* Zone 2: Single-line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => {
            const active = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                className={`relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  active ? 'text-[#F5F7FF]' : 'text-[#A0A8BC] hover:text-[#F5F7FF]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute right-0 -bottom-0.5 left-0 h-0.5 rounded-full bg-gradient-to-r from-[#1677FF] to-[#873BFF] transition-transform duration-200 origin-left ${
                    active ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('contact');
            }}
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#1677FF] to-[#873BFF] px-4 py-2 text-xs font-semibold text-[#F5F7FF] whitespace-nowrap shrink-0 shadow-[0_0_24px_rgba(22,119,255,0.28)] transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
          >
            Let&apos;s Talk
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#F5F7FF]/12 bg-[#101426]/80 text-[#F5F7FF] lg:hidden"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-[#F5F7FF]/10 bg-[#080A12]/95 px-4 py-4 backdrop-blur-lg lg:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {NAV_ITEMS.map((item) => {
                const active = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.id);
                    }}
                    className={`flex min-h-[44px] items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[#101426] text-[#F5F7FF]'
                        : 'text-[#A0A8BC] hover:bg-[#101426]/60 hover:text-[#F5F7FF]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {active && (
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-6 rounded-full bg-gradient-to-r from-[#1677FF] to-[#873BFF]"
                      />
                    )}
                  </a>
                );
              })}
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('contact');
                }}
                className="mt-2 flex min-h-[44px] items-center justify-center rounded-lg bg-gradient-to-r from-[#1677FF] to-[#873BFF] px-4 py-2.5 text-sm font-semibold text-[#F5F7FF]"
              >
                Let&apos;s Talk
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

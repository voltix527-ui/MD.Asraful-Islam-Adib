import { Facebook, Github, Linkedin, SlidersHorizontal } from 'lucide-react';
import { ContactInfo, ProfileInfo } from '../types/portfolio';

interface FooterProps {
  profile: ProfileInfo;
  contact: ContactInfo;
  onOpenStudio: () => void;
}

const FOOTER_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export function Footer({ profile, contact, onOpenStudio }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const socials = [
    { label: 'Facebook', url: contact.facebook, icon: Facebook },
    { label: 'LinkedIn', url: contact.linkedin, icon: Linkedin },
    { label: 'GitHub', url: contact.github, icon: Github },
  ];

  return (
    <footer className="border-t border-[#F5F7FF]/10 bg-[#080A12] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          {/* Identity */}
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#F5F7FF]/15 bg-[#101426] font-display text-sm font-bold tracking-wider text-[#F5F7FF]">
              AD
            </div>
            <div>
              <p className="font-display text-base font-bold text-[#F5F7FF]">{profile.name}</p>
              <p className="text-xs text-[#A0A8BC]">{profile.title}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Footer navigation">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-medium text-[#A0A8BC] transition-colors hover:text-[#F5F7FF]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Socials & Studio Trigger */}
          <div className="flex items-center gap-2.5">
            {socials.map(({ label, url, icon: Icon }) =>
              url ? (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#F5F7FF]/12 bg-[#101426] text-[#A0A8BC] transition-colors hover:border-[#1677FF] hover:text-[#F5F7FF]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ) : null
            )}

            <button
              type="button"
              onClick={onOpenStudio}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-[#F5F7FF]/12 bg-[#101426] px-3.5 py-2 text-xs font-medium text-[#F5F7FF] whitespace-nowrap shrink-0 transition-colors hover:border-[#1677FF]"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#1677FF]" aria-hidden="true" />
              <span>Portfolio Studio</span>
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-[#F5F7FF]/8 pt-6 text-xs text-[#A0A8BC] sm:flex-row sm:items-center">
          <p>
            &copy; {currentYear} {profile.name}. All rights reserved.
          </p>
          <p>Crafted with React, TypeScript &amp; Three.js</p>
        </div>
      </div>
    </footer>
  );
}

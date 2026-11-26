import { motion } from 'motion/react';
import { Briefcase, Calendar, Pencil } from 'lucide-react';
import { ExperienceItem } from '../types/portfolio';

interface ExperienceSectionProps {
  experience: ExperienceItem[];
  onEditExperience: () => void;
}

export function ExperienceSection({ experience, onEditExperience }: ExperienceSectionProps) {
  return (
    <section id="experience" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-end justify-between gap-4 border-b border-[#F5F7FF]/10 pb-6"
        >
          <div>
            <p className="font-mono-tabular text-xs font-medium tracking-[0.2em] text-[#873BFF]">
              05 · CAREER TIMELINE
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F5F7FF] sm:text-4xl">
              MY EXPERIENCE
            </h2>
          </div>

          <button
            type="button"
            onClick={onEditExperience}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#F5F7FF]/12 bg-[#101426]/80 px-3.5 py-2 text-xs font-medium text-[#A0A8BC] whitespace-nowrap shrink-0 transition-colors hover:border-[#1677FF]/50 hover:text-[#F5F7FF]"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Edit Experience</span>
          </button>
        </motion.div>

        {/* Vertical Timeline */}
        <div className="relative mt-12 ml-3 sm:ml-6">
          {/* Glowing vertical connector line */}
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-0 w-px bg-gradient-to-b from-[#1677FF] via-[#873BFF]/70 to-transparent"
          />

          <div className="space-y-8">
            {experience.map((item, idx) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative pl-8 sm:pl-12"
              >
                {/* Glowing Timeline Node */}
                <span
                  aria-hidden="true"
                  className="absolute top-6 -left-[7px] flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#F5F7FF]/40 bg-[#080A12] shadow-[0_0_14px_rgba(22,119,255,0.85)]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[#1677FF] to-[#873BFF]" />
                </span>

                <div className="rounded-2xl border border-[#F5F7FF]/10 bg-[#101426]/70 p-6 transition-colors duration-200 hover:border-[#1677FF]/45 hover:bg-[#101426]">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center gap-2.5 text-sm font-medium text-[#1677FF]">
                        <Briefcase className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{item.company}</span>
                      </div>
                      <h3 className="mt-1.5 font-display text-xl font-bold text-[#F5F7FF] sm:text-2xl">
                        {item.role}
                      </h3>
                    </div>

                    <div className="inline-flex items-center gap-2 font-mono-tabular text-xs font-medium text-[#A0A8BC] whitespace-nowrap shrink-0">
                      <Calendar className="h-3.5 w-3.5 text-[#873BFF]" aria-hidden="true" />
                      <span>{item.period}</span>
                    </div>
                  </div>

                  {item.summary && (
                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#A0A8BC]">
                      {item.summary}
                    </p>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

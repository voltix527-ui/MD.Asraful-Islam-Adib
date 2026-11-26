import { motion } from 'motion/react';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { SkillCategory, SkillItem } from '../types/portfolio';
import { getPortfolioIcon } from '../utils/iconMap';

interface SkillsSectionProps {
  skills: SkillItem[];
  onEditSkills: () => void;
}

const CATEGORIES: Array<'All' | SkillCategory> = [
  'All',
  'AI & Automation',
  'Web Development',
  'Creative Design',
];

const CATEGORY_ORDER: SkillCategory[] = [
  'AI & Automation',
  'Web Development',
  'Creative Design',
];

export function SkillsSection({ skills, onEditSkills }: SkillsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | SkillCategory>('All');

  const visibleCategories =
    activeCategory === 'All'
      ? CATEGORY_ORDER
      : CATEGORY_ORDER.filter((cat) => cat === activeCategory);

  return (
    <section id="skills" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header & Filter Row */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6 border-b border-[#F5F7FF]/10 pb-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="font-mono-tabular text-xs font-medium tracking-[0.2em] text-[#1677FF]">
              02 · CAPABILITIES
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F5F7FF] sm:text-4xl">
              MY SKILLS
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Segmented Filter Controls */}
            <div
              className="flex flex-wrap items-center gap-1 rounded-xl border border-[#F5F7FF]/10 bg-[#101426]/80 p-1"
              role="tablist"
              aria-label="Filter skills by category"
            >
              {CATEGORIES.map((category) => {
                const active = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveCategory(category)}
                    className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                      active
                        ? 'bg-gradient-to-r from-[#1677FF] to-[#873BFF] text-[#F5F7FF]'
                        : 'text-[#A0A8BC] hover:text-[#F5F7FF]'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onEditSkills}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#F5F7FF]/12 bg-[#101426]/80 px-3.5 py-2 text-xs font-medium text-[#A0A8BC] whitespace-nowrap shrink-0 transition-colors hover:border-[#1677FF]/50 hover:text-[#F5F7FF]"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Edit Levels</span>
            </button>
          </div>
        </motion.div>

        {/* Categorized Skill Grid */}
        <div className="mt-12 space-y-12">
          {visibleCategories.map((category) => {
            const categorySkills = skills.filter((s) => s.category === category);
            if (categorySkills.length === 0) return null;

            return (
              <div key={category}>
                <div className="mb-5 flex items-center justify-between border-b border-[#F5F7FF]/8 pb-3">
                  <h3 className="font-display text-xl font-semibold text-[#F5F7FF]">
                    {category}
                  </h3>
                  <span className="font-mono-tabular text-xs text-[#A0A8BC]">
                    {categorySkills.length} Capabilities
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categorySkills.map((skill, idx) => {
                    const Icon = getPortfolioIcon(skill.iconKey);
                    return (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{
                          duration: 0.38,
                          delay: idx * 0.04,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="group relative flex flex-col justify-between gap-4 rounded-2xl border border-[#F5F7FF]/10 bg-[#101426]/65 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1677FF]/50 hover:bg-[#101426] hover:shadow-[0_12px_32px_rgba(22,119,255,0.12)]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3.5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#F5F7FF]/10 bg-[#080A12] text-[#1677FF] transition-colors group-hover:border-[#873BFF]/40 group-hover:text-[#873BFF]">
                              <Icon className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <span className="font-display text-base font-semibold text-[#F5F7FF]">
                              {skill.name}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={onEditSkills}
                            className="text-xs font-medium text-[#A0A8BC] transition-colors hover:text-[#1677FF]"
                            title="Edit skill level in Portfolio Studio"
                          >
                            {skill.levelLabel}
                          </button>
                        </div>

                        {/* 5-Segment Editable Skill Indicator (0 segments active if unset — never invented!) */}
                        <div
                          className="grid grid-cols-5 gap-1.5"
                          aria-label={
                            skill.levelUnits > 0
                              ? `${skill.name}: ${skill.levelLabel} (${skill.levelUnits} of 5)`
                              : `${skill.name}: Level editable in studio`
                          }
                        >
                          {[1, 2, 3, 4, 5].map((segment) => {
                            const active = skill.levelUnits >= segment;
                            return (
                              <span
                                key={segment}
                                className={`h-1.5 rounded-full transition-colors duration-200 ${
                                  active
                                    ? 'bg-gradient-to-r from-[#1677FF] to-[#873BFF]'
                                    : 'bg-[#F5F7FF]/10 group-hover:bg-[#F5F7FF]/18'
                                }`}
                              />
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

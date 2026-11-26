import { motion } from 'motion/react';
import { Pencil, Plus, Trash2, User, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { ProfileInfo, StatItem } from '../types/portfolio';

interface AboutSectionProps {
  profile: ProfileInfo;
  stats: StatItem[];
  onEditSection: (tab: 'profile' | 'stats') => void;
  onUpdateProfile: (profile: ProfileInfo) => void;
}

const INFO_SUGGESTIONS = ['Education', 'Location', 'Languages', 'Interests', 'Focus Area'];

export function AboutSection({
  profile,
  stats,
  onEditSection,
  onUpdateProfile,
}: AboutSectionProps) {
  const [imgError, setImgError] = useState(false);
  const [addingInfo, setAddingInfo] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');
  const [infoError, setInfoError] = useState('');

  const handleAddDetail = (e: FormEvent) => {
    e.preventDefault();
    const label = newLabel.trim();
    const value = newValue.trim();
    if (!label || !value) {
      setInfoError('Please enter both a label and details.');
      return;
    }

    onUpdateProfile({
      ...profile,
      aboutDetails: [
        ...profile.aboutDetails,
        {
          id: `detail-${Date.now()}`,
          label,
          value,
        },
      ],
    });
    setNewLabel('');
    setNewValue('');
    setInfoError('');
    setAddingInfo(false);
  };

  const handleRemoveDetail = (id: string) => {
    onUpdateProfile({
      ...profile,
      aboutDetails: profile.aboutDetails.filter((item) => item.id !== id),
    });
  };

  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-end justify-between gap-4 border-b border-[#F5F7FF]/10 pb-6"
        >
          <div>
            <p className="font-mono-tabular text-xs font-medium tracking-[0.2em] text-[#1677FF]">
              01 · INTRODUCTION
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F5F7FF] sm:text-4xl">
              ABOUT ME
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setAddingInfo((prev) => !prev);
                setInfoError('');
              }}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-gradient-to-r from-[#1677FF] to-[#873BFF] px-3.5 py-2 text-xs font-semibold text-[#F5F7FF] whitespace-nowrap shrink-0 shadow-[0_6px_20px_rgba(22,119,255,0.25)] transition-opacity hover:opacity-95"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Add Info</span>
            </button>

            <button
              type="button"
              onClick={() => onEditSection('profile')}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#F5F7FF]/12 bg-[#101426]/80 px-3.5 py-2 text-xs font-medium text-[#A0A8BC] whitespace-nowrap shrink-0 transition-colors hover:border-[#1677FF]/50 hover:text-[#F5F7FF]"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Edit Bio &amp; Photo</span>
            </button>
          </div>
        </motion.div>

        {/* 2-Column Split */}
        <div className="mt-12 grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Portrait Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="group relative h-full min-h-[420px] overflow-hidden rounded-2xl border border-[#F5F7FF]/15 bg-[#101426] shadow-[0_20px_50px_rgba(22,119,255,0.12)]">
              {!imgError && profile.portraitUrl ? (
                <img
                  src={profile.portraitUrl}
                  alt={`${profile.name} portrait`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full min-h-[420px] w-full flex-col items-center justify-center bg-gradient-to-br from-[#101426] via-[#0B1022] to-[#16132E] p-8 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#1677FF]/30 bg-[#1677FF]/10 text-[#1677FF]">
                    <User className="h-9 w-9" aria-hidden="true" />
                  </div>
                  <p className="mt-4 font-display text-lg font-semibold text-[#F5F7FF]">
                    {profile.name}
                  </p>
                  <p className="mt-1 text-xs text-[#A0A8BC]">
                    Upload your photo in Portfolio Studio
                  </p>
                </div>
              )}

              {/* Bottom Caption Scrim */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#080A12]/95 via-[#080A12]/60 to-transparent"
              />
              <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-2 text-xs text-[#A0A8BC]">
                <span className="font-semibold text-[#F5F7FF]">{profile.name}</span>
                <span>{profile.title}</span>
              </div>
            </div>
          </motion.div>

          {/* Bio, Highlights & Custom Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-between gap-7"
          >
            <div className="space-y-4">
              <p className="text-xl leading-relaxed font-medium text-[#F5F7FF] sm:text-2xl">
                {profile.bioPrimary}
              </p>
              <p className="text-base leading-relaxed text-[#A0A8BC] sm:text-lg">
                {profile.bioSecondary}
              </p>
            </div>

            {/* Professional Highlights */}
            <div className="divide-y divide-[#F5F7FF]/10 border-t border-b border-[#F5F7FF]/10">
              {profile.highlights.map((item, idx) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-12 sm:items-baseline sm:gap-6"
                >
                  <span className="font-mono-tabular text-xs font-medium text-[#1677FF] sm:col-span-1">
                    0{idx + 1}
                  </span>
                  <h3 className="font-display text-base font-semibold text-[#F5F7FF] sm:col-span-4">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#A0A8BC] sm:col-span-7">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Additional Personal Info Block */}
            <div className="rounded-2xl border border-[#F5F7FF]/10 bg-[#101426]/60 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-sm font-semibold text-[#F5F7FF]">
                    Additional Information
                  </h3>
                  <p className="text-xs text-[#A0A8BC]">
                    Add education, location, languages, or other personal details.
                  </p>
                </div>

                {!addingInfo && (
                  <button
                    type="button"
                    onClick={() => {
                      setAddingInfo(true);
                      setInfoError('');
                    }}
                    className="inline-flex min-h-[34px] items-center gap-1.5 rounded-lg border border-[#1677FF]/40 bg-[#080A12] px-3 py-1.5 text-xs font-medium text-[#F5F7FF] transition-colors hover:border-[#1677FF]"
                  >
                    <Plus className="h-3.5 w-3.5 text-[#1677FF]" aria-hidden="true" />
                    <span>Add Info</span>
                  </button>
                )}
              </div>

              {/* Quick Inline Add Form */}
              {addingInfo && (
                <form
                  onSubmit={handleAddDetail}
                  className="mt-4 space-y-3 rounded-xl border border-[#1677FF]/35 bg-[#080A12]/80 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-medium text-[#A0A8BC]">
                      Quick Labels:
                    </span>
                    <button
                      type="button"
                      onClick={() => setAddingInfo(false)}
                      aria-label="Cancel adding info"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#A0A8BC] hover:text-[#F5F7FF]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {INFO_SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setNewLabel(suggestion)}
                        className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
                          newLabel === suggestion
                            ? 'border-[#1677FF] bg-[#1677FF]/15 text-[#F5F7FF]'
                            : 'border-[#F5F7FF]/10 bg-[#101426] text-[#A0A8BC] hover:text-[#F5F7FF]'
                        }`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="about-new-label" className="block text-xs text-[#A0A8BC]">
                        Label
                      </label>
                      <input
                        id="about-new-label"
                        type="text"
                        value={newLabel}
                        onChange={(e) => {
                          setNewLabel(e.target.value);
                          if (infoError) setInfoError('');
                        }}
                        placeholder="e.g., Education, Location"
                        className="mt-1 w-full rounded-lg border border-[#F5F7FF]/12 bg-[#101426] px-3 py-2 text-sm text-[#F5F7FF] placeholder:text-[#A0A8BC]/45 focus:border-[#1677FF] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="about-new-value" className="block text-xs text-[#A0A8BC]">
                        Details
                      </label>
                      <input
                        id="about-new-value"
                        type="text"
                        value={newValue}
                        onChange={(e) => {
                          setNewValue(e.target.value);
                          if (infoError) setInfoError('');
                        }}
                        placeholder="Enter your information"
                        className="mt-1 w-full rounded-lg border border-[#F5F7FF]/12 bg-[#101426] px-3 py-2 text-sm text-[#F5F7FF] placeholder:text-[#A0A8BC]/45 focus:border-[#1677FF] focus:outline-none"
                      />
                    </div>
                  </div>

                  {infoError && <p className="text-xs text-rose-400">{infoError}</p>}

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setAddingInfo(false)}
                      className="rounded-lg border border-[#F5F7FF]/12 px-3.5 py-1.5 text-xs font-medium text-[#A0A8BC] hover:text-[#F5F7FF]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-gradient-to-r from-[#1677FF] to-[#873BFF] px-4 py-1.5 text-xs font-semibold text-[#F5F7FF]"
                    >
                      Save Info
                    </button>
                  </div>
                </form>
              )}

              {/* Saved Custom Info Items */}
              {profile.aboutDetails.length > 0 && (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {profile.aboutDetails.map((detail) => (
                    <div
                      key={detail.id}
                      className="group flex items-start justify-between gap-3 rounded-xl border border-[#F5F7FF]/10 bg-[#080A12]/70 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[#1677FF]">{detail.label}</p>
                        <p className="mt-0.5 text-sm font-medium text-[#F5F7FF] break-words">
                          {detail.value}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDetail(detail.id)}
                        aria-label={`Remove ${detail.label}`}
                        className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#A0A8BC] opacity-70 transition-opacity hover:text-rose-400 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Full-Width 4-Column Editable Statistics Row */}
        <div className="mt-12">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-medium text-[#A0A8BC]">
              Key Highlights (Editable Placeholders)
            </span>
            <button
              type="button"
              onClick={() => onEditSection('stats')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1677FF] hover:text-[#F5F7FF] transition-colors"
            >
              <Pencil className="h-3 w-3" aria-hidden="true" />
              <span>Edit Stats</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => (
              <motion.button
                key={stat.id}
                type="button"
                onClick={() => onEditSection('stats')}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col items-start justify-between rounded-2xl border border-[#F5F7FF]/10 bg-[#101426]/70 p-6 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#1677FF]/45 hover:bg-[#101426]"
              >
                <span className="font-mono-tabular text-3xl font-bold tracking-tight text-[#F5F7FF] group-hover:text-[#1677FF] transition-colors">
                  {stat.value}
                </span>
                <span className="mt-3 font-display text-sm font-semibold text-[#F5F7FF]">
                  {stat.label}
                </span>
                <span className="mt-1 text-xs text-[#A0A8BC]">{stat.note}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

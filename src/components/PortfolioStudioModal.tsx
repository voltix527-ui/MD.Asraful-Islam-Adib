import { AnimatePresence, motion } from 'motion/react';
import { Plus, RotateCcw, Trash2, Upload, X } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  ContactInfo,
  ExperienceItem,
  PortfolioData,
  ProfileInfo,
  ProjectItem,
  SkillItem,
  StatItem,
} from '../types/portfolio';

export type StudioTab = 'profile' | 'stats' | 'skills' | 'projects' | 'experience' | 'contact';

interface PortfolioStudioModalProps {
  open: boolean;
  initialTab: StudioTab;
  data: PortfolioData;
  onClose: () => void;
  onSaveProfile: (profile: ProfileInfo) => void;
  onSaveStats: (stats: StatItem[]) => void;
  onSaveSkills: (skills: SkillItem[]) => void;
  onSaveProjects: (projects: ProjectItem[]) => void;
  onSaveExperience: (experience: ExperienceItem[]) => void;
  onSaveContact: (contact: ContactInfo) => void;
  onResetDefaults: () => void;
}

const TABS: Array<{ id: StudioTab; label: string }> = [
  { id: 'profile', label: 'Profile' },
  { id: 'stats', label: 'Stats' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact & Delivery' },
];

export function PortfolioStudioModal({
  open,
  initialTab,
  data,
  onClose,
  onSaveProfile,
  onSaveStats,
  onSaveSkills,
  onSaveProjects,
  onSaveExperience,
  onSaveContact,
  onResetDefaults,
}: PortfolioStudioModalProps) {
  const [activeTab, setActiveTab] = useState<StudioTab>(initialTab);

  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);

  // Sync active tab when opened via a specific section button
  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement>,
    onResult: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onResult(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#080A12]/85 p-4 backdrop-blur-md"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Portfolio Studio Editor"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 12 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#F5F7FF]/15 bg-[#101426] shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#F5F7FF]/10 px-6 py-4">
            <div>
              <h2 className="font-display text-lg font-bold text-[#F5F7FF]">
                Portfolio Studio
              </h2>
              <p className="text-xs text-[#A0A8BC]">
                Changes save automatically to your browser storage.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onResetDefaults}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#F5F7FF]/12 bg-[#080A12] px-3 py-1.5 text-xs font-medium text-[#A0A8BC] hover:text-[#F5F7FF]"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Reset Defaults</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Portfolio Studio"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#F5F7FF]/12 bg-[#080A12] text-[#F5F7FF] hover:border-[#1677FF]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-1 border-b border-[#F5F7FF]/10 bg-[#080A12]/50 px-6 py-2.5">
            {TABS.map((tab) => {
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-h-[34px] rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                    selected
                      ? 'bg-gradient-to-r from-[#1677FF] to-[#873BFF] text-[#F5F7FF]'
                      : 'text-[#A0A8BC] hover:text-[#F5F7FF]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-[#A0A8BC]">Full Name</label>
                    <input
                      type="text"
                      value={data.profile.name}
                      onChange={(e) =>
                        onSaveProfile({ ...data.profile, name: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-xl border border-[#F5F7FF]/12 bg-[#080A12] px-3.5 py-2.5 text-sm text-[#F5F7FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#A0A8BC]">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={data.profile.title}
                      onChange={(e) =>
                        onSaveProfile({ ...data.profile, title: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-xl border border-[#F5F7FF]/12 bg-[#080A12] px-3.5 py-2.5 text-sm text-[#F5F7FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A0A8BC]">
                    Portrait Image URL or Upload
                  </label>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    <input
                      type="text"
                      value={data.profile.portraitUrl}
                      onChange={(e) =>
                        onSaveProfile({ ...data.profile, portraitUrl: e.target.value })
                      }
                      placeholder="https://... or upload image"
                      className="flex-1 min-w-[200px] rounded-xl border border-[#F5F7FF]/12 bg-[#080A12] px-3.5 py-2.5 text-sm text-[#F5F7FF]"
                    />
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#F5F7FF]/15 bg-[#080A12] px-4 py-2.5 text-xs font-medium text-[#F5F7FF] hover:border-[#1677FF]">
                      <Upload className="h-3.5 w-3.5 text-[#1677FF]" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) =>
                          handleImageUpload(e, (url) =>
                            onSaveProfile({ ...data.profile, portraitUrl: url })
                          )
                        }
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A0A8BC]">
                    Primary Biography
                  </label>
                  <textarea
                    rows={3}
                    value={data.profile.bioPrimary}
                    onChange={(e) =>
                      onSaveProfile({ ...data.profile, bioPrimary: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-[#F5F7FF]/12 bg-[#080A12] px-3.5 py-2.5 text-sm text-[#F5F7FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A0A8BC]">
                    Secondary Statement
                  </label>
                  <textarea
                    rows={2}
                    value={data.profile.bioSecondary}
                    onChange={(e) =>
                      onSaveProfile({ ...data.profile, bioSecondary: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-[#F5F7FF]/12 bg-[#080A12] px-3.5 py-2.5 text-sm text-[#F5F7FF]"
                  />
                </div>

                {/* Custom About Details */}
                <div className="space-y-3 rounded-xl border border-[#F5F7FF]/10 bg-[#080A12]/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#F5F7FF]">
                      Additional Information Fields
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onSaveProfile({
                          ...data.profile,
                          aboutDetails: [
                            ...data.profile.aboutDetails,
                            {
                              id: `detail-${Date.now()}`,
                              label: 'Field',
                              value: '',
                            },
                          ],
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#1677FF]/20 px-3 py-1.5 text-xs font-medium text-[#F5F7FF] hover:bg-[#1677FF]/35"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Info Field</span>
                    </button>
                  </div>

                  {data.profile.aboutDetails.length === 0 && (
                    <p className="text-xs text-[#A0A8BC]">
                      No extra fields yet. Click &quot;Add Info Field&quot; to add Education,
                      Location, Languages, or any custom information.
                    </p>
                  )}

                  {data.profile.aboutDetails.map((item, idx) => (
                    <div key={item.id} className="grid grid-cols-1 gap-2 sm:grid-cols-12">
                      <input
                        type="text"
                        value={item.label}
                        placeholder="Label (e.g. Education)"
                        onChange={(e) => {
                          const next = [...data.profile.aboutDetails];
                          next[idx] = { ...item, label: e.target.value };
                          onSaveProfile({ ...data.profile, aboutDetails: next });
                        }}
                        className="sm:col-span-4 rounded-lg border border-[#F5F7FF]/12 bg-[#101426] px-3 py-2 text-xs text-[#F5F7FF]"
                      />
                      <input
                        type="text"
                        value={item.value}
                        placeholder="Details"
                        onChange={(e) => {
                          const next = [...data.profile.aboutDetails];
                          next[idx] = { ...item, value: e.target.value };
                          onSaveProfile({ ...data.profile, aboutDetails: next });
                        }}
                        className="sm:col-span-7 rounded-lg border border-[#F5F7FF]/12 bg-[#101426] px-3 py-2 text-xs text-[#F5F7FF]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          onSaveProfile({
                            ...data.profile,
                            aboutDetails: data.profile.aboutDetails.filter(
                              (d) => d.id !== item.id
                            ),
                          })
                        }
                        aria-label={`Remove ${item.label}`}
                        className="sm:col-span-1 flex items-center justify-center rounded-lg border border-[#F5F7FF]/10 bg-[#101426] py-2 text-rose-400 hover:border-rose-400/50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Editable Highlights */}
                <div className="space-y-3 rounded-xl border border-[#F5F7FF]/10 bg-[#080A12]/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#F5F7FF]">
                      About Me Highlights
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onSaveProfile({
                          ...data.profile,
                          highlights: [
                            ...data.profile.highlights,
                            {
                              id: `hl-${Date.now()}`,
                              title: 'New Highlight',
                              detail: 'Describe a key strength or focus area.',
                            },
                          ],
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#F5F7FF]/12 bg-[#101426] px-3 py-1.5 text-xs font-medium text-[#F5F7FF]"
                    >
                      <Plus className="h-3.5 w-3.5 text-[#1677FF]" />
                      <span>Add Highlight</span>
                    </button>
                  </div>

                  {data.profile.highlights.map((hl, idx) => (
                    <div key={hl.id} className="space-y-2 rounded-lg border border-[#F5F7FF]/8 bg-[#101426]/60 p-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={hl.title}
                          onChange={(e) => {
                            const next = [...data.profile.highlights];
                            next[idx] = { ...hl, title: e.target.value };
                            onSaveProfile({ ...data.profile, highlights: next });
                          }}
                          className="flex-1 rounded-lg border border-[#F5F7FF]/12 bg-[#080A12] px-3 py-1.5 text-xs font-semibold text-[#F5F7FF]"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            onSaveProfile({
                              ...data.profile,
                              highlights: data.profile.highlights.filter(
                                (h) => h.id !== hl.id
                              ),
                            })
                          }
                          aria-label={`Remove ${hl.title}`}
                          className="p-1.5 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={hl.detail}
                        onChange={(e) => {
                          const next = [...data.profile.highlights];
                          next[idx] = { ...hl, detail: e.target.value };
                          onSaveProfile({ ...data.profile, highlights: next });
                        }}
                        className="w-full rounded-lg border border-[#F5F7FF]/12 bg-[#080A12] px-3 py-1.5 text-xs text-[#A0A8BC]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {data.stats.map((stat, idx) => (
                  <div
                    key={stat.id}
                    className="space-y-3 rounded-xl border border-[#F5F7FF]/10 bg-[#080A12]/70 p-4"
                  >
                    <div>
                      <label className="block text-xs text-[#A0A8BC]">Value</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const next = [...data.stats];
                          next[idx] = { ...stat, value: e.target.value };
                          onSaveStats(next);
                        }}
                        className="mt-1 w-full rounded-lg border border-[#F5F7FF]/12 bg-[#101426] px-3 py-2 text-sm text-[#F5F7FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#A0A8BC]">Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const next = [...data.stats];
                          next[idx] = { ...stat, label: e.target.value };
                          onSaveStats(next);
                        }}
                        className="mt-1 w-full rounded-lg border border-[#F5F7FF]/12 bg-[#101426] px-3 py-2 text-sm text-[#F5F7FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#A0A8BC]">Note</label>
                      <input
                        type="text"
                        value={stat.note}
                        onChange={(e) => {
                          const next = [...data.stats];
                          next[idx] = { ...stat, note: e.target.value };
                          onSaveStats(next);
                        }}
                        className="mt-1 w-full rounded-lg border border-[#F5F7FF]/12 bg-[#101426] px-3 py-2 text-sm text-[#F5F7FF]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-3">
                {data.skills.map((skill, idx) => (
                  <div
                    key={skill.id}
                    className="grid grid-cols-1 items-center gap-3 rounded-xl border border-[#F5F7FF]/10 bg-[#080A12]/70 p-3.5 sm:grid-cols-12"
                  >
                    <div className="sm:col-span-4">
                      <p className="text-sm font-semibold text-[#F5F7FF]">{skill.name}</p>
                      <p className="text-xs text-[#A0A8BC]">{skill.category}</p>
                    </div>
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={skill.levelLabel}
                        placeholder="e.g. Core, Advanced"
                        onChange={(e) => {
                          const next = [...data.skills];
                          next[idx] = { ...skill, levelLabel: e.target.value };
                          onSaveSkills(next);
                        }}
                        className="w-full rounded-lg border border-[#F5F7FF]/12 bg-[#101426] px-3 py-1.5 text-xs text-[#F5F7FF]"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-1.5 sm:col-span-4">
                      {[0, 1, 2, 3, 4, 5].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => {
                            const next = [...data.skills];
                            next[idx] = { ...skill, levelUnits: lvl };
                            onSaveSkills(next);
                          }}
                          className={`h-8 w-8 rounded-lg font-mono-tabular text-xs font-semibold transition-colors ${
                            skill.levelUnits === lvl
                              ? 'bg-[#1677FF] text-[#F5F7FF]'
                              : 'border border-[#F5F7FF]/10 bg-[#101426] text-[#A0A8BC] hover:text-[#F5F7FF]'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      onSaveProjects([
                        ...data.projects,
                        {
                          id: `project-${Date.now()}`,
                          title: 'New Project',
                          category: 'AI Web Application',
                          description: 'Describe what this project solves and how it was built.',
                          imageUrl: '',
                          liveUrl: '',
                          repoUrl: '',
                          highlights: ['Custom Build'],
                        },
                      ])
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#1677FF] to-[#873BFF] px-4 py-2 text-xs font-semibold text-[#F5F7FF]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                {data.projects.map((project, idx) => (
                  <div
                    key={project.id}
                    className="space-y-3 rounded-xl border border-[#F5F7FF]/12 bg-[#080A12]/70 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-tabular text-xs font-semibold text-[#1677FF]">
                        Project #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onSaveProjects(data.projects.filter((p) => p.id !== project.id))
                        }
                        className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs text-[#A0A8BC]">Title</label>
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => {
                            const next = [...data.projects];
                            next[idx] = { ...project, title: e.target.value };
                            onSaveProjects(next);
                          }}
                          className="mt-1 w-full rounded-lg border border-[#F5F7FF]/12 bg-[#101426] px-3 py-2 text-sm text-[#F5F7FF]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#A0A8BC]">Category</label>
                        <input
                          type="text"
                          value={project.category}
                          onChange={(e) => {
                            const next = [...data.projects];
                            next[idx] = { ...project, category: e.target.value };
                            onSaveProjects(next);
                          }}
                          className="mt-1 w-full rounded-lg border border-[#F5F7FF]/12 bg-[#101426] px-3 py-2 text-sm text-[#F5F7FF]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#A0A8BC]">Description</label>
                      <textarea
                        rows={2}
                        value={project.description}
                        onChange={(e) => {
                          const next = [...data.projects];
                          next[idx] = { ...project, description: e.target.value };
                          onSaveProjects(next);
                        }}
                        className="mt-1 w-full rounded-lg border border-[#F5F7FF]/12 bg-[#101426] px-3 py-2 text-sm text-[#F5F7FF]"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs text-[#A0A8BC]">Live Demo URL</label>
                        <input
                          type="url"
                          value={project.liveUrl}
                          placeholder="https://..."
                          onChange={(e) => {
                            const next = [...data.projects];
                            next[idx] = { ...project, liveUrl: e.target.value };
                            onSaveProjects(next);
                          }}
                          className="mt-1 w-full rounded-lg border border-[#F5F7FF]/12 bg-[#101426] px-3 py-2 text-sm text-[#F5F7FF]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#A0A8BC]">Source Code URL</label>
                        <input
                          type="url"
                          value={project.repoUrl}
                          placeholder="https://github.com/..."
                          onChange={(e) => {
                            const next = [...data.projects];
                            next[idx] = { ...project, repoUrl: e.target.value };
                            onSaveProjects(next);
                          }}
                          className="mt-1 w-full rounded-lg border border-[#F5F7FF]/12 bg-[#101426] px-3 py-2 text-sm text-[#F5F7FF]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#A0A8BC]">
                        Thumbnail URL or Upload
                      </label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <input
                          type="text"
                          value={project.imageUrl}
                          onChange={(e) => {
                            const next = [...data.projects];
                            next[idx] = { ...project, imageUrl: e.target.value };
                            onSaveProjects(next);
                          }}
                          className="flex-1 min-w-[180px] rounded-lg border border-[#F5F7FF]/12 bg-[#101426] px-3 py-2 text-sm text-[#F5F7FF]"
                        />
                        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#F5F7FF]/15 bg-[#101426] px-3 py-2 text-xs font-medium text-[#F5F7FF] hover:border-[#1677FF]">
                          <Upload className="h-3.5 w-3.5 text-[#1677FF]" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) =>
                              handleImageUpload(e, (url) => {
                                const next = [...data.projects];
                                next[idx] = { ...project, imageUrl: url };
                                onSaveProjects(next);
                              })
                            }
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      onSaveExperience([
                        {
                          id: `exp-${Date.now()}`,
                          company: 'New Organization',
                          role: 'Role Title',
                          period: '2026 - Present',
                          summary: 'Key responsibilities and outcomes.',
                        },
                        ...data.experience,
                      ])
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#1677FF] to-[#873BFF] px-4 py-2 text-xs font-semibold text-[#F5F7FF]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Experience</span>
                  </button>
                </div>

                {data.experience.map((item, idx) => (
                  <div
                    key={item.id}
                    className="space-y-3 rounded-xl border border-[#F5F7FF]/12 bg-[#080A12]/70 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-tabular text-xs font-semibold text-[#873BFF]">
                        Entry #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onSaveExperience(data.experience.filter((e) => e.id !== item.id))
                        }
                        className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs text-[#A0A8BC]">Company</label>
                        <input
                          type="text"
                          value={item.company}
                          onChange={(e) => {
                            const next = [...data.experience];
                            next[idx] = { ...item, company: e.target.value };
                            onSaveExperience(next);
                          }}
                          className="mt-1 w-full rounded-lg border border-[#F5F7FF]/12 bg-[#101426] px-3 py-2 text-sm text-[#F5F7FF]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#A0A8BC]">Role</label>
                        <input
                          type="text"
                          value={item.role}
                          onChange={(e) => {
                            const next = [...data.experience];
                            next[idx] = { ...item, role: e.target.value };
                            onSaveExperience(next);
                          }}
                          className="mt-1 w-full rounded-lg border border-[#F5F7FF]/12 bg-[#101426] px-3 py-2 text-sm text-[#F5F7FF]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#A0A8BC]">Period</label>
                        <input
                          type="text"
                          value={item.period}
                          onChange={(e) => {
                            const next = [...data.experience];
                            next[idx] = { ...item, period: e.target.value };
                            onSaveExperience(next);
                          }}
                          className="mt-1 w-full rounded-lg border border-[#F5F7FF]/12 bg-[#101426] px-3 py-2 text-sm text-[#F5F7FF]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#A0A8BC]">Summary</label>
                      <textarea
                        rows={2}
                        value={item.summary}
                        onChange={(e) => {
                          const next = [...data.experience];
                          next[idx] = { ...item, summary: e.target.value };
                          onSaveExperience(next);
                        }}
                        className="mt-1 w-full rounded-lg border border-[#F5F7FF]/12 bg-[#101426] px-3 py-2 text-sm text-[#F5F7FF]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-[#A0A8BC]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={data.contact.email}
                      placeholder="your-real-email@domain.com"
                      onChange={(e) =>
                        onSaveContact({ ...data.contact, email: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-xl border border-[#F5F7FF]/12 bg-[#080A12] px-3.5 py-2.5 text-sm text-[#F5F7FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#A0A8BC]">
                      WhatsApp Number (with country code)
                    </label>
                    <input
                      type="text"
                      value={data.contact.whatsapp}
                      placeholder="+880..."
                      onChange={(e) =>
                        onSaveContact({ ...data.contact, whatsapp: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-xl border border-[#F5F7FF]/12 bg-[#080A12] px-3.5 py-2.5 text-sm text-[#F5F7FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#A0A8BC]">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={data.contact.facebook}
                      placeholder="https://facebook.com/..."
                      onChange={(e) =>
                        onSaveContact({ ...data.contact, facebook: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-xl border border-[#F5F7FF]/12 bg-[#080A12] px-3.5 py-2.5 text-sm text-[#F5F7FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#A0A8BC]">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={data.contact.linkedin}
                      placeholder="https://linkedin.com/in/..."
                      onChange={(e) =>
                        onSaveContact({ ...data.contact, linkedin: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-xl border border-[#F5F7FF]/12 bg-[#080A12] px-3.5 py-2.5 text-sm text-[#F5F7FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#A0A8BC]">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={data.contact.github}
                      placeholder="https://github.com/..."
                      onChange={(e) =>
                        onSaveContact({ ...data.contact, github: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-xl border border-[#F5F7FF]/12 bg-[#080A12] px-3.5 py-2.5 text-sm text-[#F5F7FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#A0A8BC]">
                      Availability / Location Note
                    </label>
                    <input
                      type="text"
                      value={data.contact.location}
                      onChange={(e) =>
                        onSaveContact({ ...data.contact, location: e.target.value })
                      }
                      className="mt-1.5 w-full rounded-xl border border-[#F5F7FF]/12 bg-[#080A12] px-3.5 py-2.5 text-sm text-[#F5F7FF]"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-[#1677FF]/30 bg-[#080A12]/80 p-4">
                  <label className="block text-xs font-semibold text-[#F5F7FF]">
                    Live Contact Form Delivery Webhook (Optional HTTPS Endpoint)
                  </label>
                  <p className="mt-1 text-xs text-[#A0A8BC]">
                    Paste a Formspree, Web3Forms, or custom HTTPS endpoint URL here—or configure
                    SMTP variables on the server—to deliver contact form submissions for real.
                  </p>
                  <input
                    type="url"
                    value={data.contact.webhookUrl}
                    placeholder="https://formspree.io/f/your-form-id"
                    onChange={(e) =>
                      onSaveContact({ ...data.contact, webhookUrl: e.target.value })
                    }
                    className="mt-2.5 w-full rounded-xl border border-[#F5F7FF]/12 bg-[#101426] px-3.5 py-2.5 text-sm text-[#F5F7FF]"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

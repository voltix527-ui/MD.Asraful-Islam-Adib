import { AnimatePresence, motion } from 'motion/react';
import { Code2, ExternalLink, FolderKanban, Pencil, Plus, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { ProjectItem } from '../types/portfolio';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onEditProjects: () => void;
}

interface TiltCardProps {
  project: ProjectItem;
  index: number;
  onInspect: (project: ProjectItem) => void;
  onEdit: () => void;
}

function ProjectCard({ project, index, onInspect, onEdit }: TiltCardProps) {
  const reducedMotion = usePrefersReducedMotion();
  const cardRef = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [imgError, setImgError] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reducedMotion || e.pointerType !== 'mouse' || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Number((-y * 6).toFixed(2)),
      ry: Number((x * 6).toFixed(2)),
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  const hasLiveUrl = Boolean(project.liveUrl && project.liveUrl.trim());
  const hasRepoUrl = Boolean(project.repoUrl && project.repoUrl.trim());

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={
        reducedMotion
          ? undefined
          : {
              transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              transition:
                tilt.rx === 0 && tilt.ry === 0
                  ? 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1)'
                  : 'transform 60ms linear',
            }
      }
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#F5F7FF]/12 bg-[#101426]/75 transition-colors duration-200 hover:border-[#1677FF]/55 hover:shadow-[0_20px_50px_rgba(22,119,255,0.16)]"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#080A12]">
        {!imgError && project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={`${project.title} preview`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#101426] via-[#0B1226] to-[#191130] p-6 text-center">
            <FolderKanban className="h-9 w-9 text-[#1677FF]" aria-hidden="true" />
            <span className="mt-3 font-display text-base font-semibold text-[#F5F7FF]">
              {project.title}
            </span>
          </div>
        )}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101426] via-transparent to-transparent opacity-70"
        />

        <button
          type="button"
          onClick={() => onInspect(project)}
          className="absolute inset-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1677FF]"
          aria-label={`Inspect ${project.title} details`}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-[#A0A8BC]">
            <span className="font-medium text-[#1677FF]">{project.category}</span>
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-1 text-xs text-[#A0A8BC] transition-colors hover:text-[#F5F7FF]"
              aria-label={`Edit ${project.title}`}
            >
              <Pencil className="h-3 w-3" aria-hidden="true" />
              <span>Edit</span>
            </button>
          </div>

          <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#F5F7FF]">
            {project.title}
          </h3>

          <p className="mt-2.5 text-sm leading-relaxed text-[#A0A8BC]">
            {project.description}
          </p>

          {project.highlights.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#A0A8BC]">
              {project.highlights.map((item, hIdx) => (
                <span key={`${item}-${hIdx}`} className="inline-flex items-center gap-2">
                  <span>{item}</span>
                  {hIdx < project.highlights.length - 1 && (
                    <span aria-hidden="true" className="text-[#F5F7FF]/25">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons — Real URLs Only */}
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#F5F7FF]/10 pt-5">
          {hasLiveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-gradient-to-r from-[#1677FF] to-[#873BFF] px-4 py-2 text-xs font-semibold text-[#F5F7FF] whitespace-nowrap shrink-0 transition-opacity hover:opacity-95"
            >
              <span>Live Demo</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          ) : (
            <button
              type="button"
              disabled
              title="Add a live demo URL in Portfolio Studio to enable"
              className="inline-flex min-h-[40px] cursor-not-allowed items-center gap-2 rounded-lg border border-[#F5F7FF]/10 bg-[#080A12]/60 px-4 py-2 text-xs font-medium text-[#A0A8BC]/55 whitespace-nowrap shrink-0"
            >
              <span>Live Demo</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}

          {hasRepoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#F5F7FF]/15 bg-[#080A12] px-4 py-2 text-xs font-semibold text-[#F5F7FF] whitespace-nowrap shrink-0 transition-colors hover:border-[#1677FF]/60"
            >
              <Code2 className="h-3.5 w-3.5 text-[#1677FF]" aria-hidden="true" />
              <span>Source Code</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              title="Add a source code repository URL in Portfolio Studio to enable"
              className="inline-flex min-h-[40px] cursor-not-allowed items-center gap-2 rounded-lg border border-[#F5F7FF]/10 bg-[#080A12]/60 px-4 py-2 text-xs font-medium text-[#A0A8BC]/55 whitespace-nowrap shrink-0"
            >
              <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Source Code</span>
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function ProjectsSection({ projects, onEditProjects }: ProjectsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [inspected, setInspected] = useState<ProjectItem | null>(null);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(projects.map((p) => p.category)));
    return ['All', ...unique];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  return (
    <section id="projects" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6 border-b border-[#F5F7FF]/10 pb-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p className="font-mono-tabular text-xs font-medium tracking-[0.2em] text-[#1677FF]">
              04 · SELECTED WORK
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F5F7FF] sm:text-4xl">
              FEATURED PROJECTS
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className="flex flex-wrap items-center gap-1 rounded-xl border border-[#F5F7FF]/10 bg-[#101426]/80 p-1"
              role="tablist"
              aria-label="Filter projects by category"
            >
              {categories.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCategory(cat)}
                    className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                      active
                        ? 'bg-gradient-to-r from-[#1677FF] to-[#873BFF] text-[#F5F7FF]'
                        : 'text-[#A0A8BC] hover:text-[#F5F7FF]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onEditProjects}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#F5F7FF]/15 bg-[#101426] px-3.5 py-2 text-xs font-semibold text-[#F5F7FF] whitespace-nowrap shrink-0 transition-colors hover:border-[#1677FF]/60"
            >
              <Plus className="h-3.5 w-3.5 text-[#1677FF]" aria-hidden="true" />
              <span>Manage Projects</span>
            </button>
          </div>
        </motion.div>

        {/* Project Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {filteredProjects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={idx}
              onInspect={setInspected}
              onEdit={onEditProjects}
            />
          ))}
        </div>
      </div>

      {/* Lightbox Detail Modal */}
      <AnimatePresence>
        {inspected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#080A12]/85 p-4 backdrop-blur-md"
            onClick={() => setInspected(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#F5F7FF]/15 bg-[#101426] shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setInspected(null)}
                aria-label="Close project preview"
                className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-[#F5F7FF]/15 bg-[#080A12]/80 text-[#F5F7FF] hover:border-[#1677FF]"
              >
                <X className="h-4 w-4" />
              </button>

              {inspected.imageUrl && (
                <div className="aspect-[16/10] w-full overflow-hidden bg-[#080A12]">
                  <img
                    src={inspected.imageUrl}
                    alt={`${inspected.title} detailed preview`}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="p-6 sm:p-8">
                <p className="text-xs font-medium text-[#1677FF]">{inspected.category}</p>
                <h3
                  id="project-modal-title"
                  className="mt-1.5 font-display text-2xl font-bold text-[#F5F7FF] sm:text-3xl"
                >
                  {inspected.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[#A0A8BC]">
                  {inspected.description}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {inspected.liveUrl ? (
                    <a
                      href={inspected.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-gradient-to-r from-[#1677FF] to-[#873BFF] px-5 py-2.5 text-xs font-semibold text-[#F5F7FF]"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs text-[#A0A8BC]">
                      Live Demo URL not added yet
                    </span>
                  )}

                  {inspected.repoUrl && (
                    <a
                      href={inspected.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-[#F5F7FF]/15 bg-[#080A12] px-5 py-2.5 text-xs font-semibold text-[#F5F7FF]"
                    >
                      <Code2 className="h-3.5 w-3.5 text-[#1677FF]" />
                      <span>Source Code</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

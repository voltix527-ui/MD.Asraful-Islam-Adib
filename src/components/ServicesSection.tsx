import { motion } from 'motion/react';
import { ServiceItem } from '../types/portfolio';
import { getPortfolioIcon } from '../utils/iconMap';

interface ServicesSectionProps {
  services: ServiceItem[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section id="services" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="border-b border-[#F5F7FF]/10 pb-6"
        >
          <p className="font-mono-tabular text-xs font-medium tracking-[0.2em] text-[#873BFF]">
            03 · SERVICES
          </p>
          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="font-display text-3xl font-bold tracking-tight text-[#F5F7FF] sm:text-4xl">
              WHAT I DO
            </h2>
            <p className="max-w-md text-sm text-[#A0A8BC]">
              End-to-end digital solutions combining generative AI workflows, modern frontend
              engineering, and clean visual systems.
            </p>
          </div>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, idx) => {
            const Icon = getPortfolioIcon(service.iconKey);
            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#F5F7FF]/10 bg-[#101426]/60 p-7 backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:border-[#1677FF]/55 hover:bg-[#101426]/90 hover:shadow-[0_18px_45px_rgba(22,119,255,0.16)]"
              >
                {/* Top-right subtle ambient glow on hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-45"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(22,119,255,0.75) 0%, rgba(135,59,255,0.5) 60%, transparent 80%)',
                  }}
                />

                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#F5F7FF]/12 bg-[#080A12] text-[#1677FF] transition-all duration-200 group-hover:border-[#873BFF]/50 group-hover:text-[#F5F7FF]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span className="font-mono-tabular text-xs text-[#A0A8BC]">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-xl font-semibold text-[#F5F7FF]">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#A0A8BC]">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 h-px w-full bg-gradient-to-r from-[#1677FF]/40 via-[#873BFF]/30 to-transparent opacity-40 transition-opacity group-hover:opacity-100" />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

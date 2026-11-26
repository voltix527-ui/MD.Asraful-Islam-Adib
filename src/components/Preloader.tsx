import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [progress, setProgress] = useState(reducedMotion ? 100 : 0);
  const [visible, setVisible] = useState(!reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(false);
      onComplete();
      return;
    }

    let rafId = 0;
    const duration = 780;
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setTimeout(() => {
          setVisible(false);
          onComplete();
        }, 140);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [onComplete, reducedMotion]);

  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080A12] text-[#F5F7FF]"
          aria-label="Loading portfolio"
          role="status"
        >
          {/* Ambient center aura */}
          <div
            className="pointer-events-none absolute h-72 w-72 rounded-full opacity-25 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(22,119,255,0.55) 0%, rgba(135,59,255,0.35) 55%, transparent 75%)',
            }}
          />

          <div className="relative flex flex-col items-center gap-6">
            <div className="relative flex h-36 w-36 items-center justify-center">
              <svg className="h-36 w-36 -rotate-90" viewBox="0 0 128 128" aria-hidden="true">
                <defs>
                  <linearGradient id="preloaderRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1677FF" />
                    <stop offset="100%" stopColor="#873BFF" />
                  </linearGradient>
                </defs>
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  fill="none"
                  stroke="rgba(245,247,255,0.08)"
                  strokeWidth="2.5"
                />
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  fill="none"
                  stroke="url(#preloaderRingGrad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                />
              </svg>

              {/* Animated AD Monogram */}
              <motion.svg
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                viewBox="0 0 64 40"
                className="absolute h-10 w-16"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="adMonogramGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5F7FF" />
                    <stop offset="55%" stopColor="#1677FF" />
                    <stop offset="100%" stopColor="#873BFF" />
                  </linearGradient>
                </defs>
                {/* Stylized A */}
                <path
                  d="M6 34 L18 6 L30 34 M10.5 25 H25.5"
                  fill="none"
                  stroke="url(#adMonogramGrad)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Stylized D */}
                <path
                  d="M36 6 V34 H46 C53.5 34 58 28.5 58 20 C58 11.5 53.5 6 46 6 H36 Z"
                  fill="none"
                  stroke="url(#adMonogramGrad)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </div>

            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="font-display text-sm font-medium tracking-[0.22em] text-[#F5F7FF]">
                MD. ASRAFUL ISLAM ADIB
              </span>
              <span className="font-mono-tabular text-xs text-[#A0A8BC]">
                {progress}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

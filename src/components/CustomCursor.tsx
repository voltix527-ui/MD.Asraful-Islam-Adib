import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export function CustomCursor() {
  const reducedMotion = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') {
      setEnabled(false);
      return;
    }
    const finePointer = window.matchMedia('(pointer: fine) and (hover: hover)').matches;
    if (!finePointer) {
      setEnabled(false);
      return;
    }
    setEnabled(true);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isInteractive = false;
    let isPressed = false;
    let rafId = 0;

    const onMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const target = e.target as HTMLElement | null;
      isInteractive = Boolean(
        target?.closest('a, button, input, textarea, select, [role="button"]')
      );
    };

    const onDown = () => {
      isPressed = true;
    };
    const onUp = () => {
      isPressed = false;
    };
    const onLeave = () => {
      mouseX = -100;
      mouseY = -100;
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0) scale(${isPressed ? 0.75 : 1})`;
      }
      if (ringRef.current) {
        const scale = isPressed ? 0.85 : isInteractive ? 1.55 : 1;
        ringRef.current.style.transform = `translate3d(${ringX - 16}px, ${ringY - 16}px, 0) scale(${scale})`;
        ringRef.current.style.borderColor = isInteractive
          ? 'rgba(135, 59, 255, 0.75)'
          : 'rgba(22, 119, 255, 0.5)';
      }
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [reducedMotion]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[70] h-8 w-8 rounded-full border border-[#1677FF]/50 transition-colors duration-150 will-change-transform"
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[70] h-1.5 w-1.5 rounded-full bg-[#F5F7FF] will-change-transform"
      />
    </>
  );
}

export function MouseSpotlight() {
  const reducedMotion = usePrefersReducedMotion();
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') return;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!finePointer) return;

    const onMove = (e: PointerEvent) => {
      if (!glowRef.current) return;
      glowRef.current.style.transform = `translate3d(${e.clientX - 240}px, ${e.clientY - 240}px, 0)`;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-0 hidden h-[480px] w-[480px] rounded-full opacity-20 blur-3xl will-change-transform lg:block"
      style={{
        transform: 'translate3d(-999px, -999px, 0)',
        background:
          'radial-gradient(circle, rgba(22,119,255,0.28) 0%, rgba(135,59,255,0.16) 45%, transparent 72%)',
      }}
    />
  );
}

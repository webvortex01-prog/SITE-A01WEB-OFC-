import React, { useEffect, useState, useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'motion/react';
import { sound } from './audio';

export interface ChapterItem {
  id: string;
  code: string;
  label: string;
}

export const SITE_CHAPTERS: ChapterItem[] = [
  { id: 'inicio', code: '00', label: 'Início' },
  { id: 'portfolio', code: '01', label: 'Portfólio Ao Vivo' },
  { id: 'engenharia', code: '02', label: 'Engenharia 3D' },
  { id: 'ecossistema', code: '03', label: 'Ecossistema & Zap' },
  { id: 'comparativo', code: '04', label: 'Raio-X Comparativo' },
  { id: 'prejuizo', code: '05', label: 'Impacto no Bolso' },
  { id: 'avaliacoes', code: '06', label: 'Avaliações' },
  { id: 'bonus-exclusivo', code: '07', label: 'Bônus R$ 1.030' },
  { id: 'orcamento', code: '08', label: 'Simulador Online' },
  { id: 'faq', code: '09', label: 'Dúvidas (FAQ)' },
];

/**
 * Lightweight hook that ONLY triggers a React state update when the active section ID changes.
 * Prevents 60fps React re-renders during scroll for maximum smoothness (especially over AnyDesk/mobile).
 */
export function useActiveChapter(): string {
  const [activeChapter, setActiveChapter] = useState<string>('inicio');
  const activeRef = useRef<string>('inicio');

  useEffect(() => {
    let rafId: number | null = null;

    const checkChapter = () => {
      const viewportCenter = window.scrollY + window.innerHeight * 0.38;
      let found = SITE_CHAPTERS[0].id;

      for (const ch of SITE_CHAPTERS) {
        const el = document.getElementById(ch.id);
        if (el && viewportCenter >= el.offsetTop) {
          found = ch.id;
        }
      }

      if (found !== activeRef.current) {
        activeRef.current = found;
        setActiveChapter(found);
      }
      rafId = null;
    };

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(checkChapter);
      }
    };

    checkChapter();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return activeChapter;
}

/**
 * Legacy compatibility wrapper
 */
export function useScrollTelemetry() {
  const activeChapter = useActiveChapter();
  return {
    scrollY: 0,
    progress: 0,
    velocity: 0,
    activeChapter,
  };
}

/**
 * 3D Scroll-Scrubbed Reveal Container (Apple/Awwwards style)
 * GPU-compositor optimized (only animates transform & opacity).
 */
interface Scroll3DStageProps {
  children: ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'dramatic';
}

export function Scroll3DStage({
  children,
  className = '',
  intensity = 'medium',
}: Scroll3DStageProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 95%', 'end 5%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.3,
  });

  const scaleRange =
    intensity === 'dramatic'
      ? [0.9, 1, 1, 0.95]
      : intensity === 'medium'
        ? [0.94, 1, 1, 0.97]
        : [0.97, 1, 1, 0.98];

  const yRange =
    intensity === 'dramatic'
      ? [48, 0, 0, -28]
      : intensity === 'medium'
        ? [32, 0, 0, -18]
        : [18, 0, 0, -10];

  const rotateXRange =
    intensity === 'dramatic'
      ? [9, 0, 0, -5]
      : intensity === 'medium'
        ? [5, 0, 0, -3]
        : [2, 0, 0, -1];

  const scale = useTransform(smoothProgress, [0, 0.22, 0.8, 1], scaleRange);
  const opacity = useTransform(smoothProgress, [0, 0.16, 0.86, 1], [0.2, 1, 1, 0.4]);
  const y = useTransform(smoothProgress, [0, 0.22, 0.8, 1], yRange);
  const rotateX = useTransform(smoothProgress, [0, 0.24, 0.8, 1], rotateXRange);

  return (
    <div ref={ref} className={`scrolly-perspective ${className}`}>
      <motion.div
        style={{
          scale,
          opacity,
          y,
          rotateX,
        }}
        className="h-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Sticky Stacking Card Wrapper ("Sobreposição de Cards com Pin")
 */
interface StickyStackCardProps {
  children: ReactNode;
  index: number;
  totalCards: number;
  stickyTop?: number;
  className?: string;
}

export function StickyStackCard({
  children,
  index,
  totalCards,
  stickyTop = 84,
  className = '',
}: StickyStackCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 88%', 'end 12%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 30,
    mass: 0.3,
  });

  const targetScaleDown = Math.max(0.93, 1 - (totalCards - 1 - index) * 0.022);
  const scale = useTransform(
    smoothProgress,
    [0, 0.2, 0.68, 1],
    [0.95, 1, 1, index === totalCards - 1 ? 1 : targetScaleDown]
  );
  const opacity = useTransform(
    smoothProgress,
    [0, 0.16, 0.75, 1],
    [0.25, 1, 1, index === totalCards - 1 ? 1 : 0.86]
  );
  const y = useTransform(smoothProgress, [0, 0.2, 0.78, 1], [28, 0, 0, -8]);

  const computedTop = stickyTop + index * 18;

  return (
    <div
      ref={containerRef}
      style={{ top: `${computedTop}px`, zIndex: 10 + index }}
      className={`relative lg:sticky ${className}`}
    >
      <motion.div
        style={{
          scale,
          opacity,
          y,
          transformOrigin: 'top center',
        }}
        className="scrolly-stack-shadow rounded-2xl will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Parallax Layer that translates vertically according to scroll progress
 */
interface ScrollParallaxItemProps {
  children: ReactNode;
  offsetY?: number;
  className?: string;
}

export function ScrollParallaxItem({
  children,
  offsetY = 26,
  className = '',
}: ScrollParallaxItemProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 28,
    mass: 0.3,
  });

  const y = useTransform(smooth, [0, 0.5, 1], [offsetY, 0, -offsetY]);
  const scale = useTransform(smooth, [0, 0.18, 0.82, 1], [0.96, 1, 1, 0.97]);
  const opacity = useTransform(smooth, [0, 0.14, 0.88, 1], [0.3, 1, 1, 0.45]);

  return (
    <motion.div ref={ref} style={{ y, scale, opacity }} className={`will-change-transform ${className}`}>
      {children}
    </motion.div>
  );
}

/**
 * Floating Awwwards/Apple Scrollytelling Chapter Navigation Rail
 * Updates percentage via DOM ref to avoid React re-renders during scroll!
 */
export function ScrollytellingChapterRail() {
  const activeChapter = useActiveChapter();
  const percentRef = useRef<HTMLSpanElement | null>(null);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (percentRef.current) {
      percentRef.current.textContent = `${Math.round(latest * 100)}%`;
    }
  });

  const scrollToSection = (id: string) => {
    sound.playSelect();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside
      aria-label="Navegação por Capítulos da Página"
      className="fixed right-3 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-1 pointer-events-none"
    >
      <div className="pointer-events-auto p-2 rounded-2xl bg-[#06080F]/92 border border-white/10 shadow-2xl flex flex-col items-end gap-0.5">
        {/* Progress Percentage Readout */}
        <div className="w-full px-2 pb-1.5 mb-1 border-b border-white/10 flex items-center justify-between gap-3 text-[10px] font-mono">
          <span className="text-slate-400">SCROLL</span>
          <span ref={percentRef} className="text-cyan-400 font-bold tabular-nums">
            0%
          </span>
        </div>

        {SITE_CHAPTERS.map((ch) => {
          const isActive = activeChapter === ch.id;
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => scrollToSection(ch.id)}
              title={`Ir para ${ch.label}`}
              className={`group flex items-center gap-2 px-2 py-1 rounded-xl text-[10px] font-mono transition-colors duration-150 cursor-pointer ${isActive
                ? 'bg-cyan-400/15 text-cyan-300 border border-cyan-400/40 font-bold'
                : 'text-slate-500 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
            >
              <span
                className={`transition-all duration-150 overflow-hidden whitespace-nowrap ${isActive
                  ? 'max-w-[130px] opacity-100'
                  : 'max-w-0 opacity-0 group-hover:max-w-[130px] group-hover:opacity-100'
                  }`}
              >
                {ch.label}
              </span>
              <span className={isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'}>
                {ch.code}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full transition-transform duration-200 ${isActive
                  ? 'bg-cyan-400 scale-125 shadow-[0_0_8px_#22d3ee]'
                  : 'bg-slate-700 group-hover:bg-slate-400'
                  }`}
              />
            </button>
          );
        })}
      </div>
    </aside>
  );
}

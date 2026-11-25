import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useIsDesktop } from '../utils/scrollytelling';

interface ScrollReactiveImageProps {
  src: string;
  alt: string;
  badgeText?: string;
  metricText?: string;
  accentColor?: string;
  className?: string;
  aspectClass?: string;
  overlayTitle?: string;
  overlaySubtitle?: string;
  enableScanline?: boolean;
}

function ScrollReactiveImageMobile({
  src,
  alt,
  badgeText,
  metricText,
  accentColor = 'from-cyan-400 to-emerald-400',
  className = '',
  aspectClass = 'h-56 sm:h-64',
  overlayTitle,
  overlaySubtitle,
}: ScrollReactiveImageProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-[#070B14] border border-white/15 ${aspectClass} ${className}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setImgLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          imgLoaded ? 'opacity-90' : 'opacity-0'
        }`}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#06080F] via-[#06080F]/45 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#06080F]/70 via-transparent to-[#06080F]/40 pointer-events-none" />

      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(34,211,238,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,211,238,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {(badgeText || metricText) && (
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
          {badgeText ? (
            <span className="px-2.5 py-1 rounded-lg bg-[#06080F]/85 backdrop-blur-md border border-white/15 text-[10px] font-mono font-extrabold uppercase tracking-wider text-cyan-300 shadow-lg">
              {badgeText}
            </span>
          ) : (
            <span />
          )}

          {metricText && (
            <span
              className={`px-2.5 py-1 rounded-lg bg-gradient-to-r ${accentColor} text-slate-950 text-[10px] font-mono font-extrabold shadow-lg`}
            >
              {metricText}
            </span>
          )}
        </div>
      )}

      {(overlayTitle || overlaySubtitle) && (
        <div className="absolute bottom-3 left-3 right-3 z-10 p-3 rounded-xl bg-[#06080F]/85 backdrop-blur-md border border-white/10">
          {overlayTitle && (
            <div className="text-xs sm:text-sm font-extrabold font-heading text-white truncate">
              {overlayTitle}
            </div>
          )}
          {overlaySubtitle && (
            <div className="text-[11px] text-slate-300 truncate mt-0.5">
              {overlaySubtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Imagem Reativa ao Scroll (Scrollytelling Image Engine)
 * Aplica efeito de parallax interno (zoom + deslocamento vertical suave conforme o usuário rola a página),
 * brilho holográfico no hover e HUD flutuante estilo Apple/Awwwards.
 */
function ScrollReactiveImageDesktop({
  src,
  alt,
  badgeText,
  metricText,
  accentColor = 'from-cyan-400 to-emerald-400',
  className = '',
  aspectClass = 'h-56 sm:h-64',
  overlayTitle,
  overlaySubtitle,
  enableScanline = true,
}: ScrollReactiveImageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 95%', 'end 5%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.35,
  });

  // As the user scrolls past the image, it smoothly pans vertically and scales from 1.16 -> 1.0 -> 1.08
  const imgY = useTransform(smoothProgress, [0, 0.5, 1], ['-10%', '0%', '10%']);
  const imgScale = useTransform(smoothProgress, [0, 0.5, 1], [1.18, 1.03, 1.12]);
  const sheenX = useTransform(smoothProgress, [0, 1], ['-120%', '220%']);

  return (
    <div
      ref={containerRef}
      className={`group relative overflow-hidden rounded-2xl bg-[#070B14] border border-white/15 ${aspectClass} ${className}`}
    >
      {/* Parallax Image Layer */}
      <motion.div
        style={{ y: imgY, scale: imgScale }}
        className="absolute inset-0 w-full h-[122%] -top-[11%] will-change-transform"
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
            imgLoaded ? 'opacity-90' : 'opacity-0'
          }`}
        />
      </motion.div>

      {/* Rich dark cinematic gradient vignette so text/HUD always pops */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#06080F] via-[#06080F]/45 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#06080F]/70 via-transparent to-[#06080F]/40 pointer-events-none" />

      {/* Scroll-driven Holographic Light Sweep */}
      {enableScanline && (
        <motion.div
          style={{ x: sheenX }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent skew-x-12 pointer-events-none"
        />
      )}

      {/* Subtle architectural cyber grid overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(34,211,238,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,211,238,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Top Floating HUD Badges */}
      {(badgeText || metricText) && (
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
          {badgeText ? (
            <span className="px-2.5 py-1 rounded-lg bg-[#06080F]/85 backdrop-blur-md border border-white/15 text-[10px] font-mono font-extrabold uppercase tracking-wider text-cyan-300 shadow-lg">
              {badgeText}
            </span>
          ) : (
            <span />
          )}

          {metricText && (
            <span
              className={`px-2.5 py-1 rounded-lg bg-gradient-to-r ${accentColor} text-slate-950 text-[10px] font-mono font-extrabold shadow-lg`}
            >
              {metricText}
            </span>
          )}
        </div>
      )}

      {/* Bottom Floating Title/Subtitle Overlay */}
      {(overlayTitle || overlaySubtitle) && (
        <div className="absolute bottom-3 left-3 right-3 z-10 p-3 rounded-xl bg-[#06080F]/85 backdrop-blur-md border border-white/10 transition-transform duration-300 group-hover:-translate-y-0.5">
          {overlayTitle && (
            <div className="text-xs sm:text-sm font-extrabold font-heading text-white truncate">
              {overlayTitle}
            </div>
          )}
          {overlaySubtitle && (
            <div className="text-[11px] text-slate-300 truncate mt-0.5">
              {overlaySubtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ScrollReactiveImage(props: ScrollReactiveImageProps) {
  const isDesktop = useIsDesktop();
  if (!isDesktop) {
    return <ScrollReactiveImageMobile {...props} />;
  }
  return <ScrollReactiveImageDesktop {...props} />;
}

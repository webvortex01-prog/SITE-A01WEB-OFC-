import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { ArrowRight, Menu, X, Shield, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import { leadService } from '../services/leadService';
import { useScrollTelemetry } from '../utils/scrollytelling';

interface HeaderProps {
  onOpenContact: () => void;
  onOpenFunnel: () => void;
  onOpenAdmin: () => void;
}

export default function Header({
  onOpenContact,
  onOpenFunnel,
  onOpenAdmin,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newLeadsCount, setNewLeadsCount] = useState(0);
  const { activeChapter } = useScrollTelemetry();
  const { scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateCount = () => {
      const leads = leadService.getLeads();
      setNewLeadsCount(leads.filter((l) => l.status === 'NOVO').length);
    };
    updateCount();
    const unsub = leadService.subscribe(updateCount);
    return () => unsub();
  }, []);

  const navLinks = [
    { label: 'Projetos Ao Vivo', href: '#portfolio' },
    { label: 'Engenharia 3D', href: '#engenharia' },
    { label: 'Soluções & Zap', href: '#ecossistema' },
    { label: 'Raio-X', href: '#comparativo' },
    { label: 'Bônus R$ 1.030', href: '#bonus-exclusivo' },
    { label: 'Simular Orçamento', href: '#orcamento' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${isScrolled
        ? 'bg-[#06080F]/95 backdrop-blur-md border-b border-white/10'
        : 'bg-[#06080F]/80 backdrop-blur-md border-b border-white/5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-6">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#inicio"
            onClick={() => sound.playClick(600)}
            className="text-xl font-extrabold tracking-tight font-heading text-white whitespace-nowrap shrink-0 focus:outline-none"
          >
            01 WEB
          </a>

          {/* Direct CEO OS System Trigger */}
          <button
            type="button"
            onClick={() => {
              sound.playSelect();
              onOpenAdmin();
            }}
            title="Abrir Sistema Operacional do CEO (ERP & Leads)"
            className="hidden sm:flex relative px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 hover:text-white transition-all cursor-pointer items-center gap-1.5 text-xs font-mono font-bold shadow-md shadow-cyan-950/50"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-[11px] whitespace-nowrap">Sistema CEO</span>
            {newLeadsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-mono font-extrabold text-[10px] animate-pulse">
                {newLeadsCount} 🔥
              </span>
            )}
          </button>
        </div>

        {/* Zone 2: clean single-line text navigation links with active scroll tracking */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          {navLinks.map((link) => {
            const sectionId = link.href.replace('#', '');
            const isActive = activeChapter === sectionId;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={() => sound.playSelect()}
                className={`hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${isActive
                  ? 'text-cyan-300 border-cyan-400 font-semibold'
                  : 'border-transparent hover:border-cyan-400'
                  }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary CTA action for ad traffic */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              sound.playClick(950);
              onOpenFunnel();
            }}
            className="inline-flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs tracking-tight transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer shadow-lg shadow-cyan-950/40"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span className="sm:hidden">Diagnóstico</span>
            <span className="hidden sm:inline">Diagnóstico do Negócio</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-950 hidden sm:inline" />
          </button>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu de navegação'}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#080B14] border-b border-white/10 px-4 pt-3 pb-6 space-y-4">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  sound.playSelect();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/5 hover:text-cyan-300 transition-colors"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 opacity-40" />
              </a>
            ))}

            <button
              type="button"
              onClick={() => {
                sound.playSelect();
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-mono text-cyan-300 hover:bg-white/5 transition-colors text-left"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Painel Administrativo (Leads)
              </span>
              {newLeadsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold text-xs">
                  {newLeadsCount} novos
                </span>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick(900);
                setMobileMenuOpen(false);
                onOpenFunnel();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-extrabold text-sm whitespace-nowrap cursor-pointer shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Fazer Diagnóstico de Qualificação Grátis</span>
            </button>
          </div>
        </div>
      )}
      {/* Scrollytelling Top Laser Progress Bar */}
      <motion.div
        style={{ scaleX: smoothScrollProgress }}
        className="h-[2px] bg-gradient-to-r from-cyan-400 via-emerald-400 to-sky-400 origin-left shadow-[0_0_12px_rgba(34,211,238,0.8)]"
      />
    </header>
  );
}

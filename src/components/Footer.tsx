import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ArrowUp, Shield, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface FooterProps {
  onOpenAdmin?: () => void;
  onOpenFunnel?: () => void;
}

export default function Footer({ onOpenAdmin, onOpenFunnel }: FooterProps) {
  const footerRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['start 98%', 'end end'],
  });

  const smoothFooter = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.4,
  });

  const footerY = useTransform(smoothFooter, [0, 1], [32, 0]);
  const footerScale = useTransform(smoothFooter, [0, 1], [0.97, 1]);
  const footerOpacity = useTransform(smoothFooter, [0, 0.7, 1], [0.35, 1, 1]);

  const scrollToTop = () => {
    sound.playSelect();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      ref={footerRef}
      className="bg-[#04060B] border-t border-white/[0.08] pt-16 pb-12 relative overflow-hidden"
    >
      <motion.div
        style={{ y: footerY, scale: footerScale, opacity: footerOpacity }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/[0.08]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/40 flex items-center justify-center">
                <span className="text-cyan-400 font-extrabold font-heading text-sm">01</span>
              </div>
              <span className="text-lg font-extrabold font-heading tracking-tight text-white">
                01 WEB
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Desenvolvimento de sites rápidos para celular, sistemas gerenciais sob medida e
              automações de atendimento 24/7 no WhatsApp para empresas que anunciam na internet.
            </p>

            <div className="text-xs font-mono text-cyan-400 pt-1">
              SITES MOBILE-FIRST · AUTOMAÇÃO WHATSAPP 24/7 · SISTEMAS SOB MEDIDA
            </div>
          </div>

          {/* Quick Nav */}
          <div className="space-y-3">
            <h5 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Navegação</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#portfolio" className="hover:text-cyan-400 transition-colors">Portfólio Ao Vivo</a>
              </li>
              <li>
                <a href="#ecossistema" className="hover:text-cyan-400 transition-colors">Soluções & Automação</a>
              </li>
              <li>
                <a href="#comparativo" className="hover:text-cyan-400 transition-colors">Comparativo Raio-X</a>
              </li>
              <li>
                <a href="#avaliacoes" className="hover:text-cyan-400 transition-colors">Resultados de Clientes</a>
              </li>
              <li>
                <a href="#orcamento" className="hover:text-cyan-400 transition-colors">Simulador de Orçamento</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-cyan-400 transition-colors">Dúvidas Frequentes</a>
              </li>
            </ul>
          </div>

          {/* Real Live Models */}
          <div className="space-y-3">
            <h5 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Projetos Ao Vivo</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="#portfolio" className="hover:text-cyan-400 transition-colors">Aldo Leão Advocacia</a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-cyan-400 transition-colors">GRV Motors Multimarcas</a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-cyan-400 transition-colors">Studio Salão de Beleza</a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-cyan-400 transition-colors">Flagship Loja de Roupas</a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-cyan-400 transition-colors">Clínica Estética Exemplar</a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-cyan-400 transition-colors">Private Tattoo Studio</a>
              </li>
            </ul>
          </div>

          {/* Contact & Direct Channel */}
          <div className="space-y-3">
            <h5 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Contato & Funil</h5>
            <div className="space-y-2 text-xs text-slate-400">
              <p>
                WhatsApp:{' '}
                <a
                  href="https://wa.me/5566999697087?text=Ol%C3%A1%2001%20WEB!%20Vim%20pelo%20site%20e%20quero%20falar%20sobre%20um%20projeto."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-mono font-bold underline"
                >
                  (66) 99969-7087 · 24/7
                </a>
              </p>
              <p>E-mail: <span className="text-cyan-400 font-mono">webvortex01@gmail.com</span></p>
              <p>Atendimento em todo o Brasil</p>
              <div className="pt-2 flex flex-col gap-1.5">
                {onOpenFunnel && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onOpenFunnel();
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:text-white font-bold cursor-pointer text-left"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Diagnóstico de Qualificação Grátis →</span>
                  </button>
                )}
                <a
                  href="#orcamento"
                  onClick={() => sound.playClick()}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 cursor-pointer"
                >
                  <span>Simulador de Orçamento Online →</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-4 flex-wrap">
            <span>© {new Date().getFullYear()} 01 WEB Digital · Engenharia de Alta Conversão.</span>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  onOpenAdmin();
                }}
                className="text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>Acesso Painel Admin</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Voltar ao topo da página"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B0F1A] border border-white/10 hover:border-cyan-500/40 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <span>Topo</span>
            <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </motion.div>
    </footer>
  );
}

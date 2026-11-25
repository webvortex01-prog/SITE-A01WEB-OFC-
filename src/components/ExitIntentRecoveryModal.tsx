import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  X,
  Gift,
  Bot,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { leadService } from '../services/leadService';
import { pixelService } from '../services/pixelService';

const QUICK_NICHES = [
  'Advocacia & Jurídico',
  'Loja de Carros & Showroom',
  'Clínica & Estética',
  'Salão & Barbearia',
  'Loja / E-commerce',
  'Serviços / Outro',
];

export default function ExitIntentRecoveryModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [selectedNiche, setSelectedNiche] = useState<string>(QUICK_NICHES[0]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const lastScrollY = useRef<number>(0);
  const lastMouseY = useRef<number>(500);
  const lastTriggerTime = useRef<number>(0);
  const hasConvertedRef = useRef<boolean>(false);

  const triggerExitModal = () => {
    if (hasConvertedRef.current) return;
    const now = Date.now();
    // Cooldown of 12 seconds between automatic triggers so you can test it easily multiple times!
    if (now - lastTriggerTime.current < 12000) return;
    lastTriggerTime.current = now;
    sound.playSelect();
    setIsOpen(true);
  };

  // Format phone as (XX) XXXXX-XXXX and silently auto-capture as soon as 10+ digits are typed!
  const handlePhoneChange = (rawInput: string) => {
    const digits = rawInput.replace(/\D/g, '').slice(0, 11);
    let formatted = digits;
    if (digits.length > 2) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length > 7) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
    setWhatsapp(formatted);

    // Silent Auto-Capture even if user closes the tab before clicking submit!
    if (digits.length >= 10) {
      leadService.captureAbandonedLead({
        name: name.trim() || 'Visitante (Gatilho de Saída)',
        whatsapp: digits,
        segment: selectedNiche,
        contextNote: `Digitou o WhatsApp no Gatilho de Saída (Exit-Intent) interessado em ${selectedNiche}.`,
      });
    }
  };

  useEffect(() => {
    // LAYER 1: Early Top-Bar Mouse Detection (Works via AnyDesk & Desktop before cursor even reaches the browser X!)
    const handleMouseMove = (e: MouseEvent) => {
      const movingUp = e.clientY < lastMouseY.current;
      // When cursor moves up into the top 45px zone (heading toward the tab bar / X button)
      if (movingUp && e.clientY <= 45 && lastMouseY.current > 45) {
        triggerExitModal();
      }
      lastMouseY.current = e.clientY;
    };

    // LAYER 2: Mouse leaves viewport toward top/sides
    const handleMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 80) {
        triggerExitModal();
      }
    };

    // LAYER 3: True Browser 'X' Close Tab / Reload Blocker (beforeunload)
    // Stops the browser tab from closing immediately and opens our Voucher Modal behind the confirmation!
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasConvertedRef.current) return;
      setIsOpen(true);
      e.preventDefault();
      e.returnValue =
        'Espera! Seu Voucher de R$ 1.030 (1 Ano de Domínio e Hospedagem Grátis) ainda não foi salvo no seu WhatsApp!';
      return e.returnValue;
    };

    // LAYER 4: Browser / Mobile "Back" Button Interceptor (popstate)
    window.history.pushState({ exitGuard: true }, '');
    const handlePopState = () => {
      if (!hasConvertedRef.current) {
        window.history.pushState({ exitGuard: true }, '');
        triggerExitModal();
      }
    };

    // LAYER 5: Mobile Fast Scroll-Up Detection
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      if (currentY > 900 && delta < -95) {
        triggerExitModal();
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClaimExitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = whatsapp.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      sound.playClick(260);
      return;
    }

    hasConvertedRef.current = true;
    sound.playSuccess();
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22d3ee', '#10b981', '#fbbf24', '#ffffff'],
      });
    } catch {
      // ignore
    }

    // Save/Update in CEO Admin Panel as Hot Recovery Lead with AI Recovery Script
    leadService.addLead({
      name: name.trim() || 'Cliente VIP (Voucher Saída)',
      businessName: selectedNiche,
      whatsapp: cleanDigits,
      segment: selectedNiche,
      bottleneck: 'ads_no_conversion',
      bottleneckLabel: '🚨 Visualizou o Site e Não Fechou (Resgatou Voucher no Gatilho de Saída)',
      problemDetails: `Visitante ia sair do site e deixou o WhatsApp para guardar o Voucher de R$ 1.030 (1 Ano de Domínio + Hospedagem Grátis) para o nicho de ${selectedNiche}.`,
      need: 'combo_completo',
      needLabel: 'Estrutura 01 WEB + Voucher Bônus R$ 1.030',
      urgency: 'imediato',
      urgencyLabel: 'Recuperação de Saída (Quente)',
      investmentTier: '1000_2500',
      investmentRange: 'R$ 1.000 a R$ 2.500',
      budgetEstimate: 1850,
      temperature: 'HOT',
      score: 98,
      source: 'funil_anuncio',
      diagnosticSummary:
        'Capturado pelo Robô de Intenção de Saída. Chamar com o script de recuperação ("Vi que você visualizou lá e não fechou...")!',
      notes:
        '🚨 LEAD DO GATILHO DE SAÍDA: Deixou o WhatsApp antes de fechar a aba para garantir o bônus de R$ 1.030.',
    });

    setIsCompleted(true);

    // Send message to RD's official WhatsApp (5566999697087)
    const waText = encodeURIComponent(
      `🎁 *VOUCHER DE R$ 1.030 + MODELOS SALVOS — 01 WEB*\n\n` +
        `👤 *Nome:* ${name.trim() || 'Cliente'}\n` +
        `📱 *Meu WhatsApp:* ${whatsapp}\n` +
        `🎯 *Meu Ramo:* ${selectedNiche}\n` +
        pixelService.formatUtmForWhatsApp() +
        `\n\n_Estava navegando no site da 01 WEB e quero deixar salvo meu Voucher de 1 Ano de Domínio .com.br + Hospedagem VIP Grátis e receber os exemplos do meu nicho!_`
    );

    setTimeout(() => {
      window.open(`https://wa.me/5566999697087?text=${waText}`, '_blank', 'noopener,noreferrer');
    }, 450);
  };

  return (
    <>
      {/* Discrete Floating Trigger Button on Bottom-Left so user (or RD testing) can trigger anytime */}
      <div className="fixed bottom-5 left-4 z-40">
        <button
          type="button"
          onClick={() => {
            sound.playSelect();
            setIsOpen(true);
          }}
          className="group inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#090F1E]/95 hover:bg-[#0D172E] border border-amber-400/40 text-amber-300 text-xs font-mono font-bold shadow-2xl backdrop-blur-md cursor-pointer transition-all hover:scale-105"
          title="Garantir Voucher de R$ 1.030 no WhatsApp"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          </span>
          <Gift className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Guardar Bônus R$ 1.030 no Meu Zap</span>
          <span className="sm:hidden">Bônus R$ 1.030</span>
        </button>
      </div>

      {/* Exit-Intent & Recovery Robot Modal */}
      <AnimatePresence>
        {isOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl rounded-3xl bg-gradient-to-br from-[#0B1326] via-[#070B14] to-[#081A1C] border-2 border-cyan-400/60 shadow-[0_25px_90px_-15px_rgba(34,211,238,0.45)] overflow-hidden my-auto text-left"
            >
              {/* Top Urgent Banner */}
              <div className="px-5 py-3.5 bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400 text-slate-950 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-wider">
                  <Bot className="w-4 h-4 stroke-[2.5]" />
                  <span>ROBÔ DE BENEFÍCIOS 01 WEB · NÃO SAIA DE MÃOS VAZIAS!</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Fechar"
                  className="p-1 rounded-lg bg-slate-950/15 hover:bg-slate-950/30 text-slate-950 cursor-pointer"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-5">
                {!isCompleted ? (
                  <>
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-[11px] font-mono font-bold">
                        <Gift className="w-3.5 h-3.5 text-amber-400" />
                        <span>VOUCHER DE R$ 1.030 LIBERADO PARA O SEU NÚMERO</span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white leading-tight">
                        Espera! Antes de sair,{' '}
                        <span className="text-gradient-animated">
                          salve os Modelos + 1 Ano de Hospedagem Grátis no Seu WhatsApp!
                        </span>
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Não precisa fechar nada agora. Digite seu WhatsApp abaixo para nosso sistema
                        deixar registrado no seu número o{' '}
                        <strong className="text-emerald-300">
                          Bônus de 1 Ano de Domínio (.com.br) + 12 Meses de Hospedagem VIP Grátis
                        </strong>{' '}
                        e te enviar os links dos projetos para você avaliar com calma:
                      </p>
                    </div>

                    {/* 3 Quick Reasons Box */}
                    <div className="p-4 rounded-2xl bg-[#050811] border border-white/10 space-y-2 text-xs">
                      <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                        O QUE VOCÊ GARANTE DEIXANDO SEU WHATSAPP AGORA:
                      </div>
                      <div className="flex items-center gap-2 text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>
                          <strong>Economia de R$ 1.030:</strong> Domínio .com.br + 1 Ano de
                          Hospedagem salvos no seu CPF/CNPJ
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>
                          <strong>Links de Teste no Celular:</strong> Receba os 6 modelos no seu
                          WhatsApp para abrir quando quiser
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>
                          <strong>Diagnóstico por IA Grátis:</strong> Sugestão da estrutura ideal
                          para o seu ramo
                        </span>
                      </div>
                    </div>

                    <form onSubmit={handleClaimExitOffer} className="space-y-3.5">
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1.5">
                          1. Escolha seu Ramo:
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {QUICK_NICHES.map((niche) => (
                            <button
                              key={niche}
                              type="button"
                              onClick={() => {
                                sound.playSelect();
                                setSelectedNiche(niche);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                selectedNiche === niche
                                  ? 'bg-cyan-400 text-slate-950 font-bold'
                                  : 'bg-slate-900 text-slate-300 hover:text-white border border-white/10'
                              }`}
                            >
                              {niche}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                            2. Seu Nome:
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Carlos Silva"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase text-emerald-300 font-bold mb-1">
                            3. Seu WhatsApp (com DDD) *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="(66) 99999-9999"
                            value={whatsapp}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            className="w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-emerald-400/50 text-white placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-400"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-950/60 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-slate-950" />
                        <span>Salvar Voucher de R$ 1.030 + Receber Modelos no Meu Zap</span>
                        <ArrowRight className="w-4 h-4 text-slate-950" />
                      </button>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Zero Spam ·
                          Atendimento Direto
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsOpen(false)}
                          className="text-slate-500 hover:text-slate-300 underline cursor-pointer"
                        >
                          Continuar vendo o site
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="text-center space-y-5 py-3">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-400/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>

                    <div className="space-y-1.5">
                      <span className="px-3 py-1 rounded-full bg-emerald-400/15 text-emerald-300 font-mono text-xs font-bold">
                        ✓ VOUCHER VINCULADO AO NÚMERO {whatsapp}
                      </span>
                      <h3 className="text-2xl font-extrabold font-heading text-white">
                        Tudo Pronto, {name || 'Parceiro'}!
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                        Seu número já foi registrado no nosso Painel Prioritário com o Voucher de{' '}
                        <strong className="text-emerald-300">
                          1 Ano de Domínio + Hospedagem Grátis
                        </strong>
                        !
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 text-slate-950 font-extrabold text-xs cursor-pointer"
                    >
                      <span>Voltar para o Site</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

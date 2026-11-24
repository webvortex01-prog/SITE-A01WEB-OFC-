import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Clock,
  Lock,
  Sparkles,
  XCircle,
  AlertTriangle,
  Zap,
  Trophy,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { Scroll3DStage } from '../utils/scrollytelling';
import ScrollReactiveImage from './ScrollReactiveImage';

interface GuaranteeSectionProps {
  onOpenFunnel: () => void;
}

export function GuaranteeRiskReversalSection({ onOpenFunnel }: GuaranteeSectionProps) {
  const comparisonRows = [
    {
      criteria: 'Tempo de Entrega',
      amateur: 'Some no meio do projeto ou atrasa semanas',
      traditional: '30 a 60 dias de reuniões intermináveis',
      zeroOneWeb: 'Pronto e no ar em 3 a 7 dias úteis',
    },
    {
      criteria: 'Velocidade no Celular (4G/5G)',
      amateur: 'Lento (5s+), trava e faz o cliente fechar a aba',
      traditional: 'WordPress pesado cheio de plugins lentos',
      zeroOneWeb: 'Abertura instantânea (< 0.8s) · Nota 99-100',
    },
    {
      criteria: 'Triagem & Automação WhatsApp',
      amateur: 'Apenas um link solto sem filtro nenhum',
      traditional: 'Cobram R$ 2.000+ extras para integrar',
      zeroOneWeb: 'Fluxo inteligente 24/7 já integrado ao seu Zap',
    },
    {
      criteria: 'Mensalidade / Aluguel',
      amateur: 'Você fica preso a plataformas pagas',
      traditional: 'R$ 250 a R$ 600/mês de taxa de manutenção',
      zeroOneWeb: 'R$ 0,00/mês · Código 100% seu + 1 Ano Grátis',
    },
    {
      criteria: 'Visual & Percepção de Valor',
      amateur: 'Cara de template copiado e amador',
      traditional: 'Bonito no PC, mas genérico e engessado',
      zeroOneWeb: 'Scrollytelling 3D nível Apple / Awwwards',
    },
  ];

  return (
    <section className="py-20 relative overflow-x-clip bg-[#06080F] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* =====================================================================
            PART 1: MATADOR DE OBJEÇÕES — COMPARATIVO BRUTAL DE MERCADO
           ===================================================================== */}
        <Scroll3DStage intensity="medium">
          <div className="space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold">
                <Trophy className="w-3.5 h-3.5 text-cyan-400" />
                <span>COMPARATIVO HONESTO DE MERCADO · POR QUE A 01 WEB VENCE</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
                Por Que Empresários Inteligentes Trocam{' '}
                <span className="text-gradient-animated">Agências Lentas Pela 01 WEB?</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base">
                Compare na ponta do lápis o que você leva contratando um curioso barato, uma
                agência tradicional burocrática ou a engenharia direta da{' '}
                <strong className="text-white">01 WEB</strong>:
              </p>
            </div>

            {/* 3-Column Comparison Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Col 1: Curioso / Template Amador */}
              <div className="lg:col-span-4 rounded-3xl p-6 bg-[#0B0D14] border border-rose-500/25 flex flex-col justify-between space-y-5 opacity-85">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-xs font-mono uppercase text-rose-400 font-bold flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-400" />
                      1. Curioso / Template Pronto
                    </span>
                    <span className="text-[11px] font-mono text-rose-300">Sai Caro no Final</span>
                  </div>

                  <div className="space-y-3">
                    {comparisonRows.map((row) => (
                      <div
                        key={row.criteria}
                        className="p-3 rounded-xl bg-rose-950/15 border border-rose-500/15 space-y-0.5"
                      >
                        <div className="text-[10px] font-mono uppercase text-slate-400">
                          {row.criteria}
                        </div>
                        <div className="text-xs text-rose-200/90 flex items-start gap-2">
                          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>{row.amateur}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center text-xs font-mono text-rose-300">
                  ❌ Resultado: Queima seu tráfego e passa imagem amadora
                </div>
              </div>

              {/* Col 2: Agência Tradicional */}
              <div className="lg:col-span-4 rounded-3xl p-6 bg-[#0B0E18] border border-amber-500/25 flex flex-col justify-between space-y-5 opacity-90">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-xs font-mono uppercase text-amber-300 font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      2. Agência Tradicional
                    </span>
                    <span className="text-[11px] font-mono text-amber-300">R$ 5.000 a R$ 12.000</span>
                  </div>

                  <div className="space-y-3">
                    {comparisonRows.map((row) => (
                      <div
                        key={row.criteria}
                        className="p-3 rounded-xl bg-amber-950/15 border border-amber-500/15 space-y-0.5"
                      >
                        <div className="text-[10px] font-mono uppercase text-slate-400">
                          {row.criteria}
                        </div>
                        <div className="text-xs text-amber-100/90 flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{row.traditional}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center text-xs font-mono text-amber-300">
                  ⚠️ Resultado: Demora meses e cobra mensalidade eterna
                </div>
              </div>

              {/* Col 3: ENGENHARIA 01 WEB (WINNER) */}
              <div className="lg:col-span-4 rounded-3xl p-6 bg-gradient-to-br from-[#0A1926] via-[#0B1324] to-[#071D1A] border-2 border-cyan-400 shadow-[0_20px_70px_-15px_rgba(34,211,238,0.35)] flex flex-col justify-between space-y-5 relative">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-cyan-400/30">
                    <span className="text-xs font-mono uppercase text-cyan-300 font-extrabold flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                      3. PADRÃO 01 WEB
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-mono text-[10px] font-extrabold">
                      MELHOR ESCOLHA
                    </span>
                  </div>

                  <div className="space-y-3">
                    {comparisonRows.map((row) => (
                      <div
                        key={row.criteria}
                        className="p-3 rounded-xl bg-[#060912]/90 border border-emerald-400/35 space-y-0.5"
                      >
                        <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                          {row.criteria}
                        </div>
                        <div className="text-xs font-bold text-white flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{row.zeroOneWeb}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playSuccess();
                    onOpenFunnel();
                  }}
                  className="btn-cyber-primary w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Quero a Estrutura 01 WEB no Meu Negócio</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>
          </div>
        </Scroll3DStage>

        {/* =====================================================================
            PART 2: TRIPLA GARANTIA BLINDADA 01 WEB + IMAGEM REATIVA AO SCROLL
           ===================================================================== */}
        <Scroll3DStage intensity="medium">
          <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#0B1324] via-[#080B14] to-[#0A1922] border border-emerald-500/40 shadow-2xl space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-6 border-b border-white/10">
              <div className="lg:col-span-7 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>RISCO ZERO · TRIPLA GARANTIA BLINDADA 01 WEB</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
                  Você Só Aprova Quando Estiver{' '}
                  <span className="text-gradient-animated">100% Orgulhoso do Resultado.</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Nada de pagar no escuro. Você acompanha o preview ao vivo pelo seu celular, pede
                  ajustes direto no nosso WhatsApp e recebe 100% do código-fonte e domínio no nome
                  da sua empresa.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick(950);
                      onOpenFunnel();
                    }}
                    className="btn-cyber-primary inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-xs sm:text-sm cursor-pointer shadow-lg"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Garantir Meu Projeto com Risco Zero</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <ScrollReactiveImage
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=85"
                  alt="Garantia Blindada e Segurança Digital 01 WEB"
                  badgeText="COMPROMISSO 01 WEB"
                  metricText="100% GARANTIDO"
                  accentColor="from-emerald-400 to-cyan-400"
                  aspectClass="h-48 sm:h-52"
                  overlayTitle="Código 100% Seu + Domínio Oficial .com.br"
                  overlaySubtitle="Liberdade total sem taxas ocultas nem aluguel mensal"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-[#06080F]/90 border border-white/10 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono text-emerald-400 font-bold">
                  01. APROVAÇÃO VISUAL GARANTIDA
                </div>
                <h3 className="text-base font-bold font-heading text-white">
                  Preview Ao Vivo Antes da Entrega Final
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Você acompanha o link de desenvolvimento em tempo real e ajustamos cores, textos
                  e seções até ficar exatamente como você imaginou.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#06080F]/90 border border-white/10 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono text-cyan-400 font-bold">
                  02. PRAZO BLINDADO (3 A 7 DIAS)
                </div>
                <h3 className="text-base font-bold font-heading text-white">
                  Zero Enrolação · Cronograma Ágil
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Enquanto agências tradicionais demoram 45 a 60 dias para entregar um site básico,
                  nossa engenharia própria coloca sua estrutura no ar na mesma semana.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#06080F]/90 border border-white/10 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono text-amber-400 font-bold">
                  03. PROPRIEDADE 100% SUA
                </div>
                <h3 className="text-base font-bold font-heading text-white">
                  Sem Aluguel Mensal Obrigatório
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  O código-fonte, o domínio .com.br e o painel administrativo pertencem 100% à sua
                  empresa. Você nunca fica refém de mensalidades abusivas.
                </p>
              </div>
            </div>
          </div>
        </Scroll3DStage>
      </div>
    </section>
  );
}

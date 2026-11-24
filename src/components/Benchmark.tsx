import { useState } from 'react';
import {
  Gauge,
  Timer,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Server,
  Zap,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { sound } from '../utils/audio';

export default function Benchmark() {
  const [selectedTab, setSelectedTab] = useState<'speed' | 'conversion' | 'security'>('speed');

  return (
    <section id="benchmark" className="py-24 relative overflow-hidden bg-[#05060b]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[400px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span>Engenharia Comparada</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            01 WEB vs{' '}
            <span className="text-slate-500 line-through">Sites Comuns do Mercado</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            A maioria das agências cria sites pesados em WordPress ou Wix com dezenas de plugins que
            travam o celular do cliente. Veja a diferença técnica brutal:
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Competitor / Old-school Site */}
          <div className="rounded-3xl p-8 bg-[#090b14] border border-rose-500/20 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold">
                  ❌ Sites Comuns (WordPress / Wix / Temas Prontos)
                </span>
                <span className="text-xs font-mono text-rose-400">Desempenho Crítico</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-bold font-heading text-white">
                  O "Barato" Que Custa Milhares de Clientes
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Parece funcional no primeiro dia, mas com o passar dos meses vira um pesadelo de lentidão,
                  erros de banco de dados e invasões de spam.
                </p>
              </div>

              {/* Weak Points */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20 flex items-start gap-3">
                  <Timer className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-rose-200">Carregamento Lento: 4.8 a 7.2 segundos</div>
                    <div className="text-xs text-slate-400">
                      Segundo o Google, cada 1 segundo de atraso reduz as conversões em 20%.
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20 flex items-start gap-3">
                  <TrendingDown className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-rose-200">Taxa de Rejeição de 64% no 4G</div>
                    <div className="text-xs text-slate-400">
                      O cliente clica no link do seu anúncio ou Instagram, a tela fica em branco e ele desiste.
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-rose-200">Vulnerabilidade a Invasões</div>
                    <div className="text-xs text-slate-400">
                      Dezenas de plugins PHP vulneráveis que quebram o site quando atualizados.
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20 flex items-start gap-3">
                  <Server className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-rose-200">Mensalidades e Hospedagens Caras</div>
                    <div className="text-xs text-slate-400">
                      Você paga R$ 50 a R$ 150 todo mês para manter um servidor compartilhado arrastado.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 text-center">
              Média de pontuação PageSpeed: <strong className="text-rose-400">38/100</strong>
            </div>
          </div>

          {/* 01 WEB Elite Platform */}
          <div className="relative rounded-3xl p-8 bg-gradient-to-b from-[#0b1222] to-[#070a14] border-2 border-cyan-400 shadow-2xl shadow-cyan-500/20 flex flex-col justify-between space-y-6">
            {/* Top highlight badge */}
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-400/40 flex items-center gap-1 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PADRÃO 01 WEB</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
                  ⚡ 01 WEB Arquitetura Reativa de Alta Performance
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">Liderança Absoluta</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-bold font-heading text-white">
                  Velocidade Instantânea e Conversão Máxima
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Desenvolvemos código nativo moderno distribuído globalmente em redes Edge CDN. Seu site
                  abre como um aplicativo instantâneo.
                </p>
              </div>

              {/* Strong Points */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-3">
                  <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-cyan-200">Abertura em 0.28 segundos</div>
                    <div className="text-xs text-slate-300">
                      O clique abre imediatamente, sem esperar telas de carregamento ou engasgos no celular.
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-emerald-200">Taxa de Conversão de até 4.8%</div>
                    <div className="text-xs text-slate-300">
                      Botões de WhatsApp rápidos e jornada sem atrito geram 3 a 4x mais pedidos e orçamentos.
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-purple-200">100% Seguro & Blindado</div>
                    <div className="text-xs text-slate-300">
                      Sem brechas de plugins legados. Certificado de segurança SSL militar incluso.
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-3">
                  <Server className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-amber-200">1º ANO de Hospedagem & Domínio Grátis</div>
                    <div className="text-xs text-slate-300">
                      Para os 10 primeiros clientes da nossa inauguração, nós bancamos toda a infraestrutura!
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
              <div className="p-2 px-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                Média PageSpeed: 99 a 100/100 🚀
              </div>
              <a
                href="#orcamento"
                onClick={() => sound.playClick()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-md shadow-cyan-400/30 transition-all hover:scale-105"
              >
                <span>Migrar Para a 01 Web</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

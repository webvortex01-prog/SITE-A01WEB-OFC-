import { Palette, Zap, Target, Cpu, Check, ArrowRight, Bot, Workflow, Wrench } from 'lucide-react';
import { sound } from '../utils/audio';

export default function Pillars() {
  const pillars = [
    {
      icon: Palette,
      tag: 'Front-End de Elite',
      title: 'Websites & Landing Pages Imersivas',
      color: 'from-cyan-500 to-blue-600',
      borderGlow: 'border-cyan-500/30',
      textColor: 'text-cyan-400',
      description:
        'Não fazemos páginas genéricas. Criamos interfaces dark luxury com microinterações a 60 FPS e carregamento instantâneo de 0.28s que multiplicam a autoridade do seu negócio.',
      benefits: [
        'PageSpeed oficial do Google 99/100 cravado',
        'Experiência 100% responsiva para celulares com animações fluídas',
        'Autoridade imediata: eleva o valor percebido do seu produto ou serviço',
      ],
    },
    {
      icon: Cpu,
      tag: 'Engenharia de Software',
      title: 'Sistemas Web & Painéis do CEO Sob Medida',
      color: 'from-indigo-500 to-purple-600',
      borderGlow: 'border-indigo-500/30',
      textColor: 'text-indigo-400',
      description:
        'Esqueça softwares engessados com mensalidades abusivas e planilhas de Excel que quebram. Desenvolvemos sistemas exclusivos moldados exatamente para a regra da sua operação.',
      benefits: [
        'Painel administrativo completo com métricas e faturamento em tempo real',
        'Acesso seguro para múltiplos funcionários com níveis de permissão',
        'Banco de dados em nuvem criptografado com backup diário automático',
      ],
    },
    {
      icon: Bot,
      tag: 'Fluxo Acelerado',
      title: 'Automações de Atendimento & WhatsApp 24/7',
      color: 'from-purple-500 to-pink-600',
      borderGlow: 'border-purple-500/30',
      textColor: 'text-purple-400',
      description:
        'Seu cliente não quer esperar. Criamos fluxos inteligentes no WhatsApp que respondem em 2 segundos, tiram dúvidas, agendam horários e recebem pagamentos dia e noite.',
      benefits: [
        'Atendimento imediato mesmo fora do horário comercial (noites e feriados)',
        'Qualificação de leads automática para enviar contatos quentes para o time',
        'Checkout PIX com confirmação em tempo real e emissão de comprovante',
      ],
    },
    {
      icon: Wrench,
      tag: 'Solução Integral',
      title: 'Resolução de Qualquer Problema Digital',
      color: 'from-amber-400 to-orange-500',
      borderGlow: 'border-amber-500/30',
      textColor: 'text-amber-400',
      description:
        'Não importa a complexidade ou a trava técnica: nós resolvemos. Integramos sistemas legados, gateways de pagamento, CRMs, APIs externas e desenhamos a infraestrutura ideal.',
      benefits: [
        'Conexão de APIs (WhatsApp, Asaas, Mercado Pago, Pagar.me, etc.)',
        'Eliminação de processos manuais lentos que custam horas da sua equipe',
        'Consultoria técnica com engenheiros de software dedicados',
      ],
    },
  ];

  return (
    <section id="pilares" className="py-24 relative overflow-hidden bg-[#070913]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono uppercase tracking-wider">
            <span>4 Pilares de Excelência 01 Web</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Por que a 01 Web é{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Infinitamente Superior
            </span>
            ?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Não somos apenas designers de layout. Construímos a infraestrutura digital completa da sua empresa
            para gerar vendas automáticas, velocidade extrema e autoridade absoluta.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className={`relative group rounded-3xl p-8 bg-[#0b0f1d]/90 border ${pillar.borderGlow} shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
              >
                {/* Accent glow on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-all duration-500 pointer-events-none" />

                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${pillar.color} p-[2px] shadow-lg`}
                  >
                    <div className="w-full h-full bg-[#0a0d18] rounded-[14px] flex items-center justify-center">
                      <Icon className={`w-7 h-7 ${pillar.textColor}`} />
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                    {pillar.tag}
                  </span>
                </div>

                <h3 className="text-2xl font-bold font-heading text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {pillar.description}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
                  {pillar.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <div className="mt-0.5 p-0.5 rounded-full bg-cyan-500/20 text-cyan-400 shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner Callout */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-[#0d1424] to-indigo-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-bold text-white font-heading">
              Cansado de perder vendas por atendimento lento ou site amador?
            </h4>
            <p className="text-sm text-slate-400">
              Faça uma simulação sem compromisso e veja quanto seu negócio pode economizar e lucrar.
            </p>
          </div>
          <a
            href="#orcamento"
            onClick={() => sound.playClick()}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-400/20 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <span>Simular Investimento</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </a>
        </div>
      </div>
    </section>
  );
}

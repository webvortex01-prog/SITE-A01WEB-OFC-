import { useState, useId, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Check,
  CheckCircle2,
  Clock,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Copy,
} from 'lucide-react';
import {
  BASE_PRICES,
  AVAILABLE_FEATURES,
  calculateProjectTotal,
  calculateProjectDeliverySpecs,
  ProjectConfig,
  BottleneckType,
} from '../utils/calculator';
import { sound } from '../utils/audio';
import { leadService } from '../services/leadService';
import { Scroll3DStage } from '../utils/scrollytelling';
import { pixelService, InvestmentTier } from '../services/pixelService';

interface BudgetCalculatorProps {
  initialProjectName?: string;
  selectedDiagnosticPreset?: BottleneckType;
}

export default function BudgetCalculator({
  initialProjectName,
  selectedDiagnosticPreset,
}: BudgetCalculatorProps) {
  const [projectType, setProjectType] = useState<ProjectConfig['projectType']>('both');
  const [pagesCount, setPagesCount] = useState<number>(3);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'smart_booking',
    'pix_checkout',
  ]);
  const [clientName, setClientName] = useState<string>('');
  const [clientWhatsapp, setClientWhatsapp] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [clientProblem, setClientProblem] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const pagesSliderId = useId();

  // Sync preset when user clicks "Configurar Este Projeto no Simulador" from Diagnostic
  useEffect(() => {
    if (!selectedDiagnosticPreset) return;
    if (selectedDiagnosticPreset === 'no_site') {
      setProjectType('page');
      setPagesCount(1);
      setSelectedFeatures([]);
    } else if (selectedDiagnosticPreset === 'slow_site') {
      setProjectType('page');
      setPagesCount(2);
      setSelectedFeatures(['seo_max']);
    } else if (selectedDiagnosticPreset === 'whatsapp_delay') {
      setProjectType('page');
      setPagesCount(1);
      setSelectedFeatures(['whatsapp_automation']);
    } else if (selectedDiagnosticPreset === 'manual_management') {
      setProjectType('both');
      setPagesCount(3);
      setSelectedFeatures(['ceo_dashboard', 'smart_booking']);
    }
  }, [selectedDiagnosticPreset]);

  const total = calculateProjectTotal({
    projectType,
    pagesCount,
    features: selectedFeatures,
  });

  const deliverySpecs = calculateProjectDeliverySpecs(projectType, pagesCount);

  const projectTypeOptions: {
    id: ProjectConfig['projectType'];
    title: string;
    subtitle: string;
    basePrice: number;
    highlight?: string;
  }[] = [
    {
      id: 'page',
      title: 'Landing Page Profissional',
      subtitle:
        'Página enxuta e direta ao ponto para divulgar seus serviços e receber contatos no WhatsApp.',
      basePrice: BASE_PRICES.page,
    },
    {
      id: 'portal',
      title: 'Site Institucional Multi-Páginas',
      subtitle:
        'Estrutura completa com áreas de atuação, apresentação da empresa, galeria e localização.',
      basePrice: BASE_PRICES.portal,
    },
    {
      id: 'panel',
      title: 'Painel Gerencial / Sistema Sob Medida',
      subtitle:
        'Sistema web personalizado para organizar agendamentos, clientes, serviços ou pedidos.',
      basePrice: BASE_PRICES.panel,
    },
    {
      id: 'both',
      title: 'Pacote Completo: Site + Painel de Gestão',
      subtitle:
        'Seu site profissional integrado a um painel administrativo feito para a rotina do seu negócio.',
      basePrice: BASE_PRICES.both,
      highlight: 'MAIS ESCOLHIDO · PACOTE COMPLETO',
    },
  ];

  const handleToggleFeature = (id: string) => {
    sound.playSelect();
    pixelService.trackInitiateCheckout('Interagiu no Simulador de Orçamento', total);
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleProjectTypeSelect = (type: ProjectConfig['projectType']) => {
    sound.playSelect();
    pixelService.trackInitiateCheckout('Interagiu no Simulador de Orçamento', total);
    setProjectType(type);
  };

  const handlePagesChange = (val: number) => {
    setPagesCount(val);
    sound.playClick(500 + val * 40);
  };

  const selectedFeatNames = selectedFeatures
    .map((fid) => AVAILABLE_FEATURES.find((f) => f.id === fid)?.name)
    .filter(Boolean)
    .join(', ');

  const projectTypeName = projectTypeOptions.find((p) => p.id === projectType)?.title;

  const derivedInvestmentTier: InvestmentTier =
    total >= 5000
      ? 'acima_5000'
      : total >= 2500
      ? '2500_5000'
      : total >= 1000
      ? '1000_2500'
      : 'ate_500';

  const whatsappMessage = encodeURIComponent(
    `Olá 01 WEB! Montei meu orçamento no site e gostaria de conversar sobre meu projeto:\n\n` +
      `👤 Nome: ${clientName || 'Cliente'}\n` +
      `🏢 Empresa: ${companyName || 'Meu Negócio'}\n` +
      `📱 WhatsApp: ${clientWhatsapp}\n` +
      (clientProblem.trim() ? `⚠️ Problema/Objetivo: ${clientProblem.trim()}\n` : '') +
      `🎯 Modelo de Referência: ${initialProjectName || 'Personalizado'}\n` +
      `🛠️ Estrutura: ${projectTypeName}\n` +
      `📄 Páginas/Módulos: ${pagesCount}\n` +
      `⚡ Recursos: ${selectedFeatNames || 'Estrutura Base'}\n` +
      `💰 Valor Estimado: R$ ${total.toLocaleString('pt-BR')}\n` +
      `✅ Incluso: 1 Ano de Hospedagem + Domínio Próprio` +
      pixelService.formatUtmForWhatsApp()
  );

  const whatsappUrl = `https://wa.me/5566999697087?text=${whatsappMessage}`;

  const handleGenerateQuote = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim() || !clientWhatsapp.trim()) {
      sound.playClick(250);
      return;
    }

    sound.playSuccess();

    try {
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.65 },
        colors: ['#22d3ee', '#38bdf8', '#10b981', '#ffffff'],
      });
    } catch {
      // Ignore in headless environment
    }

    // 1. Register lead into CEO Admin Panel (with automatic AI problem diagnosis & solution)
    leadService.addLead({
      name: clientName.trim(),
      businessName: companyName.trim() || 'Não informada',
      whatsapp: clientWhatsapp.replace(/\D/g, ''),
      segment: companyName.trim() || initialProjectName || 'Personalizado / Geral',
      bottleneck: 'custom_need',
      bottleneckLabel: clientProblem.trim() || 'Calculado no Simulador de Orçamento',
      problemDetails: clientProblem.trim() || `Interesse em ${projectTypeName} com ${selectedFeatNames || 'estrutura base'}`,
      need:
        projectType === 'page'
          ? 'landing_page'
          : projectType === 'portal'
          ? 'site_institucional'
          : projectType === 'panel'
          ? 'sistema_gestao'
          : 'combo_completo',
      needLabel: projectTypeName || 'Projeto Personalizado',
      urgency: 'imediato',
      urgencyLabel: 'Imediato (esta semana)',
      investmentTier: derivedInvestmentTier,
      investmentRange: `R$ ${total.toLocaleString('pt-BR')} (Simulador)`,
      budgetEstimate: total,
      source: 'calculadora_orcamento',
      diagnosticSummary: `Estrutura: ${projectTypeName}. Páginas: ${pagesCount}. Recursos: ${selectedFeatNames || 'Base'}.${
        clientProblem.trim() ? ` Problema relatado: "${clientProblem.trim()}"` : ''
      }`,
      notes: `Orçamento montado no simulador online: R$ ${total.toLocaleString('pt-BR')}.${
        clientProblem.trim() ? ` Relato do cliente: "${clientProblem.trim()}"` : ''
      }`,
    });

    setIsSubmitted(true);

    // 2. Automatically open RD's WhatsApp (5566999697087) with the full summary
    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }, 450);
  };

  const copyProposalToClipboard = () => {
    const summaryText =
      `*ORÇAMENTO ONLINE — 01 WEB DIGITAL*\n` +
      `Cliente: ${clientName || 'Cliente'}\n` +
      `Empresa: ${companyName || 'Empresa'}\n` +
      `Estrutura: ${projectTypeName}\n` +
      `Páginas/Seções: ${pagesCount}\n` +
      `Recursos: ${selectedFeatNames || 'Estrutura Base'}\n` +
      `Total Estimado: R$ ${total.toLocaleString('pt-BR')}\n` +
      `Incluso: 1 Ano de Hospedagem + Domínio Próprio`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    sound.playSelect();
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section
      id="orcamento"
      className="py-24 sm:py-32 relative overflow-x-clip bg-[#06080F] border-t border-white/[0.06]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <Scroll3DStage intensity="medium">
          <div className="max-w-3xl space-y-4 mb-14">
            <div className="text-xs font-mono uppercase tracking-[0.16em] text-cyan-400 font-semibold">
              05 / SIMULADOR TRANSPARENTE DE ORÇAMENTO
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight leading-[1.08]">
              Monte a Estrutura da Sua Empresa e Veja o{' '}
              <span className="text-gradient-animated">Valor na Hora.</span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Transparência total do início ao fim. Escolha o tipo de projeto e os recursos que fazem sentido para o seu momento atual e envie o resumo direto para o nosso WhatsApp.
            </p>

            {initialProjectName && (
              <div className="pt-1 text-xs font-mono text-cyan-300">
                Modelo ou solução selecionada: <strong className="text-white">{initialProjectName}</strong>
              </div>
            )}
          </div>
        </Scroll3DStage>

        {/* Calculator Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Configuration */}
          <Scroll3DStage intensity="subtle" className="lg:col-span-7">
            <div className="space-y-8 bg-[#0B0F1A] border border-white/10 rounded-2xl p-6 sm:p-8">
            {/* Step 1: Project Type */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold font-heading text-white">
                  1. Escolha o Tipo de Estrutura
                </span>
                <span className="text-xs font-mono text-slate-400">Pagamento único</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {projectTypeOptions.map((opt) => {
                  const isSelected = projectType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleProjectTypeSelect(opt.id)}
                      className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-400 ring-1 ring-cyan-400/50'
                          : 'bg-[#06080F] border-white/10 hover:border-white/25 text-slate-300'
                      }`}
                    >
                      <div>
                        {opt.highlight && (
                          <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold mb-1.5">
                            {opt.highlight}
                          </div>
                        )}
                        <div className="text-sm font-bold text-white mb-1">{opt.title}</div>
                        <div className="text-xs text-slate-400 leading-relaxed">{opt.subtitle}</div>
                      </div>
                      <div className="pt-3 mt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-mono">Valor Base</span>
                        <span className="font-mono font-bold text-cyan-300 tabular-nums">
                          R$ {opt.basePrice}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Slider Pages Count */}
            <div className="space-y-3 pt-4 border-t border-white/[0.08]">
              <div className="flex items-center justify-between">
                <label
                  htmlFor={pagesSliderId}
                  className="text-sm font-bold font-heading text-white"
                >
                  2. Quantidade de Páginas ou Telas do Projeto
                </label>
                <span className="text-sm font-mono font-bold text-cyan-300 tabular-nums">
                  {pagesCount}{' '}
                  {pagesCount === 1 ? 'Página Única (One Page)' : 'Páginas / Telas'}
                </span>
              </div>
              <input
                id={pagesSliderId}
                type="range"
                min="1"
                max="8"
                step="1"
                value={pagesCount}
                onChange={(e) => handlePagesChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                aria-label="Quantidade de Páginas ou Seções"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>1 (Página Única)</span>
                <span>4 Telas</span>
                <span>8 Telas Completas</span>
              </div>
            </div>

            {/* Step 3: Feature Add-ons Checklist */}
            <div className="space-y-3 pt-4 border-t border-white/[0.08]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold font-heading text-white">
                  3. Recursos Extras & Automações (Opcional)
                </span>
                <span className="text-xs text-slate-400 font-mono">Clique para selecionar</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AVAILABLE_FEATURES.map((feat) => {
                  const isChecked = selectedFeatures.includes(feat.id);
                  return (
                    <button
                      type="button"
                      key={feat.id}
                      onClick={() => handleToggleFeature(feat.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-start gap-3 ${
                        isChecked
                          ? 'bg-cyan-500/10 border-cyan-400/80 text-white'
                          : 'bg-[#06080F] border-white/10 hover:border-white/25 text-slate-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isChecked
                            ? 'bg-cyan-400 text-slate-950 font-bold'
                            : 'border border-slate-700 bg-slate-900'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold leading-tight">{feat.name}</span>
                          <span className="text-[11px] font-mono font-bold text-cyan-300 shrink-0 tabular-nums">
                            +R$ {feat.price}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          {feat.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            </div>
          </Scroll3DStage>

          {/* Right Column: Live Summary & Direct Lead Capture (Pinned on scroll) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="rounded-2xl p-6 sm:p-8 bg-[#0B0F1A] border border-cyan-400/50 scrolly-glow-border shadow-2xl space-y-6">
              {/* Header Box */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] text-xs font-mono">
                <span className="uppercase tracking-wider text-slate-400">
                  RESUMO DO PROJETO · 01 WEB
                </span>
                <span className="text-emerald-400 font-semibold">
                  DOMÍNIO + HOSPEDAGEM INCLUSOS
                </span>
              </div>

              {/* Price Display */}
              <div className="space-y-1 py-1">
                <span className="text-xs uppercase font-mono text-slate-400">
                  Investimento Único Estimado
                </span>
                <motion.div
                  key={total}
                  initial={{ opacity: 0.6, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.16 }}
                  className="text-4xl sm:text-5xl font-extrabold font-heading text-white tracking-tight tabular-nums"
                >
                  R$ {total.toLocaleString('pt-BR')}
                </motion.div>
                <p className="text-xs text-slate-400 pt-1">
                  Sem mensalidades obrigatórias de licença. O projeto é entregue pronto e publicado no nome da sua empresa.
                </p>
              </div>

              {/* Honest Delivery & Guarantee Details */}
              <div className="p-4 rounded-xl bg-[#06080F] border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 font-mono">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>CRONOGRAMA & INCLUSÕES DO PACOTE</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#0B0F1A] border border-white/[0.06]">
                    <span className="text-[11px] text-slate-400 block font-mono">
                      Prazo de Entrega
                    </span>
                    <strong className="text-white text-sm">
                      {deliverySpecs.estimatedDeliveryDays}
                    </strong>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0B0F1A] border border-white/[0.06]">
                    <span className="text-[11px] text-slate-400 block font-mono">
                      Mensalidade de Uso
                    </span>
                    <strong className="text-emerald-400 text-sm tabular-nums">
                      R$ 0,00 / mês
                    </strong>
                  </div>
                </div>
              </div>

              {/* Form or Success State */}
              {!isSubmitted ? (
                <form onSubmit={handleGenerateQuote} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Seu Nome
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Roberto Almeida"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#06080F] border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Seu WhatsApp (com DDD)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: (66) 99969-7087"
                      value={clientWhatsapp}
                      onChange={(e) => {
                        const val = e.target.value;
                        setClientWhatsapp(val);
                        const digits = val.replace(/\D/g, '');
                        if (digits.length >= 10) {
                          leadService.captureAbandonedLead({
                            name: clientName.trim() || 'Visitante (Simulador de Orçamento)',
                            whatsapp: digits,
                            segment: companyName.trim() || initialProjectName || projectTypeName,
                            contextNote: `Simulou ${projectTypeName} (R$ ${total.toLocaleString('pt-BR')}) no site e digitou o WhatsApp.`,
                            budgetEstimate: total,
                          });
                        }
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-[#06080F] border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Empresa ou Segmento
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Escritório de Advocacia / Loja de Carros"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#06080F] border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-cyan-300 block">
                      Qual problema você quer resolver ou o que precisa criar?
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Preciso de um site rápido com agendamento e automação no WhatsApp para fechar mais vendas..."
                      value={clientProblem}
                      onChange={(e) => setClientProblem(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#06080F] border border-cyan-500/30 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-cyber-primary w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-400/20 cursor-pointer"
                  >
                    <span>Enviar Orçamento p/ WhatsApp Agora</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Domínio próprio + 1 ano de hospedagem inclusos</span>
                  </div>
                </form>
              ) : (
                <div className="p-5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/40 shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold font-heading text-white">
                        Orçamento Pronto, {clientName}!
                      </h3>
                      <p className="text-xs text-slate-300">
                        Clique abaixo para enviar o resumo no nosso WhatsApp e alinhar os detalhes do seu projeto.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 pt-1">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => pixelService.trackWhatsAppContact('Simulador de Orçamento', total)}
                      className="btn-cyber-primary w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Enviar Orçamento no WhatsApp Agora</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      onClick={copyProposalToClipboard}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#06080F] border border-white/15 hover:border-cyan-400 text-xs text-white transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{copied ? 'Resumo Copiado!' : 'Copiar Resumo do Orçamento'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="text-xs text-slate-400 hover:text-white underline pt-1 cursor-pointer"
                    >
                      Ajustar itens do orçamento
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

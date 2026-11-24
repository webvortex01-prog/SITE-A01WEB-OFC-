import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  Cpu,
  Globe,
  ArrowRight,
  CheckCircle2,
  Layers,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { diagnoseBusinessNeed, BottleneckType } from '../utils/calculator';
import { sound } from '../utils/audio';
import { Scroll3DStage, StickyStackCard } from '../utils/scrollytelling';
import ScrollReactiveImage from './ScrollReactiveImage';

interface EcosystemSectionProps {
  onSelectDiagnosisForQuote?: (bottleneck: BottleneckType, title: string) => void;
}

export default function EcosystemSection({ onSelectDiagnosisForQuote }: EcosystemSectionProps) {
  const [botStep, setBotStep] = useState<number>(1);
  const [selectedOptionText, setSelectedOptionText] = useState<string>('');
  const [botIndustry, setBotIndustry] = useState<'advocacia' | 'carros' | 'estetica' | 'varejo'>('advocacia');
  const [selectedBottleneck, setSelectedBottleneck] = useState<BottleneckType>('no_site');

  const diagnosis = diagnoseBusinessNeed(selectedBottleneck);

  const bottleneckOptions: { id: BottleneckType; label: string; subtitle: string }[] = [
    {
      id: 'no_site',
      label: 'Ainda não tenho um site profissional',
      subtitle: 'Preciso de uma página própria para divulgar meus serviços e anunciar',
    },
    {
      id: 'slow_site',
      label: 'Tenho site, mas é antigo ou lento no celular',
      subtitle: 'Quero modernizar o visual e deixar o carregamento leve e rápido',
    },
    {
      id: 'whatsapp_delay',
      label: 'Perco tempo respondendo perguntas básicas no Zap',
      subtitle: 'Preciso que o cliente já chegue sabendo informações ou pré-agendado',
    },
    {
      id: 'manual_management',
      label: 'Preciso organizar agendamentos, pedidos ou clientes',
      subtitle: 'Quero um painel simples feito sob medida para controlar minha rotina',
    },
  ];

  const industryScenarios = {
    advocacia: {
      label: 'Advocacia & Consultoria',
      userMsg: 'Boa noite, vi o anúncio do escritório. Preciso de assessoria para um contrato empresarial.',
      botReply1: 'Olá! Recebemos sua solicitação. Para direcionar seu atendimento ao advogado responsável pela área, escolha uma opção:',
      botOptions: ['Agendar Reunião Online', 'Enviar Resumo do Caso', 'Falar com Advogado no WhatsApp'],
      botConfirmation: 'Solicitação registrada! O advogado responsável já recebeu o resumo do seu caso para iniciar seu atendimento.',
    },
    carros: {
      label: 'Loja de Carros & Showroom',
      userMsg: 'Fala pessoal! Esse SUV do anúncio ainda está disponível? Aceitam meu seminovo na troca?',
      botReply1: 'Olá! Sim, veículo disponível na loja com laudo cautelar aprovado. Aceitamos seu usado na troca! Como prefere avançar?',
      botOptions: ['Simular Financiamento', 'Avaliar Meu Carro na Troca', 'Agendar Visita na Loja'],
      botConfirmation: 'Dados registrados! Nosso consultor já recebeu as informações para enviar sua simulação e agendar sua visita.',
    },
    estetica: {
      label: 'Clínica, Estética & Salão',
      userMsg: 'Olá! Vi o perfil no Instagram e quero saber valores e horários para avaliação essa semana.',
      botReply1: 'Olá! Temos horários disponíveis amanhã (11h e 16h) para sua avaliação. Como deseja prosseguir?',
      botOptions: ['Reservar Horário das 16h', 'Ver Menu de Procedimentos', 'Tirar Dúvida com Especialista'],
      botConfirmation: 'Pré-agendamento das 16h selecionado! Já enviamos a confirmação e o endereço da clínica no seu WhatsApp.',
    },
    varejo: {
      label: 'Moda, Catálogo & Pedidos',
      userMsg: 'Boa noite! Quero garantir o conjunto da coleção nova no tamanho M.',
      botReply1: 'Perfeito! Temos o tamanho M disponível a pronta entrega. Como prefere finalizar seu pedido?',
      botOptions: ['Pagar via PIX', 'Pagamento no Cartão', 'Escolher Mais Peças do Catálogo'],
      botConfirmation: 'Pedido organizado! Os itens selecionados e os dados de entrega já foram enviados para finalizar rapidamente.',
    },
  };

  const currentScenario = industryScenarios[botIndustry];

  const handleNextStep = () => {
    sound.playSelect();
    if (botStep < 2) {
      setSelectedOptionText(currentScenario.botOptions[0]);
      setBotStep(2);
    } else {
      setSelectedOptionText('');
      setBotStep(1);
    }
  };

  const handleSelectIndustry = (ind: keyof typeof industryScenarios) => {
    sound.playSelect();
    setBotIndustry(ind);
    setSelectedOptionText('');
    setBotStep(1);
  };

  const handleSpotlightMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <section
      id="ecossistema"
      className="py-20 sm:py-24 relative overflow-x-clip bg-[#06080F] border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <Scroll3DStage intensity="medium">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span>02. ESTRUTURA COMPLETA & ATENDIMENTO</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">SOLUÇÕES PRÁTICAS</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
              Muito Além de um Site Bonito.{' '}
              <span className="text-gradient-animated">
                Organizamos Seu Atendimento e Sua Gestão.
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Quando você investe em anúncios ou divulga sua empresa nas redes sociais, o cliente precisa entender rapidamente o que você oferece e conseguir falar com você sem complicação. Criamos toda essa estrutura sob medida.
            </p>
          </div>
        </Scroll3DStage>

        {/* Stacked Scrollytelling Cards Container (Sobreposição de Cards com Pin) */}
        <div className="space-y-8 pb-6">
          {/* Stack Layer 1: Bento Cards 01 & 02 */}
          <StickyStackCard index={0} totalCards={3} stickyTop={82}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#06080F]/95 backdrop-blur-xl rounded-2xl">
              {/* Bento Card 01 (col-span-7) */}
              <div
                onMouseMove={handleSpotlightMove}
                className="lg:col-span-7 spotlight-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span>01. Triagem & Automação no WhatsApp 24/7</span>
                    <span className="text-emerald-400">Atendimento Imediato</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                    Receba Seus Clientes a Qualquer Hora Sem Deixar Ninguém Esperando
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Quando um cliente clica no seu anúncio à noite ou no final de semana, nosso fluxo automatizado responde na hora, apresenta seu catálogo ou serviços e coleta as informações principais para que você já assuma a conversa pronta.
                  </p>

                  <ScrollReactiveImage
                    src="https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=1000&q=85"
                    alt="Triagem e Automação no WhatsApp 24/7"
                    badgeText="AUTOMAÇÃO WHATSAPP 24/7"
                    metricText="RESPOSTA EM 2s"
                    accentColor="from-emerald-400 to-cyan-400"
                    aspectClass="h-44 sm:h-48 mt-2"
                    overlayTitle="Triagem Inteligente de Clientes no Seu Número"
                    overlaySubtitle="O cliente escolhe o serviço, agenda ou pede orçamento 24h por dia"
                  />
                </div>
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-200">
                    <Bot className="w-4 h-4 text-cyan-400" />
                    Triagem Automática de Clientes
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Catálogo e Pré-Agendamento</span>
                  <span aria-hidden="true">·</span>
                  <span>Direto no Seu Número</span>
                </div>
              </div>

              {/* Bento Card 02 (col-span-5) */}
              <div
                onMouseMove={handleSpotlightMove}
                className="lg:col-span-5 spotlight-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span>02. Velocidade & Design Mobile</span>
                    <span className="text-emerald-400">Código Limpo</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                    Sites Leves Pensados Para Quem Acessa Pelo Celular
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Não usamos templates pesados que travam no celular. Desenvolvemos páginas leves e diretas ao ponto, ideais para receber o público que vem do Instagram, Facebook e Google.
                  </p>

                  <ScrollReactiveImage
                    src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1000&q=85"
                    alt="Sites Leves Pensados Para Celular"
                    badgeText="MOBILE-FIRST 5G"
                    metricText="100 PAGESPEED"
                    accentColor="from-cyan-400 to-sky-500"
                    aspectClass="h-44 sm:h-48 mt-2"
                    overlayTitle="Abertura Instantânea em Qualquer Smartphone"
                    overlaySubtitle="Zero perda de cliques das suas campanhas de tráfego"
                  />
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-slate-300">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Navegação fluida no celular e no computador</span>
                </div>
              </div>
            </div>
          </StickyStackCard>

          {/* Stack Layer 2: Bento Cards 03 & 04 */}
          <StickyStackCard index={1} totalCards={3} stickyTop={82}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#06080F]/95 backdrop-blur-xl rounded-2xl">
              {/* Bento Card 03 (col-span-5) */}
              <div
                onMouseMove={handleSpotlightMove}
                className="lg:col-span-5 spotlight-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                    <span>03. Sistemas Web & Painel de Gestão</span>
                    <span>Sem Mensalidade</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                    Painel Próprio Com as Regras do Seu Negócio
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Precisa de algo além de um site? Criamos sistemas web personalizados para você organizar agendamentos, cadastros de clientes, orçamentos, estoque ou pedidos direto pelo navegador.
                  </p>

                  <ScrollReactiveImage
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=85"
                    alt="Painel Próprio de Gestão Web"
                    badgeText="SISTEMA SOB MEDIDA"
                    metricText="R$ 0 MENSALIDADE"
                    accentColor="from-amber-400 to-orange-500"
                    aspectClass="h-40 sm:h-44 mt-2"
                    overlayTitle="Painel Gerencial & Controle Completo"
                    overlaySubtitle="Código 100% seu, sem pagar aluguel mensal de plataforma"
                  />
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-slate-300">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Sistema entregue pronto, sem taxas mensais de licença</span>
                </div>
              </div>

              {/* Bento Card 04 (col-span-7): Live WhatsApp Simulator */}
              <div
                onMouseMove={handleSpotlightMove}
                className="lg:col-span-7 spotlight-card rounded-2xl p-6 sm:p-8 border-cyan-400/30 space-y-6"
              >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <div className="text-xs font-mono text-cyan-400">04. SIMULADOR DE ATENDIMENTO AO VIVO</div>
                <h3 className="text-lg sm:text-xl font-bold font-heading text-white mt-0.5">
                  Teste Como Seu Cliente É Recebido no WhatsApp
                </h3>
              </div>

              {/* Segment Switcher */}
              <div className="flex flex-wrap gap-1.5">
                {(['advocacia', 'carros', 'estetica', 'varejo'] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectIndustry(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      botIndustry === key
                        ? 'bg-cyan-400 text-slate-950 font-bold'
                        : 'bg-[#06080F] border border-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    {industryScenarios[key].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Chat Window */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 rounded-xl bg-[#06080F] border border-white/10 p-4 space-y-3 text-xs">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="max-w-[90%] rounded-xl p-3 bg-[#005C4B] text-white space-y-1">
                    <p>{currentScenario.userMsg}</p>
                    <span className="text-[10px] text-emerald-200 block text-right font-mono">
                      Cliente · Via Site / Anúncio
                    </span>
                  </div>
                </div>

                {/* Bot Reply with Interactive Buttons */}
                {botStep >= 1 && (
                  <motion.div
                    key={`reply-${botIndustry}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[94%] rounded-xl p-3 bg-[#111827] border border-white/10 text-slate-100 space-y-2">
                      <p>{currentScenario.botReply1}</p>
                      <div className="space-y-1.5 pt-1">
                        {currentScenario.botOptions.map((opt, i) => {
                          const isChosen = selectedOptionText === opt;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                sound.playSelect();
                                setSelectedOptionText(opt);
                                setBotStep(2);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg border font-semibold text-xs transition-all cursor-pointer flex items-center justify-between ${
                                isChosen
                                  ? 'bg-cyan-400 text-slate-950 border-cyan-300 font-bold'
                                  : 'bg-[#1E293B] hover:bg-cyan-950/60 border-cyan-400/30 text-cyan-300'
                              }`}
                            >
                              <span>{opt}</span>
                              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Confirmation */}
                {botStep >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[94%] rounded-xl p-3 bg-emerald-950/50 border border-emerald-500/40 text-emerald-100 space-y-1">
                      {selectedOptionText && (
                        <span className="text-[10px] font-mono text-cyan-300 block">
                          Opção escolhida: {selectedOptionText}
                        </span>
                      )}
                      <p className="font-semibold">{currentScenario.botConfirmation}</p>
                      <span className="text-[10px] text-emerald-300 font-mono block">
                        Atendimento organizado e pronto para você concluir
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="md:col-span-5 space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Clique em qualquer botão de opção dentro da conversa ao lado para testar como o cliente interage no seu WhatsApp:
                </p>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn-cyber-primary w-full py-3 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  {botStep < 2 ? (
                    <>
                      <span>Testar Escolha do Cliente</span>
                      <ArrowRight className="w-4 h-4 text-slate-950 shrink-0" />
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                      <span>Reiniciar Conversa</span>
                    </>
                  )}
                </button>
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Configurado direto no WhatsApp da sua empresa</span>
                </div>
              </div>
            </div>
          </div>
            </div>
          </StickyStackCard>

          {/* Stack Layer 3: Honest, Practical Business Structure Diagnostic */}
          <StickyStackCard index={2} totalCards={3} stickyTop={82}>
            <div
              onMouseMove={handleSpotlightMove}
              className="spotlight-card rounded-2xl p-6 sm:p-10 bg-[#0B0F1A]/95 backdrop-blur-xl"
            >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-5">
              <div className="text-xs font-mono text-cyan-400">
                DIAGNÓSTICO PRÁTICO DE PROJETO
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                Qual é a principal necessidade da sua empresa hoje?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Selecione abaixo o cenário que melhor descreve o momento do seu negócio para ver exatamente o que a 01 Web desenvolve para resolver isso na prática:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {bottleneckOptions.map((opt) => {
                  const isSelected = selectedBottleneck === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        setSelectedBottleneck(opt.id);
                      }}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-400 text-white'
                          : 'bg-[#06080F] border-white/10 hover:border-white/25 text-slate-300'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-bold text-white leading-snug">
                        {opt.label}
                      </div>
                      <div className="text-[11px] text-slate-400 leading-relaxed">
                        {opt.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Honest Solution Recommendation Card */}
            <div className="lg:col-span-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedBottleneck}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 rounded-2xl bg-[#06080F] border border-cyan-400/40 space-y-4"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      SOLUÇÃO RECOMENDADA
                    </span>
                    <span className="text-emerald-400 font-semibold tabular-nums">
                      A partir de R$ {diagnosis.startingPrice}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-lg sm:text-xl font-extrabold font-heading text-white">
                      {diagnosis.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {diagnosis.summary}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">
                      O que entregamos pronto para você:
                    </div>
                    {diagnosis.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      Prazo Médio de Entrega:
                    </span>
                    <span className="text-white font-bold">
                      {diagnosis.estimatedDelivery}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playSuccess();
                      if (onSelectDiagnosisForQuote) {
                        onSelectDiagnosisForQuote(selectedBottleneck, diagnosis.title);
                      }
                      const el = document.getElementById('orcamento');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn-cyber-primary w-full py-3.5 px-5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <span>Configurar Este Projeto no Simulador</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
            </div>
          </StickyStackCard>
        </div>
      </div>
    </section>
  );
}

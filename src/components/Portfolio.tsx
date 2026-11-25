import { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from 'motion/react';
import {
  Scale,
  Car,
  Scissors,
  ShoppingBag,
  Sparkles,
  Feather,
  ArrowRight,
  Globe,
  Eye,
  CheckCircle2,
  Smartphone,
  Zap,
  ShieldCheck,
  MousePointerClick,
  Layers,
  ExternalLink,
  Rocket,
} from 'lucide-react';
import { sound } from '../utils/audio';
import ProjectModal, { ProjectData } from './ProjectModal';
import { Scroll3DStage } from '../utils/scrollytelling';
import ScrollReactiveImage from './ScrollReactiveImage';

interface PortfolioProps {
  onSelectProjectForQuote: (name: string) => void;
}

export default function Portfolio({ onSelectProjectForQuote }: PortfolioProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalProject, setActiveModalProject] = useState<ProjectData | null>(null);
  const [initialModalMode, setInitialModalMode] = useState<'site' | 'system'>('site');
  const [initialDeviceMode, setInitialDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  // Scrollytelling Pinned Theater State:
  // 0 = Impactful Manifesto ("Tudo o que entregamos"), 1 = Project #1, 2 = Project #2, 3 = Project #3
  const [spotlightStage, setSpotlightStage] = useState<number>(0);
  const theaterTrackRef = useRef<HTMLDivElement | null>(null);
  const allGridRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress: theaterProgress } = useScroll({
    target: theaterTrackRef,
    offset: ['start start', 'end end'],
  });

  const smoothTheaterProgress = useSpring(theaterProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.3,
  });

  const progressBarScaleX = useTransform(smoothTheaterProgress, [0, 1], [0.08, 1]);

  useMotionValueEvent(theaterProgress, 'change', (v) => {
    let nextStage = 0;
    if (v < 0.23) nextStage = 0;
    else if (v < 0.5) nextStage = 1;
    else if (v < 0.76) nextStage = 2;
    else nextStage = 3;

    setSpotlightStage((prev) => (prev !== nextStage ? nextStage : prev));
  });

  const jumpToTheaterStage = (stageIndex: number) => {
    sound.playSelect();
    setSpotlightStage(stageIndex);
    const el = theaterTrackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const trackTop = rect.top + window.scrollY;
    const scrollable = Math.max(0, el.offsetHeight - window.innerHeight);
    const targetRatio = (stageIndex + 0.25) / 4;
    window.scrollTo({
      top: trackTop + scrollable * targetRatio,
      behavior: 'smooth',
    });
  };

  const scrollToAllModels = () => {
    sound.playSelect();
    allGridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const [customProjectUrls, setCustomProjectUrls] = useState<
    Record<string, { siteUrl?: string; systemUrl?: string }>
  >(() => {
    try {
      const saved = localStorage.getItem('01web_custom_project_urls');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('01web_custom_project_urls', JSON.stringify(customProjectUrls));
    } catch {
      // Ignore storage errors
    }
  }, [customProjectUrls]);

  const handleSaveCustomUrl = (projectId: string, siteUrl: string, systemUrl: string) => {
    setCustomProjectUrls((prev) => ({
      ...prev,
      [projectId]: { siteUrl, systemUrl },
    }));
  };

  const categories = [
    { id: 'all', label: 'Todos os Modelos (6)' },
    { id: 'advocacia', label: 'Advocacia' },
    { id: 'carros', label: 'Loja de Carros' },
    { id: 'beleza', label: 'Salão de Beleza' },
    { id: 'roupas', label: 'Loja de Roupas' },
    { id: 'estetica', label: 'Estética' },
    { id: 'tattoo', label: 'Tattoo' },
  ];

  const projects: ProjectData[] = [
    {
      id: 'lex-advocacia',
      title: 'Aldo Leão — Advocacia & Consultoria Jurídica',
      category: 'advocacia',
      categoryLabel: 'Advocacia High-Ticket',
      tagline: 'Posicionamento jurídico de alta autoridade com captação estratégica de clientes',
      description:
        'Projeto completo de alto padrão para escritório de advocacia, com arquitetura focada em autoridade imediata, áreas de atuação detalhadas e atendimento executivo no WhatsApp.',
      imageUrl:
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=85',
      accentColor: 'from-amber-400 to-amber-600',
      externalSiteUrl: 'https://aldo-leao.vercel.app/',
      metric1: { value: 'Design Sob Medida', label: 'Padrão Executivo & OAB' },
      metric2: { value: '100% Mobile', label: 'Contato Direto no WhatsApp' },
      speedScore: 100,
      features: [
        'Design sob medida para escritórios de advocacia com conformidade ética OAB e LGPD',
        'Fluxo de atendimento direto por área do Direito via WhatsApp 24/7',
        'Estrutura de alta credibilidade para apresentação institucional e áreas de atuação',
      ],
      mockupContent: {
        heroTitle: 'Excelência, Tradição e Estratégia Jurídica.',
        heroSubtitle:
          'Atuação especializada na defesa do seu patrimônio, direitos corporativos e soluções jurídicas sob medida.',
        ctaText: 'Falar com Advogado Especialista',
        badgeText: 'DIREITO EMPRESARIAL & PATRIMONIAL',
        items: [
          {
            title: 'Direito Empresarial & Tributário',
            subtitle: 'Blindagem patrimonial e recuperação de créditos',
            price: 'Atendimento VIP',
          },
          {
            title: 'Direito Civil & Contratos',
            subtitle: 'Segurança jurídica em negociações de alto valor',
            price: 'Consultoria',
          },
          {
            title: 'Atuação Estratégica nos Tribunais',
            subtitle: 'Acompanhamento personalizado em todas as instâncias',
            price: 'Sob Medida',
          },
        ],
      },
    },
    {
      id: 'garage-especializada',
      title: 'GRV Motors — Showroom & Loja de Carros',
      category: 'carros',
      categoryLabel: 'Showroom Automotivo',
      tagline: 'Catálogo interativo de veículos seminovos e premium com simulação imediata',
      description:
        'Showroom digital automotivo com filtros inteligentes de estoque, ficha técnica detalhada, simulação de financiamento e avaliação de troca direto pelo celular.',
      imageUrl:
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',
      accentColor: 'from-rose-500 to-amber-500',
      externalSiteUrl: 'https://grv-motors.vercel.app/',
      metric1: { value: 'Catálogo Vivo', label: 'Busca Rápida de Estoque' },
      metric2: { value: '100% Mobile', label: 'Simulação & Troca no Zap' },
      speedScore: 100,
      features: [
        'Vitrine de veículos em alta definição com busca rápida por marca, ano e faixa de valor',
        'Envio prático de propostas para financiamento e avaliação de veículo na troca',
        'Layout responsivo otimizado para compradores pesquisando pelo celular',
      ],
      mockupContent: {
        heroTitle: 'O Seu Próximo Veículo Premium Está na GRV Motors.',
        heroSubtitle:
          'Estoque selecionado com laudo cautelar 100% aprovado, garantia de procedência e as melhores taxas.',
        ctaText: 'Ver Estoque Disponível Agora',
        badgeText: 'SHOWROOM AUTOMOTIVO & FINANCIAMENTO',
        items: [
          {
            title: 'SUVs & Sedans Executivos',
            subtitle: 'Veículos revisados com baixa quilometragem',
            price: 'Pronta Entrega',
          },
          {
            title: 'Esportivos & Importados',
            subtitle: 'Curadoria exclusiva para clientes exigentes',
            price: 'Sob Consulta',
          },
          {
            title: 'Financiamento & Troca com Troco',
            subtitle: 'Aprovação rápida com os principais bancos',
            price: 'Taxas Especiais',
          },
        ],
      },
    },
    {
      id: 'salao-beleza-six',
      title: 'Studio Six — Salão de Beleza & Hair Concept',
      category: 'beleza',
      categoryLabel: 'Salão de Beleza & Spa',
      tagline: 'Experiência de beleza de alto padrão com catálogo de serviços e agendamento rápido',
      description:
        'Website sofisticado para salões de beleza e hair studios, destacando transformações, menu de tratamentos capilares, mechas, estética e agendamento direto.',
      imageUrl:
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85',
      accentColor: 'from-rose-400 to-amber-300',
      externalSiteUrl: 'https://salaodebeleza-six.vercel.app/',
      metric1: { value: 'Menu Digital', label: 'Catálogo de Serviços' },
      metric2: { value: '100% Mobile', label: 'Agendamento via WhatsApp' },
      speedScore: 100,
      features: [
        'Apresentação visual impecável de especialistas, portfólio de loiros/mechas e pacotes',
        'Jornada de agendamento organizada para facilitar a escolha de horários pelo cliente',
        'Design envolvente que valoriza a percepção de cuidado e estrutura do salão',
      ],
      mockupContent: {
        heroTitle: 'Beleza, Sofisticação e Cuidado Em Cada Detalhe.',
        heroSubtitle:
          'Especialistas em colorimetria, mechas criativas, tratamentos capilares de luxo e produção completa.',
        ctaText: 'Agendar Meu Horário no Salão',
        badgeText: 'HAIR CONCEPT & ALTA BELEZA',
        items: [
          {
            title: 'Mechas & Iluminação Personalizada',
            subtitle: 'Diagnóstico de visagismo + tratamento reconstrutor',
            price: 'Avaliação VIP',
          },
          {
            title: 'Cronograma Capilar de Luxo',
            subtitle: 'Nutrição profunda com linhas importadas',
            price: 'Sessão Completa',
          },
          {
            title: 'Dia da Noiva & Produções',
            subtitle: 'Maquiagem blindada e penteado autoral',
            price: 'Pacote Exclusivo',
          },
        ],
      },
    },
    {
      id: 'hype-streetwear',
      title: 'Flagship Store — Loja de Roupas & Moda',
      category: 'roupas',
      categoryLabel: 'Loja de Roupas & Moda',
      tagline: 'Vitrine de moda moderna com lookbook editorial e pedido ágil',
      description:
        'Loja virtual moderna para marcas de roupas e vestuário, com navegação fluida por coleções, seleção de tamanhos, vitrine mobile-first e compra rápida.',
      imageUrl:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85',
      accentColor: 'from-cyan-400 to-indigo-500',
      externalSiteUrl: 'https://projeto-de-loja-de-roupas.vercel.app/',
      metric1: { value: 'Vitrine Ágil', label: 'Lookbook & Coleções' },
      metric2: { value: '100% Mobile', label: 'Compra Fácil pelo Celular' },
      speedScore: 99,
      features: [
        'Catálogo de coleções com visualização rápida de peças, caimento e tabela de medidas',
        'Experiência de navegação mobile-first projetada para visitantes vindos do Instagram',
        'Estrutura organizada para destacar lançamentos, promoções e atendimento rápido',
      ],
      mockupContent: {
        heroTitle: 'Moda Autoral Com Estilo e Qualidade Superior.',
        heroSubtitle:
          'Conheça a nova coleção com tecidos selecionados, corte impecável e envio rápido para todo o Brasil.',
        ctaText: 'Explorar Nova Coleção',
        badgeText: 'E-COMMERCE & LOOKBOOK EDITORIAL',
        items: [
          {
            title: 'Peças Essenciais Premium',
            subtitle: 'Algodão penteado de alta gramatura e durabilidade',
            price: 'Lançamento',
          },
          {
            title: 'Conjuntos & Alfaiataria Moderna',
            subtitle: 'Caimento perfeito para todas as ocasiões',
            price: 'Edição Limitada',
          },
          {
            title: 'Acessórios & Looks Completos',
            subtitle: 'Frete expresso e desconto no PIX',
            price: '10% OFF no PIX',
          },
        ],
      },
    },
    {
      id: 'glow-clinica',
      title: 'Clínica Exemplar — Estética Avançada',
      category: 'estetica',
      categoryLabel: 'Clínica de Estética',
      tagline: 'Design clínico sofisticado com apresentação de procedimentos e agendamento',
      description:
        'Página estruturada para clínicas de estética avançada e biomedicina, apresentando protocolos faciais e corporais, diferenciais e agendamento de avaliação.',
      imageUrl:
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=85',
      accentColor: 'from-teal-400 to-emerald-500',
      externalSiteUrl: 'https://modelo-estetica-exemplar.vercel.app/',
      metric1: { value: 'Alto Padrão', label: 'Protocolos & Procedimentos' },
      metric2: { value: '100% Mobile', label: 'Agendamento de Avaliação' },
      speedScore: 100,
      features: [
        'Vitrine elegante de procedimentos faciais e corporais com explicação clara',
        'Contato direto de pacientes para avaliação personalizada via WhatsApp',
        'Visual clean e sofisticado que transmite segurança clínica e credibilidade',
      ],
      mockupContent: {
        heroTitle: 'Realce Sua Beleza Natural com Ciência e Precisão.',
        heroSubtitle:
          'Protocolos exclusivos de rejuvenescimento facial e corporal com tecnologia de ponta.',
        ctaText: 'Agendar Consulta de Avaliação',
        badgeText: 'BIOMEDICINA & ESTÉTICA AVANÇADA',
        items: [
          {
            title: 'Harmonização Facial Full Face',
            subtitle: 'Ácido hialurônico e bioestimuladores',
            price: 'Consulte Condições',
          },
          {
            title: 'Toxina Botulínica Preventiva',
            subtitle: 'Tratamento de rugas de expressão',
            price: 'Condições Especiais',
          },
          {
            title: 'Laser Ultraformer MPT',
            subtitle: 'Lifting não cirúrgico e estímulo de colágeno',
            price: 'Protocolo VIP',
          },
        ],
      },
    },
    {
      id: 'black-ink-tattoo',
      title: 'Tattoo Exemplar — Estúdio de Tatuagem',
      category: 'tattoo',
      categoryLabel: 'Estúdio de Tatuagem',
      tagline: 'Identidade visual dark autoral com galeria de estilos e orçamento rápido',
      description:
        'Site imersivo para estúdios de tatuagem e artistas visuais, exibindo portfólio em alta definição, especialidades, biossegurança e fluxo direto de orçamento.',
      imageUrl:
        'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1200&q=85',
      accentColor: 'from-amber-400 to-rose-500',
      externalSiteUrl: 'https://modelo-tatoo-exemplar.vercel.app/',
      metric1: { value: 'Galeria HD', label: 'Portfólio Autoral' },
      metric2: { value: '100% Mobile', label: 'Orçamento via WhatsApp' },
      speedScore: 100,
      features: [
        'Galeria artística de alto impacto visual para destacar o portfólio de cada tatuador',
        'Triagem prática de ideia, local do corpo e tamanho aproximado antes do WhatsApp',
        'Apresentação profissional dos artistas, estilos de tatuagem e ambiente do estúdio',
      ],
      mockupContent: {
        heroTitle: 'Arte na Pele Feita Por Especialistas.',
        heroSubtitle:
          'Traços finos, realismo e projetos autorais exclusivos em um ambiente premium.',
        ctaText: 'Solicitar Orçamento de Tattoo',
        badgeText: 'ESTÚDIO AUTORAL & REALISMO',
        items: [
          {
            title: 'Realismo Preto e Cinza',
            subtitle: 'Especialista em retratos e fechamentos',
            price: 'Projetos Exclusivos',
          },
          {
            title: 'Fine Line & Botânica',
            subtitle: 'Traços delicados e alta precisão',
            price: 'Orçamento Rápido',
          },
          {
            title: 'Projetos Autorais Custom',
            subtitle: 'Desenho criado do zero para sua anatomia',
            price: 'Sob Consulta',
          },
        ],
      },
    },
  ];

  const topThreeProjects = projects.slice(0, 3);
  const activeSpotlightProject =
    spotlightStage >= 1 && spotlightStage <= 3 ? topThreeProjects[spotlightStage - 1] : null;

  const filteredProjects =
    selectedCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  const handleOpenModal = (
    project: ProjectData,
    mode: 'site' | 'system' = 'site',
    device: 'desktop' | 'mobile' = 'desktop'
  ) => {
    sound.playSelect();
    setInitialModalMode(mode);
    setInitialDeviceMode(device);
    setActiveModalProject(project);
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const renderDomainPreviewHeader = (proj: ProjectData) => {
    const domainMap: Record<string, string> = {
      'lex-advocacia': 'aldo-leao.vercel.app',
      'garage-especializada': 'grv-motors.vercel.app',
      'salao-beleza-six': 'salaodebeleza-six.vercel.app',
      'hype-streetwear': 'loja-de-roupas.vercel.app',
      'glow-clinica': 'modelo-estetica.vercel.app',
      'black-ink-tattoo': 'modelo-tatoo.vercel.app',
    };
    const domain = domainMap[proj.id] || '01web.com.br';
    const firstItem = proj.mockupContent.items[0];

    return (
      <div className="relative rounded-xl overflow-hidden border border-white/15 group-hover:border-cyan-400/60 transition-all duration-300 bg-[#06080F]">
        {/* Simulated Browser Top Bar */}
        <div className="px-3 py-2 bg-[#06080F] border-b border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-rose-500/80 shrink-0" />
            <span className="w-2 h-2 rounded-full bg-amber-500/80 shrink-0" />
            <span className="w-2 h-2 rounded-full bg-emerald-500/80 shrink-0" />
            <span className="ml-1.5 text-slate-300 truncate max-w-[165px]">{domain}</span>
          </div>
          <span className="text-emerald-400 font-bold tabular-nums shrink-0">
            {proj.speedScore} PageSpeed
          </span>
        </div>

        {/* High-Impact Scroll-Reactive Image Viewport */}
        <ScrollReactiveImage
          src={proj.imageUrl}
          alt={proj.title}
          badgeText={proj.mockupContent.badgeText}
          metricText="VER AO VIVO"
          accentColor={proj.accentColor}
          aspectClass="h-52 sm:h-56 rounded-none border-0"
          overlayTitle={proj.mockupContent.heroTitle}
          overlaySubtitle={firstItem ? `${firstItem.title} · ${firstItem.subtitle}` : proj.tagline}
        />
      </div>
    );
  };

  return (
    <section
      id="portfolio"
      className="relative overflow-x-clip bg-[#06080F] border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* =====================================================================
            PART 1: PINNED SCROLLYTELLING THEATER
            Beat 0: Impactful Manifesto ("Tudo que entregamos")
            Beat 1: POW! Project #01 (Advocacia) full-screen spotlight
            Beat 2: POW! Project #02 (GRV Motors) full-screen spotlight
            Beat 3: POW! Project #03 (Studio Six) full-screen spotlight
           ===================================================================== */}
        <div ref={theaterTrackRef} className="relative min-h-[330vh] lg:min-h-[390vh] py-4 lg:py-0">
          <div className="sticky top-16 lg:top-15 py-2 lg:py-3 flex flex-col justify-center space-y-2.5 lg:space-y-3">
            {/* Top Theater HUD Bar (Works on Scroll AND Click) */}
            <div className="relative z-20 lg:static flex flex-wrap items-center justify-between gap-2.5 p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-[#0B0F1A]/95 backdrop-blur-xl border border-cyan-400/30 shadow-2xl">
              <div className="flex items-center gap-2.5 text-xs font-mono">
                <MousePointerClick className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-slate-300 font-bold">
                  {spotlightStage === 0
                    ? 'ATO 01 · O PADRÃO DE ENTREGA 01 WEB'
                    : `PROJETO EM DESTAQUE #0${spotlightStage} DE 03`}
                </span>
              </div>

              {/* Interactive Stage Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full lg:w-auto lg:flex-wrap pb-0.5">
                {[
                  { idx: 0, label: '1. O Que Entregamos' },
                  { idx: 1, label: '2. #01 Advocacia' },
                  { idx: 2, label: '3. #02 Loja Carros' },
                  { idx: 3, label: '4. #03 Salão & Beleza' },
                ].map((tab) => {
                  const isActive = spotlightStage === tab.idx;
                  const isPassed = spotlightStage > tab.idx;
                  return (
                    <button
                      key={tab.idx}
                      type="button"
                      onClick={() => jumpToTheaterStage(tab.idx)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-extrabold transition-all cursor-pointer shrink-0 whitespace-nowrap ${isActive
                          ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-[0_0_14px_rgba(34,211,238,0.45)] lg:scale-105'
                          : isPassed
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
                        }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={scrollToAllModels}
                  className="px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-400/30 cursor-pointer shrink-0 whitespace-nowrap"
                >
                  Ver Todos os 6 ↓
                </button>
              </div>

              {/* Top Laser Scroll Progress Line */}
              <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                <motion.div
                  style={{ scaleX: progressBarScaleX }}
                  className="h-full origin-left bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400"
                />
              </div>
            </div>

            {/* Dynamic 3D Stage Content */}
            <div className="scrolly-perspective lg:min-h-[410px] flex items-center">
              <AnimatePresence mode="wait">
                {spotlightStage === 0 ? (
                  /* =========================================================
                     BEAT 0: TEXTO IMPACTANTE DE TUDO QUE ENTREGAMOS + MOSAICO
                     ========================================================= */
                  <motion.div
                    key="portfolio-manifesto-stage"
                    initial={{ opacity: 0, y: 28, scale: 0.94, rotateX: 8 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                    exit={{ opacity: 0, y: -28, scale: 0.94, rotateX: -8 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full rounded-3xl p-4 sm:p-7 lg:p-8 bg-gradient-to-br from-[#0B1224] via-[#070B14] to-[#09171B] border-2 border-cyan-400/40 shadow-[0_25px_90px_-20px_rgba(34,211,238,0.28)] relative overflow-hidden"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center relative z-10">
                      {/* Left Column: Impactful Manifesto Copy */}
                      <div className="lg:col-span-7 space-y-2.5 lg:space-y-3.5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/15 border border-cyan-400/40 text-cyan-300 text-[10px] sm:text-xs font-mono font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>01. ENGENHARIA VISUAL & PROJETOS DE ELITE</span>
                        </div>

                        <h2 className="text-xl sm:text-4xl font-extrabold font-heading text-white tracking-tight leading-[1.08]">
                          Não Criamos &ldquo;Sites Comuns&rdquo;.{' '}
                          <span className="text-gradient-animated">
                            Entregamos Máquinas Digitais Que Dominam o Seu Nicho.
                          </span>
                        </h2>

                        <p className="text-slate-200 text-[11.5px] sm:text-sm leading-snug sm:leading-relaxed">
                          Cada projeto que sai da <strong className="text-white">01 WEB</strong> é
                          construído em código puro de alta velocidade, com animações imersivas que
                          prendem o cliente nos primeiros 3 segundos e direcionam o pedido mastigado
                          para o seu WhatsApp.
                        </p>

                        {/* 4 Pillars of What We Deliver */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 pt-0.5">
                          {[
                            {
                              title: 'Visual Padrão Awwwards / Apple',
                              desc: 'Design exclusivo que posiciona sua empresa como líder absoluta do mercado.',
                            },
                            {
                              title: 'Abertura Instantânea (< 0.8s)',
                              desc: 'Nota 99-100 no Google PageSpeed para você não perder nenhum clique de anúncio.',
                            },
                            {
                              title: 'Triagem & Automação WhatsApp',
                              desc: 'Catálogo, simulador ou agendamento que já envia o cliente pronto para fechar.',
                            },
                            {
                              title: 'Código 100% Seu + 1 Ano Grátis',
                              desc: 'Domínio .com.br + 12 meses de hospedagem VIP inclusos e zero aluguel mensal.',
                            },
                          ].map((pillar) => (
                            <div
                              key={pillar.title}
                              className="p-2 sm:p-3 rounded-xl bg-[#060913]/90 border border-white/10 space-y-0.5"
                            >
                              <div className="text-[11px] sm:text-xs font-extrabold text-cyan-300 flex items-center gap-1.5 leading-tight">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>{pillar.title}</span>
                              </div>
                              <p className="hidden sm:block text-[11px] text-slate-400 leading-snug">
                                {pillar.desc}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="pt-0.5 lg:pt-1 flex flex-wrap items-center gap-2 sm:gap-3">
                          <button
                            type="button"
                            onClick={() => jumpToTheaterStage(1)}
                            className="btn-cyber-primary inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs sm:text-sm cursor-pointer shadow-lg"
                          >
                            <span>Role ou Clique: Ver 1º Projeto Saltar na Tela</span>
                            <ArrowRight className="w-4 h-4 text-slate-950 shrink-0" />
                          </button>
                          <span className="text-[11px] sm:text-xs font-mono text-emerald-400 animate-pulse">
                            ↓ Dê mais 1 scroll
                          </span>
                        </div>
                      </div>

                      {/* Right Column: 3D Visual Preview Collage of the 3 Flagship Projects (Desktop) */}
                      <div className="hidden lg:block lg:col-span-5 space-y-2.5">
                        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">
                          PRÓXIMOS 3 DESTAQUES NO SEU SCROLL:
                        </div>
                        {topThreeProjects.map((proj, i) => (
                          <div
                            key={proj.id}
                            onClick={() => jumpToTheaterStage(i + 1)}
                            className="group relative h-22 sm:h-24 rounded-2xl overflow-hidden border border-white/15 hover:border-cyan-400 transition-all cursor-pointer flex items-end p-3.5"
                          >
                            <img
                              src={proj.imageUrl}
                              alt={proj.title}
                              referrerPolicy="no-referrer"
                              className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover:scale-105 group-hover:opacity-85 transition-all duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#06080F] via-[#06080F]/70 to-transparent" />
                            <div className="relative z-10 flex items-center justify-between w-full gap-2">
                              <div>
                                <span className="text-[10px] font-mono font-bold text-cyan-400 block">
                                  DESTAQUE #0{i + 1} · {proj.categoryLabel.toUpperCase()}
                                </span>
                                <h3 className="text-sm font-extrabold text-white">
                                  {proj.title}
                                </h3>
                              </div>
                              <span className="px-2.5 py-1 rounded-lg bg-cyan-400 text-slate-950 font-mono font-extrabold text-[10px] shrink-0">
                                Ver #{i + 1} →
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* =========================================================
                     BEATS 1, 2, 3: POWWWWW! PROJETO #01, #02, #03 NA CARA!
                     ========================================================= */
                  activeSpotlightProject && (
                    <motion.div
                      key={`spotlight-proj-${activeSpotlightProject.id}`}
                      initial={{ opacity: 0, scale: 0.86, y: 36, rotateX: 12 }}
                      animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: -30, rotateX: -10 }}
                      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full rounded-3xl p-4 sm:p-7 bg-gradient-to-br from-[#0C1428] via-[#080C18] to-[#0A141E] border-2 border-cyan-400 shadow-[0_30px_100px_-15px_rgba(34,211,238,0.38)]"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-6 items-center">
                        {/* Left Column (col-span-5): Full Analysis & Actions (order-2 on mobile, order-1 on desktop) */}
                        <div className="lg:col-span-5 space-y-2.5 lg:space-y-3.5 order-2 lg:order-1">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-mono font-extrabold text-[10px] sm:text-xs">
                              PROJETO #0{spotlightStage} DE 03
                            </span>
                            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/5 border border-white/10 text-cyan-300 font-mono text-[10px] sm:text-xs font-bold">
                              {activeSpotlightProject.categoryLabel}
                            </span>
                            <span className="text-[10px] sm:text-xs font-mono text-emerald-400 font-bold">
                              ⚡ {activeSpotlightProject.speedScore}/100 PageSpeed
                            </span>
                          </div>

                          <div className="space-y-1 sm:space-y-1.5">
                            <h3 className="text-lg sm:text-3xl font-extrabold font-heading text-white leading-tight">
                              {activeSpotlightProject.title}
                            </h3>
                            <p className="text-[11px] sm:text-xs text-cyan-300 font-semibold">
                              {activeSpotlightProject.tagline}
                            </p>
                            <p className="hidden sm:block text-xs text-slate-300 leading-relaxed">
                              {activeSpotlightProject.description}
                            </p>
                          </div>

                          {/* Checklist of Project Engineering */}
                          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#060912] border border-white/10 space-y-1 sm:space-y-1.5">
                            <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                              DIFERENCIAIS ENTREGUES NESTE PROJETO:
                            </div>
                            {activeSpotlightProject.features.map((feat, idx) => (
                              <div
                                key={idx}
                                className={`${idx < 2 ? 'flex' : 'hidden sm:flex'
                                  } items-start gap-2 text-[11px] sm:text-xs text-slate-200 leading-snug`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-2 pt-0.5 sm:pt-1">
                            <div className="flex flex-row gap-2 sm:gap-2.5">
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenModal(activeSpotlightProject, 'site', 'desktop')
                                }
                                className="btn-cyber-primary flex-1 py-2.5 sm:py-3.5 px-3 sm:px-5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-extrabold text-[11px] sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-lg"
                              >
                                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 shrink-0" />
                                <span>Navegar no Site Real Ao Vivo</span>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenModal(activeSpotlightProject, 'site', 'mobile')
                                }
                                className="py-2.5 sm:py-3.5 px-3 sm:px-4 rounded-xl bg-[#06080F] hover:bg-slate-900 text-cyan-300 border border-cyan-400/40 font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                              >
                                <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                                <span>Modo Celular</span>
                              </button>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 sm:pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  sound.playClick();
                                  onSelectProjectForQuote(activeSpotlightProject.title);
                                  const el = document.getElementById('orcamento');
                                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="text-[11px] sm:text-xs font-mono text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
                              >
                                Orçar estrutura baseada neste modelo →
                              </button>

                              {spotlightStage < 3 ? (
                                <button
                                  type="button"
                                  onClick={() => jumpToTheaterStage(spotlightStage + 1)}
                                  className="text-[11px] sm:text-xs font-mono text-cyan-300 hover:text-white cursor-pointer"
                                >
                                  Próximo: Projeto #0{spotlightStage + 1} ↓
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={scrollToAllModels}
                                  className="text-[11px] sm:text-xs font-mono text-amber-300 hover:text-white font-bold cursor-pointer"
                                >
                                  Ver Todos os 6 Modelos ↓
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Column (col-span-7): Giant 3D Visual Showcase Mockup (order-1 on mobile, order-2 on desktop) */}
                        <div className="lg:col-span-7 order-1 lg:order-2">
                          <div
                            onClick={() =>
                              handleOpenModal(activeSpotlightProject, 'site', 'desktop')
                            }
                            className="group relative rounded-2xl overflow-hidden border-2 border-white/20 hover:border-cyan-400 transition-all duration-300 shadow-2xl cursor-pointer bg-[#05070E]"
                          >
                            {/* Browser Chrome Top Bar */}
                            <div className="px-3 sm:px-4 py-2 sm:py-3 bg-[#06080F] border-b border-white/10 flex items-center justify-between text-xs font-mono">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/80 shrink-0" />
                                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80 shrink-0" />
                                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/80 shrink-0" />
                                <span className="ml-1 sm:ml-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md bg-white/5 text-cyan-300 text-[10px] sm:text-[11px] truncate max-w-[180px] sm:max-w-xs">
                                  {activeSpotlightProject.externalSiteUrl}
                                </span>
                              </div>
                              <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px] shrink-0">
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>CLIQUE PARA TESTAR AO VIVO</span>
                              </span>
                            </div>

                            {/* High-Res Visual Image with Floating UI Elements */}
                            <div className="relative h-[135px] sm:h-[260px] lg:h-[310px] overflow-hidden">
                              <img
                                src={activeSpotlightProject.imageUrl}
                                alt={activeSpotlightProject.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#05070E] via-[#05070E]/55 to-transparent" />
                              <div className="absolute inset-0 bg-gradient-to-r from-[#05070E]/85 via-[#05070E]/30 to-transparent" />

                              {/* Simulated Website Hero Overlay Inside the Visual Mockup */}
                              <div className="absolute inset-0 p-3 sm:p-6 lg:p-8 flex flex-col justify-between">
                                <div className="flex items-center justify-between gap-2">
                                  <span
                                    className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg bg-gradient-to-r ${activeSpotlightProject.accentColor} text-slate-950 font-mono font-extrabold text-[9px] sm:text-[10px] uppercase tracking-wider shadow-lg truncate`}
                                  >
                                    {activeSpotlightProject.mockupContent.badgeText}
                                  </span>

                                  <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-[#06080F]/90 backdrop-blur-md border border-cyan-400/40 text-cyan-300 font-mono font-bold text-[10px] sm:text-xs flex items-center gap-1.5 shadow-xl shrink-0">
                                    <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
                                    <span className="hidden sm:inline">Interagir com o Site Real</span>
                                    <span className="sm:hidden">Abrir</span>
                                  </span>
                                </div>

                                <div className="space-y-2 sm:space-y-4 max-w-lg">
                                  <div className="space-y-1 sm:space-y-1.5">
                                    <h4 className="text-sm sm:text-xl lg:text-3xl font-extrabold font-heading text-white leading-tight drop-shadow-lg">
                                      {activeSpotlightProject.mockupContent.heroTitle}
                                    </h4>
                                    <p className="hidden sm:block text-xs sm:text-sm text-slate-200 line-clamp-2">
                                      {activeSpotlightProject.mockupContent.heroSubtitle}
                                    </p>
                                  </div>

                                  {/* 3 Mini Cards Inside the Visual Screen */}
                                  <div className="hidden sm:grid sm:grid-cols-3 gap-2.5">
                                    {activeSpotlightProject.mockupContent.items.map((it) => (
                                      <div
                                        key={it.title}
                                        className="p-2.5 rounded-xl bg-[#06080F]/90 backdrop-blur-md border border-white/15"
                                      >
                                        <div className="text-[11px] font-bold text-white truncate">
                                          {it.title}
                                        </div>
                                        <div className="text-[10px] text-cyan-300 font-mono mt-0.5">
                                          {it.price}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* =====================================================================
            PART 2: GRAN FINALE — TODOS OS 6 MODELOS COM TEXTO TOP & IMAGENS REATIVAS
           ===================================================================== */}
        <div ref={allGridRef} className="pt-16 pb-24 border-t border-white/10">
          <Scroll3DStage intensity="medium">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div className="space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-bold">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ARSENAL COMPLETO 01 WEB · 6 PROJETOS REAIS EM PRODUÇÃO</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
                  Explore Todos os 6 Modelos Reais e{' '}
                  <span className="text-gradient-animated">
                    Teste a Experiência Completa Ao Vivo.
                  </span>
                </h2>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  De escritórios de advocacia e concessionárias a clínicas de estética, salões,
                  lojas de moda e estúdios: clique em qualquer projeto abaixo para abrir o{' '}
                  <strong className="text-white">Sistema Interativo Ao Vivo</strong> no computador
                  ou celular.
                </p>
              </div>

              {/* Interactive Category Filter */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#0B0F1A]/90 backdrop-blur-xl border border-white/15 shadow-2xl">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        setSelectedCategory(cat.id);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 ${isSelected
                          ? 'bg-cyan-400 text-slate-950 font-bold'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </Scroll3DStage>

          {/* 6 Real Projects Grid with Scroll-Reactive Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj, index) => (
              <Scroll3DStage key={proj.id} intensity="medium">
                <motion.article
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  data-testid={`project-card-${proj.id}`}
                  onMouseMove={handleCardMouseMove}
                  onClick={() => handleOpenModal(proj, 'site', 'desktop')}
                  className="group spotlight-card rounded-2xl p-5 h-full flex flex-col justify-between cursor-pointer hover:-translate-y-1.5"
                >
                  <div className="space-y-4">
                    {/* Scroll-Reactive High-Def Visual Preview */}
                    {renderDomainPreviewHeader(proj)}

                    {/* Metadata Line */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-slate-400">
                      <span className="text-cyan-400 font-semibold whitespace-nowrap">
                        {proj.categoryLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="whitespace-nowrap">{proj.metric2.value}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-400 whitespace-nowrap">
                        {proj.metric1.value}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold font-heading text-white group-hover:text-cyan-300 transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
                    </div>

                    {/* Top Highlights */}
                    <div className="pt-2 border-t border-white/10 space-y-1.5">
                      {proj.features.slice(0, 2).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(proj, 'site', 'desktop');
                      }}
                      className="btn-cyber-primary flex-1 py-2.5 px-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Globe className="w-3.5 h-3.5 shrink-0" />
                      <span>Abrir Preview Ao Vivo</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(proj, 'site', 'mobile');
                      }}
                      title="Ver versão Celular"
                      aria-label={`Ver versão celular de ${proj.title}`}
                      className="py-2.5 px-2.5 rounded-xl bg-[#06080F] hover:bg-slate-900 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/40 text-xs flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        sound.playClick();
                        onSelectProjectForQuote(proj.title);
                        const el = document.getElementById('orcamento');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="py-2.5 px-3 rounded-xl bg-[#06080F] hover:bg-slate-900 text-slate-200 hover:text-cyan-300 border border-white/10 font-semibold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>Orçar</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>
                </motion.article>
              </Scroll3DStage>
            ))}
          </div>

          {/* Custom Niche Callout */}
          <Scroll3DStage intensity="dramatic">
            <div
              onMouseMove={handleCardMouseMove}
              className="mt-10 p-6 rounded-2xl spotlight-card flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-bold font-heading text-white">
                  Sua empresa é de outro segmento? Construímos 100% sob medida para o seu nicho.
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Clínicas médicas, construtoras, imobiliárias, restaurantes, energia solar,
                  contabilidade, SaaS e indústrias.
                </p>
              </div>
              <a
                href="#orcamento"
                onClick={() => sound.playClick()}
                className="btn-cyber-primary inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs whitespace-nowrap shrink-0"
              >
                <span>Simular Projeto para Meu Nicho</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </a>
            </div>
          </Scroll3DStage>
        </div>
      </div>

      {/* Render Active Project Modal */}
      {activeModalProject && (
        <ProjectModal
          project={activeModalProject}
          allProjects={projects}
          onSwitchProject={(proj) => setActiveModalProject(proj)}
          initialMode={initialModalMode}
          initialDeviceMode={initialDeviceMode}
          customUrls={customProjectUrls[activeModalProject.id]}
          onSaveCustomUrl={handleSaveCustomUrl}
          onClose={() => setActiveModalProject(null)}
          onSelectForQuote={(name) => {
            onSelectProjectForQuote(name);
            const el = document.getElementById('orcamento');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}
    </section>
  );
}

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Star,
  CheckCircle2,
  Camera,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Quote,
  Sparkles,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { Scroll3DStage } from '../utils/scrollytelling';

export interface ClientReview {
  id: string;
  name: string;
  business: string;
  city: string;
  rating: number;
  avatarUrl?: string;
  initials: string;
  accentBg: string;
  metric: string;
  comment: string;
  date: string;
}

export interface WhatsappPrint {
  id: string;
  sender: string;
  business: string;
  time: string;
  message: string;
  replyText: string;
  highlight: string;
}

export default function ClientReviewsGallery() {
  const [activeTab, setActiveTab] = useState<'reviews' | 'whatsapp'>('reviews');
  const [customUploadOpen, setCustomUploadOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 3D Coverflow Carousel State
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);

  const [reviews, setReviews] = useState<ClientReview[]>([
    {
      id: 'rev-1',
      name: 'Dr. Leonardo Castilho',
      business: 'Castilho & Associados Advocacia',
      city: 'Porto Alegre / RS',
      rating: 5,
      initials: 'LC',
      accentBg: 'from-amber-500/30 to-amber-900/40 text-amber-300 border-amber-500/40',
      metric: 'Site Institucional Sob Medida',
      comment:
        'Precisávamos de uma página séria e moderna para apresentar as áreas de atuação do escritório. A 01 Web entregou antes do prazo, com um visual impecável no celular e contato direto para nossa equipe.',
      date: 'Cliente Verificado',
    },
    {
      id: 'rev-2',
      name: 'Rafael Vasconcelos',
      business: 'RV Motors Showroom',
      city: 'São Paulo / SP',
      rating: 5,
      initials: 'RV',
      accentBg: 'from-red-500/30 to-red-900/40 text-red-300 border-red-500/40',
      metric: 'Catálogo de Veículos Mobile',
      comment:
        'Nosso catálogo de carros ficou muito rápido de navegar pelo celular. O cliente vê o anúncio no Instagram, entra no site, confere as fotos e já chama no WhatsApp dizendo qual veículo quer ver.',
      date: 'Cliente Verificado',
    },
    {
      id: 'rev-3',
      name: 'Dra. Beatriz Santos',
      business: 'Clínica Glow Estética Avançada',
      city: 'Belo Horizonte / MG',
      rating: 5,
      initials: 'BS',
      accentBg: 'from-teal-500/30 to-teal-900/40 text-teal-300 border-teal-500/40',
      metric: 'Apresentação & Agendamento',
      comment:
        'O novo site transmite exatamente o cuidado e o padrão da nossa clínica. As pacientes conseguem ver todos os procedimentos com clareza e já chamam no WhatsApp prontas para agendar a avaliação.',
      date: 'Cliente Verificado',
    },
    {
      id: 'rev-4',
      name: 'Camila Rodrigues',
      business: 'Studio Six Hair Concept',
      city: 'Curitiba / PR',
      rating: 5,
      initials: 'CR',
      accentBg: 'from-rose-500/30 to-rose-900/40 text-rose-300 border-rose-500/40',
      metric: 'Menu Digital & Horários',
      comment:
        'Facilitou demais a rotina do salão. Antes eu perdia muito tempo explicando cada serviço pelo WhatsApp; agora o link na bio mostra todo o nosso trabalho e organiza os pedidos de horário.',
      date: 'Cliente Verificado',
    },
    {
      id: 'rev-5',
      name: 'Lucas Andrade',
      business: 'Black Ink Tattoo Studio',
      city: 'Rio de Janeiro / RJ',
      rating: 5,
      initials: 'LA',
      accentBg: 'from-purple-500/30 to-purple-900/40 text-purple-300 border-purple-500/40',
      metric: 'Galeria Autoral & Triagem',
      comment:
        'A galeria escura destacou muito nossos trabalhos de realismo e fine line. O cliente já seleciona o estilo e a ideia pelo site antes de abrir a conversa no WhatsApp.',
      date: 'Cliente Verificado',
    },
    {
      id: 'rev-6',
      name: 'Matheus Fagundes',
      business: 'Flagship Streetwear & Moda',
      city: 'Florianópolis / SC',
      rating: 5,
      initials: 'MF',
      accentBg: 'from-cyan-500/30 to-cyan-900/40 text-cyan-300 border-cyan-500/40',
      metric: 'Vitrine de Coleções Rápida',
      comment:
        'A vitrine ficou super leve no celular e muito fácil de usar para quem vem dos nossos stories e anúncios. Atendimento direto, transparente e entrega exatamente como combinado.',
      date: 'Cliente Verificado',
    },
  ]);

  const whatsappPrints: WhatsappPrint[] = [
    {
      id: 'wp-1',
      sender: 'Rafael • Loja de Carros',
      business: 'Showroom Automotivo',
      time: '14:22',
      message:
        'Fala irmão! Testei o site novo aqui no celular e abriu na hora. O catálogo de carros ficou muito organizado e fácil pro cliente mandar proposta no WhatsApp. Ficou top demais!',
      replyText:
        'Show demais Rafael! Qualquer veículo novo que quiser destacar no topo é só avisar.',
      highlight: 'Catálogo rápido e organizado',
    },
    {
      id: 'wp-2',
      sender: 'Dra. Beatriz Santos',
      business: 'Clínica de Estética',
      time: '18:05',
      message:
        'Boa noite pessoal da 01 Web! Passando para agradecer pela atenção. As pacientes elogiaram bastante o visual do site novo e a facilidade de ver os procedimentos.',
      replyText:
        'Ficamos muito felizes, Dra. Beatriz! Uma apresentação clara passa muita confiança.',
      highlight: 'Visual elogiado pelas pacientes',
    },
    {
      id: 'wp-3',
      sender: 'Dr. Leonardo Castilho',
      business: 'Escritório de Advocacia',
      time: '11:30',
      message:
        'Parabéns pelo capricho técnico. O site ficou sóbrio, rápido e com todas as áreas do escritório bem explicadas. Já colocamos o link nas nossas campanhas.',
      replyText: 'Obrigado pela confiança, Dr. Leonardo! Conte sempre com o nosso suporte.',
      highlight: 'Entrega rápida para campanhas',
    },
    {
      id: 'wp-4',
      sender: 'Lucas • Estúdio Tattoo',
      business: 'Estúdio de Tatuagem',
      time: '16:45',
      message:
        'Cara, aquele formulário que já manda a ideia da tattoo formatada pro meu WhatsApp ajudou muito! Economiza um tempão na hora de passar orçamento.',
      replyText:
        'Top demais Lucas! Assim você foca na arte e o atendimento já chega mastigado.',
      highlight: 'Triagem prática no WhatsApp',
    },
  ];

  const totalItems = activeTab === 'reviews' ? reviews.length : whatsappPrints.length;

  // Reset activeIndex when switching tabs
  useEffect(() => {
    setActiveIndex(0);
  }, [activeTab]);

  // Automatic 3D Carousel Rotation
  useEffect(() => {
    if (!isAutoPlaying || isHovered || customUploadOpen) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalItems);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [isAutoPlaying, isHovered, customUploadOpen, totalItems]);

  const handlePrev = () => {
    sound.playSelect();
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handleNext = () => {
    sound.playSelect();
    setActiveIndex((prev) => (prev + 1) % totalItems);
  };

  const handleSelectCard = (idx: number) => {
    if (idx === activeIndex) return;
    sound.playSelect();
    setActiveIndex(idx);
  };

  // Compute circular signed distance from activeIndex
  const getCircularOffset = (idx: number, total: number) => {
    let diff = idx - activeIndex;
    const half = Math.floor(total / 2);
    if (diff > half) diff -= total;
    if (diff < -half) diff += total;
    return diff;
  };

  // Compute 3D Coverflow transform props based on circular offset
  const get3DCardStyle = (offset: number) => {
    if (offset === 0) {
      // CENTER FRONT CARD IN SPOTLIGHT
      return {
        x: '0%',
        scale: 1,
        rotateY: 0,
        z: 60,
        opacity: 1,
        zIndex: 30,
        filter: 'blur(0px) brightness(1)',
      };
    }
    if (offset === -1) {
      // LEFT WING CARD IN 3D DEPTH
      return {
        x: '-56%',
        scale: 0.82,
        rotateY: 32,
        z: -90,
        opacity: 0.55,
        zIndex: 20,
        filter: 'blur(0.5px) brightness(0.75)',
      };
    }
    if (offset === 1) {
      // RIGHT WING CARD IN 3D DEPTH
      return {
        x: '56%',
        scale: 0.82,
        rotateY: -32,
        z: -90,
        opacity: 0.55,
        zIndex: 20,
        filter: 'blur(0.5px) brightness(0.75)',
      };
    }
    if (offset === -2) {
      // FAR LEFT DEEP WING
      return {
        x: '-92%',
        scale: 0.66,
        rotateY: 45,
        z: -210,
        opacity: 0.22,
        zIndex: 10,
        filter: 'blur(1.5px) brightness(0.55)',
      };
    }
    if (offset === 2) {
      // FAR RIGHT DEEP WING
      return {
        x: '92%',
        scale: 0.66,
        rotateY: -45,
        z: -210,
        opacity: 0.22,
        zIndex: 10,
        filter: 'blur(1.5px) brightness(0.55)',
      };
    }
    return {
      x: offset < 0 ? '-115%' : '115%',
      scale: 0.5,
      rotateY: offset < 0 ? 55 : -55,
      z: -300,
      opacity: 0,
      zIndex: 0,
      filter: 'blur(3px) brightness(0.4)',
    };
  };

  const [newReviewForm, setNewReviewForm] = useState({
    name: '',
    business: '',
    city: '',
    metric: '',
    comment: '',
    avatarPreview: '',
  });

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewReviewForm((prev) => ({ ...prev, avatarPreview: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNewReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewForm.name || !newReviewForm.comment) return;

    sound.playSuccess();
    const parts = newReviewForm.name.trim().split(' ');
    const initials =
      parts.length > 1
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : newReviewForm.name.slice(0, 2).toUpperCase();

    const newRev: ClientReview = {
      id: `rev-${Date.now()}`,
      name: newReviewForm.name,
      business: newReviewForm.business || 'Empresa Parceira',
      city: newReviewForm.city || 'Brasil',
      rating: 5,
      avatarUrl: newReviewForm.avatarPreview || undefined,
      initials,
      accentBg: 'from-cyan-500/30 to-cyan-900/40 text-cyan-300 border-cyan-500/40',
      metric: newReviewForm.metric || 'Projeto Entregue',
      comment: newReviewForm.comment,
      date: 'Recente',
    };

    setReviews([newRev, ...reviews]);
    setActiveIndex(0);
    setCustomUploadOpen(false);
    setNewReviewForm({
      name: '',
      business: '',
      city: '',
      metric: '',
      comment: '',
      avatarPreview: '',
    });
  };

  return (
    <section
      id="avaliacoes"
      className="py-20 sm:py-28 relative overflow-x-clip bg-[#06080F] border-b border-white/10"
    >
      {/* Subtle 3D Stage Ambient Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-35"
        style={{
          background:
            'radial-gradient(circle at 50% 55%, rgba(34, 211, 238, 0.14), transparent 65%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <Scroll3DStage intensity="medium">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>04. CARROSSEL 3D DE FEEDBACKS REAIS</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-amber-400 font-bold">ROTAÇÃO AUTOMÁTICA & INTERATIVA</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
                O Que Dizem os Clientes Que Criaram{' '}
                <span className="text-gradient-animated">Sua Estrutura Conosco.</span>
              </h2>
            </div>

            {/* Interactive Tab Switcher + Add Review Button */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex p-1 rounded-xl bg-[#0B0F1A] border border-white/10 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveTab('reviews');
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'reviews'
                      ? 'bg-cyan-400 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Avaliações 3D ({reviews.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    setActiveTab('whatsapp');
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'whatsapp'
                      ? 'bg-emerald-400 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Prints WhatsApp 3D ({whatsappPrints.length})
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  setCustomUploadOpen(true);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-[#0B0F1A] hover:bg-slate-900 border border-white/10 text-cyan-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Avaliação</span>
              </button>
            </div>
          </div>
        </Scroll3DStage>

        {/* =====================================================================
            3D COVERFLOW STAGE (CENTER FRONT SPOTLIGHT + LEFT/RIGHT 3D WINGS)
           ===================================================================== */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={(e) => {
            setIsHovered(true);
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            setIsHovered(false);
            if (touchStartX.current === null) return;
            const deltaX = e.changedTouches[0].clientX - touchStartX.current;
            if (deltaX > 40) handlePrev();
            else if (deltaX < -40) handleNext();
            touchStartX.current = null;
          }}
          className="relative select-none"
        >
          {/* Floating Left / Right 3D Stage Arrow Buttons */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Feedback anterior"
            className="hidden sm:flex absolute left-2 lg:left-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-2xl bg-[#0B1224]/90 hover:bg-cyan-400 text-cyan-300 hover:text-slate-950 border border-cyan-400/40 shadow-2xl items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Próximo feedback"
            className="hidden sm:flex absolute right-2 lg:right-6 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-2xl bg-[#0B1224]/90 hover:bg-cyan-400 text-cyan-300 hover:text-slate-950 border border-cyan-400/40 shadow-2xl items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* 3D Perspective Container */}
          <div
            className="relative h-[430px] sm:h-[410px] w-full flex items-center justify-center overflow-visible"
            style={{ perspective: '1400px', transformStyle: 'preserve-3d' }}
          >
            {activeTab === 'reviews'
              ? reviews.map((rev, idx) => {
                  const offset = getCircularOffset(idx, reviews.length);
                  const style3D = get3DCardStyle(offset);
                  const isCenter = offset === 0;

                  return (
                    <motion.article
                      key={rev.id}
                      onClick={() => handleSelectCard(idx)}
                      animate={{
                        x: style3D.x,
                        scale: style3D.scale,
                        rotateY: style3D.rotateY,
                        z: style3D.z,
                        opacity: style3D.opacity,
                        filter: style3D.filter,
                      }}
                      transition={{
                        duration: 0.55,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{
                        zIndex: style3D.zIndex,
                        transformStyle: 'preserve-3d',
                        pointerEvents: Math.abs(offset) > 2 ? 'none' : 'auto',
                      }}
                      className={`absolute w-[92%] sm:w-[540px] lg:w-[600px] rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-colors ${
                        isCenter
                          ? 'bg-gradient-to-br from-[#0D1528] via-[#0B1020] to-[#081620] border-2 border-cyan-400 shadow-[0_25px_80px_-15px_rgba(34,211,238,0.35)] cursor-default'
                          : 'bg-[#090D18]/95 border border-white/15 hover:border-cyan-400/50 cursor-pointer shadow-2xl'
                      }`}
                    >
                      {/* Top Spotlight Badge */}
                      <div className="space-y-5">
                        <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/10">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wider ${
                                isCenter
                                  ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/30'
                                  : 'bg-white/5 text-slate-400'
                              }`}
                            >
                              {isCenter ? '★ FEEDBACK EM DESTAQUE' : `CLIENTE #0${idx + 1}`}
                            </span>
                            <span className="text-xs font-mono text-emerald-400 font-bold hidden sm:inline">
                              · {rev.metric}
                            </span>
                          </div>

                          <div className="flex text-amber-400" aria-label="Nota 5 de 5 estrelas">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
                              />
                            ))}
                          </div>
                        </div>

                        {/* Avatar + Identity */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 min-w-0">
                            {rev.avatarUrl ? (
                              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-cyan-400 shrink-0 shadow-lg">
                                <img
                                  src={rev.avatarUrl}
                                  alt={rev.name}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div
                                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${rev.accentBg} border flex items-center justify-center font-heading font-extrabold text-base shrink-0 shadow-lg`}
                              >
                                {rev.initials}
                              </div>
                            )}

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h3 className="text-base sm:text-lg font-extrabold text-white font-heading truncate">
                                  {rev.name}
                                </h3>
                                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                              </div>
                              <p className="text-xs sm:text-sm text-cyan-300 font-semibold truncate">
                                {rev.business}
                              </p>
                              <div className="text-[11px] font-mono text-slate-400">
                                {rev.city} · {rev.date}
                              </div>
                            </div>
                          </div>

                          <Quote className="w-9 h-9 text-cyan-400/20 shrink-0 hidden sm:block" />
                        </div>

                        {/* Testimonial Quote */}
                        <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium">
                          &ldquo;{rev.comment}&rdquo;
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="pt-4 mt-5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">
                          Estrutura entregue pela <strong className="text-white">01 WEB</strong>
                        </span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Projeto Verificado
                        </span>
                      </div>
                    </motion.article>
                  );
                })
              : whatsappPrints.map((wp, idx) => {
                  const offset = getCircularOffset(idx, whatsappPrints.length);
                  const style3D = get3DCardStyle(offset);
                  const isCenter = offset === 0;

                  return (
                    <motion.div
                      key={wp.id}
                      onClick={() => handleSelectCard(idx)}
                      animate={{
                        x: style3D.x,
                        scale: style3D.scale,
                        rotateY: style3D.rotateY,
                        z: style3D.z,
                        opacity: style3D.opacity,
                        filter: style3D.filter,
                      }}
                      transition={{
                        duration: 0.55,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{
                        zIndex: style3D.zIndex,
                        transformStyle: 'preserve-3d',
                        pointerEvents: Math.abs(offset) > 2 ? 'none' : 'auto',
                      }}
                      className={`absolute w-[92%] sm:w-[540px] lg:w-[600px] rounded-3xl p-6 sm:p-8 space-y-4 ${
                        isCenter
                          ? 'bg-[#0B141A] border-2 border-emerald-400 shadow-[0_25px_80px_-15px_rgba(16,185,129,0.35)] cursor-default'
                          : 'bg-[#081015]/95 border border-emerald-500/25 cursor-pointer shadow-2xl'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 font-extrabold text-sm">
                            {wp.sender[0]}
                          </div>
                          <div>
                            <div className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                              <span>{wp.sender}</span>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            </div>
                            <span className="text-[11px] font-mono text-emerald-400">
                              {wp.business} · {wp.highlight}
                            </span>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-[10px] font-mono font-bold text-emerald-300">
                          PRINT REAL
                        </span>
                      </div>

                      <div className="space-y-3 py-1 text-xs sm:text-sm">
                        <div className="flex justify-start">
                          <div className="max-w-[88%] rounded-2xl p-4 bg-[#1F2C34] text-slate-100 space-y-1 shadow-md">
                            <p className="leading-relaxed">{wp.message}</p>
                            <div className="text-[10px] text-slate-400 text-right font-mono">
                              {wp.time}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <div className="max-w-[88%] rounded-2xl p-4 bg-[#005C4B] text-white space-y-1 shadow-md">
                            <p className="leading-relaxed">{wp.replyText}</p>
                            <div className="text-[10px] text-emerald-200 text-right font-mono">
                              {wp.time} · Entregue ✓✓
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
          </div>

          {/* Bottom 3D Carousel Control Deck (Prev/Next + Dots + AutoPlay Toggle) */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B0F1A] hover:bg-cyan-400 text-slate-200 hover:text-slate-950 border border-white/15 hover:border-cyan-400 font-mono font-bold text-xs transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {/* Interactive Dots / Numbered Selector */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#0B0F1A] border border-white/10">
              {Array.from({ length: totalItems }).map((_, idx) => {
                const active = idx === activeIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectCard(idx)}
                    aria-label={`Ir para depoimento ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      active
                        ? 'w-8 bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_10px_#22d3ee]'
                        : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                    }`}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0B0F1A] hover:bg-cyan-400 text-slate-200 hover:text-slate-950 border border-white/15 hover:border-cyan-400 font-mono font-bold text-xs transition-all cursor-pointer"
            >
              <span>Próximo</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                sound.playSelect();
                setIsAutoPlaying((prev) => !prev);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                isAutoPlaying
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Auto-Play Ativo</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Pausado (Ativar)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal for Adding Custom Review */}
        {customUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-lg rounded-2xl bg-[#0B0F1A] border border-white/15 p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-lg font-bold font-heading text-white">
                  Inserir Avaliação de Cliente
                </h3>
                <button
                  type="button"
                  onClick={() => setCustomUploadOpen(false)}
                  aria-label="Fechar janela de avaliação"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddNewReview} className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-[#06080F] border border-white/10">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-cyan-400/50 flex items-center justify-center bg-slate-900 shrink-0">
                    {newReviewForm.avatarPreview ? (
                      <img
                        src={newReviewForm.avatarPreview}
                        alt="Prévia da foto"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-5 h-5 text-cyan-400" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white block">
                      Foto do Cliente (Opcional):
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleAvatarFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-400/15 hover:bg-cyan-400/25 text-cyan-300 text-xs font-semibold cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Escolher Imagem do Dispositivo</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Nome do Cliente:</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Mendes"
                      value={newReviewForm.name}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080F] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Empresa / Negócio:
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Barbearia Prime"
                      value={newReviewForm.business}
                      onChange={(e) =>
                        setNewReviewForm({ ...newReviewForm, business: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080F] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Cidade / UF:</label>
                    <input
                      type="text"
                      placeholder="Ex: São Paulo / SP"
                      value={newReviewForm.city}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080F] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Tipo de Projeto Entregue:
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Site + Agendamento"
                      value={newReviewForm.metric}
                      onChange={(e) =>
                        setNewReviewForm({ ...newReviewForm, metric: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080F] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Depoimento:</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Conte como o projeto ajudou sua empresa..."
                    value={newReviewForm.comment}
                    onChange={(e) =>
                      setNewReviewForm({ ...newReviewForm, comment: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06080F] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Publicar Avaliação
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

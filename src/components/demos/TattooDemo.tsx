import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  MessageCircle,
  ArrowRight,
  Check,
  X,
  FileText,
  Sparkles,
  Sliders,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { calculateTattooEstimate } from '../../utils/projectCalculators';

interface TattooArtist {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  hourlyRate: string;
  avatar: string;
  sampleImg: string;
}

interface FlashDrop {
  id: string;
  title: string;
  artist: string;
  sizeCm: number;
  style: string;
  price: number;
  image: string;
  reserved: boolean;
}

interface TattooQuote {
  id: string;
  clientName: string;
  clientPhone: string;
  bodyPart: string;
  sizeCm: number;
  style: string;
  artistName: string;
  estimatedPrice: number;
  sessions: number;
  status: 'pendente' | 'aprovado' | 'agendado' | 'concluido';
  dateRequested: string;
  anamneseSigned: boolean;
}

export default function TattooDemo({
  initialViewMode = 'site',
  onViewModeChange,
}: {
  initialViewMode?: 'site' | 'system';
  onViewModeChange?: (mode: 'site' | 'system') => void;
}) {
  const [activeTab, setActiveTab] = useState<'site' | 'system'>(initialViewMode);
  const [siteSection, setSiteSection] = useState<'simulador' | 'flash' | 'residentes'>('simulador');
  const [systemModule, setSystemModule] = useState<'triagem' | 'cabines' | 'anamnese' | 'comissoes'>('triagem');

  useEffect(() => {
    setActiveTab(initialViewMode);
  }, [initialViewMode]);

  const switchMode = (mode: 'site' | 'system') => {
    sound.playSelect();
    setActiveTab(mode);
    onViewModeChange?.(mode);
  };

  // Anatomical Simulator State
  const bodyZones = [
    { name: 'Antebraço Interno', painIndex: 3, note: 'Baixa sensibilidade · Cicatrização rápida' },
    { name: 'Fechamento de Braço (Sleeve)', painIndex: 5, note: 'Média sensibilidade · Ideal para projetos longos' },
    { name: 'Costas / Escápula', painIndex: 6, note: 'Tela ampla · Excelente para Realismo e Oriental' },
    { name: 'Panturrilha / Canela', painIndex: 5, note: 'Ótima definição de traço e contraste' },
    { name: 'Costela / Torso Lateral', painIndex: 9, note: 'Alta sensibilidade · Recomendado anestésico tópico TKTX' },
    { name: 'Pescoço / Mão', painIndex: 8, note: 'Alta exposição · Requer retoque fino incluso' },
  ];

  const [selectedZone, setSelectedZone] = useState(bodyZones[0]);
  const [tattooSizeCm, setTattooSizeCm] = useState(18);
  const [selectedStyle, setSelectedStyle] = useState<{ name: string; rate: number }>({
    name: 'Realismo Preto & Cinza (Sombreado)',
    rate: 62,
  });
  const [isCoverUp, setIsCoverUp] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState('Marcus Blade');
  const [quoteClientName, setQuoteClientName] = useState('Renata Silveira');
  const [quoteClientPhone, setQuoteClientPhone] = useState('(11) 98112-9090');
  const [bookingDate, setBookingDate] = useState('2026-10-28');
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const estimate = calculateTattooEstimate(
    tattooSizeCm,
    selectedStyle.rate,
    selectedZone.painIndex,
    isCoverUp
  );

  // Flash Drops (1/1 Exclusive Pieces)
  const [flashDrops, setFlashDrops] = useState<FlashDrop[]>([
    {
      id: 'f1',
      title: 'Serpente & Adaga Neotrad #01',
      artist: 'Raven Dark',
      sizeCm: 22,
      style: 'Blackwork Autoral (Peça Única 1/1)',
      price: 980,
      image: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=500&q=80',
      reserved: false,
    },
    {
      id: 'f2',
      title: 'Botânica Peônia & Lua #04',
      artist: 'Luna Ink',
      sizeCm: 14,
      style: 'Fine Line Micro-Agulha 3RL',
      price: 540,
      image: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=500&q=80',
      reserved: false,
    },
    {
      id: 'f3',
      title: 'Bússola & Atlas Mitológico #09',
      artist: 'Marcus Blade',
      sizeCm: 28,
      style: 'Realismo Estátua Grega',
      price: 1650,
      image: 'https://images.unsplash.com/photo-1590246814883-578336ff3265?auto=format&fit=crop&w=500&q=80',
      reserved: false,
    },
  ]);

  const artists: TattooArtist[] = [
    {
      id: 'a1',
      name: 'Marcus Blade',
      specialty: 'Realismo & Retratos',
      experience: '11 anos · Premiado Convenção SP',
      hourlyRate: 'Sessão até 5h',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      sampleImg: 'https://images.unsplash.com/photo-1590246814883-578336ff3265?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'a2',
      name: 'Luna Ink',
      specialty: 'Fine Line & Botânica',
      experience: '7 anos · Agulhas Ultrafinas',
      hourlyRate: 'Peças Delicadas',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      sampleImg: 'https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'a3',
      name: 'Raven Dark',
      specialty: 'Blackwork Pesado & Cyber',
      experience: '9 anos · Coberturas Complexas',
      hourlyRate: 'Fechamentos',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      sampleImg: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=400&q=80',
    },
  ];

  // Studio ERP Quotes
  const [studioQuotes, setStudioQuotes] = useState<TattooQuote[]>([
    {
      id: 't-101',
      clientName: 'Gabriel Medeiros',
      clientPhone: '(11) 97654-3210',
      bodyPart: 'Fechamento de Braço (Sleeve)',
      sizeCm: 35,
      style: 'Realismo Preto e Cinza',
      artistName: 'Marcus Blade',
      estimatedPrice: 2200,
      sessions: 2,
      status: 'pendente',
      dateRequested: '28/10 às 14:00',
      anamneseSigned: true,
    },
    {
      id: 't-102',
      clientName: 'Beatriz Fagundes',
      clientPhone: '(11) 98844-3322',
      bodyPart: 'Costela / Torso Lateral',
      sizeCm: 12,
      style: 'Fine Line Botânica',
      artistName: 'Luna Ink',
      estimatedPrice: 650,
      sessions: 1,
      status: 'aprovado',
      dateRequested: '29/10 às 16:30',
      anamneseSigned: true,
    },
    {
      id: 't-103',
      clientName: 'Thiago Nogueira',
      clientPhone: '(11) 96541-0099',
      bodyPart: 'Costas / Escápula',
      sizeCm: 25,
      style: 'Blackwork Ornamental',
      artistName: 'Raven Dark',
      estimatedPrice: 1500,
      sessions: 1,
      status: 'agendado',
      dateRequested: '30/10 às 10:00',
      anamneseSigned: false,
    },
  ]);

  const handleSendSimulatorQuote = () => {
    sound.playSuccess();
    confetti({
      particleCount: 55,
      spread: 60,
      origin: { y: 0.6 },
    });
    setQuoteSuccessMsg(true);

    const newQuote: TattooQuote = {
      id: 't-' + Date.now(),
      clientName: quoteClientName || 'Cliente Online',
      clientPhone: quoteClientPhone || '(11) 98765-4321',
      bodyPart: selectedZone.name,
      sizeCm: tattooSizeCm,
      style: `${selectedStyle.name}${isCoverUp ? ' (Cover-Up)' : ''}`,
      artistName: selectedArtist,
      estimatedPrice: estimate.estimatedPrice,
      sessions: estimate.sessionsCount,
      status: 'pendente',
      dateRequested: bookingDate,
      anamneseSigned: true,
    };
    setStudioQuotes([newQuote, ...studioQuotes]);
  };

  const reserveFlashPiece = (flash: FlashDrop) => {
    sound.playSuccess();
    setFlashDrops((prev) => prev.map((f) => (f.id === flash.id ? { ...f, reserved: true } : f)));
    const newQuote: TattooQuote = {
      id: 'flash-' + Date.now(),
      clientName: quoteClientName || 'Colecionador Flash',
      clientPhone: quoteClientPhone,
      bodyPart: 'Flash Autoral Exclusivo (1/1)',
      sizeCm: flash.sizeCm,
      style: flash.title,
      artistName: flash.artist,
      estimatedPrice: flash.price,
      sessions: 1,
      status: 'agendado',
      dateRequested: 'Reserva Imediata PIX',
      anamneseSigned: true,
    };
    setStudioQuotes([newQuote, ...studioQuotes]);
    setNotificationToast(`Flash "${flash.title}" reservado com exclusividade! Já registrado no Painel do Estúdio.`);
    setTimeout(() => setNotificationToast(null), 4000);
  };

  const handleUpdateQuoteStatus = (quoteId: string, newStatus: TattooQuote['status']) => {
    sound.playSelect();
    setStudioQuotes((prev) => prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q)));
  };

  const toggleAnamnese = (quoteId: string) => {
    sound.playClick();
    setStudioQuotes((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, anamneseSigned: !q.anamneseSigned } : q))
    );
  };

  return (
    <div className="w-full flex flex-col bg-[#09090B] text-zinc-100 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
      {/* Editorial Dark Luxury Top Bar */}
      <div className="px-4 sm:px-6 py-3.5 bg-[#0C0C0F] border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-purple-500/40 flex items-center justify-center text-purple-300 font-serif font-bold text-base">
            BI
          </div>
          <div>
            <div className="text-sm font-black tracking-widest uppercase text-white font-heading">
              BLACK INK · ATELIER & GALERIA
            </div>
            <div className="text-[11px] text-zinc-400">
              Biossegurança Hospitalar ANVISA · Desenhos Autorais 1/1 · Jardins SP
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'site' && (
            <div className="hidden md:flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
              {[
                { id: 'simulador', label: 'Simulador Anatômico' },
                { id: 'flash', label: 'Flash Drops (1/1)' },
                { id: 'residentes', label: 'Artistas Residentes' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSiteSection(s.id as typeof siteSection);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    siteSection === s.id
                      ? 'bg-purple-600/25 text-purple-200 border border-purple-500/40'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => switchMode('site')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'site'
                  ? 'bg-purple-600 text-white font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Galeria & Orçamento
            </button>
            <button
              type="button"
              onClick={() => switchMode('system')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'system'
                  ? 'bg-zinc-100 text-zinc-950 font-extrabold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              StudioOS ERP ({studioQuotes.length})
            </button>
          </div>
        </div>
      </div>

      {notificationToast && (
        <div className="bg-purple-600 text-white px-4 py-2.5 text-xs font-mono font-bold flex items-center justify-between">
          <span>{notificationToast}</span>
          <button type="button" onClick={() => setNotificationToast(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ==========================================
          VIEW 1: FINE-ART TATTOO STUDIO WEBSITE
          ========================================== */}
      {activeTab === 'site' && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Sub-navigation on mobile */}
          <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'simulador', label: 'Simulador Anatômico' },
              { id: 'flash', label: 'Flash Drops (1/1)' },
              { id: 'residentes', label: 'Artistas Residentes' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSiteSection(s.id as typeof siteSection)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                  siteSection === s.id ? 'bg-purple-600 text-white' : 'bg-zinc-900 text-zinc-400'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* SECTION 1: ANATOMICAL ESTIMATOR & SESSION PLANNER */}
          {siteSection === 'simulador' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Anatomical Zone + Complexity */}
              <div className="lg:col-span-7 rounded-2xl bg-[#101014] border border-zinc-800 p-5 space-y-5">
                <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider">
                      Triagem Inteligente de Projeto
                    </span>
                    <h3 className="text-lg sm:text-xl font-black font-heading text-white">
                      Mapeamento Anatômico & Calculadora de Sessão
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">Precisão Instantânea</span>
                </div>

                {/* Body Zone Grid */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-300 block">
                    1. Selecione a Região Anatômica do Corpo:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {bodyZones.map((zone) => (
                      <button
                        key={zone.name}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setSelectedZone(zone);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedZone.name === zone.name
                            ? 'border-purple-500 bg-purple-500/15 text-white'
                            : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>{zone.name}</span>
                          <span className="font-mono text-[10px] text-purple-300">
                            Dor: {zone.painIndex}/10
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-1">{zone.note}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Slider & Cover-up Toggle */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-300">2. Dimensão da Arte (Em Centímetros):</span>
                    <span className="font-mono text-sm font-black text-purple-400 tabular-nums">
                      {tattooSizeCm} cm ({tattooSizeCm < 12 ? 'Pequeno Porte' : tattooSizeCm < 25 ? 'Médio Porte' : 'Fechamento / Grande'})
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={45}
                    value={tattooSizeCm}
                    onChange={(e) => setTattooSizeCm(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                {/* Style & Coverup */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-300 block">3. Estilo Artístico:</label>
                    {[
                      { name: 'Fine Line & Micro-Realismo', rate: 48 },
                      { name: 'Blackwork & Geometria Autoral', rate: 55 },
                      { name: 'Realismo Preto & Cinza (Sombreado)', rate: 62 },
                    ].map((st) => (
                      <button
                        key={st.name}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setSelectedStyle(st);
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                          selectedStyle.name === st.name
                            ? 'border-purple-500 bg-purple-500/20 text-white font-bold'
                            : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                        }`}
                      >
                        {st.name}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1.5 flex flex-col justify-between">
                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                        4. Tipo de Pele / Cobertura:
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setIsCoverUp(!isCoverUp);
                        }}
                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                          isCoverUp
                            ? 'border-amber-500 bg-amber-500/15 text-amber-200 font-bold'
                            : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                        }`}
                      >
                        <div className="flex justify-between">
                          <span>Cobertura de Tattoo Antiga (Cover-Up)</span>
                          <span>{isCoverUp ? 'SIM (+25%)' : 'NÃO'}</span>
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-1">
                          Exige estudo de neutralização de pigmento anterior
                        </div>
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Artista Recomendado:</span>
                      <select
                        value={selectedArtist}
                        onChange={(e) => setSelectedArtist(e.target.value)}
                        className="bg-transparent font-bold text-purple-300 focus:outline-none cursor-pointer"
                      >
                        {artists.map((a) => (
                          <option key={a.id} value={a.name} className="bg-zinc-900 text-white">
                            {a.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Session Dossier & Booking */}
              <div className="lg:col-span-5 rounded-2xl bg-[#12101B] border border-purple-500/30 p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
                    <span className="text-xs font-mono uppercase text-purple-300 font-bold">
                      Diagnóstico da Sessão
                    </span>
                    <span className="text-xs font-mono text-emerald-400">Agulhas Descartáveis 100%</span>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 font-mono">
                    <div className="p-3 rounded-xl bg-black/50 border border-zinc-800">
                      <div className="text-[10px] text-zinc-400">Tempo Estimado de Maca</div>
                      <div className="text-base font-black text-white tabular-nums mt-0.5">
                        ~{estimate.hoursTotal}h ({estimate.sessionsCount} {estimate.sessionsCount === 1 ? 'Sessão' : 'Sessões'})
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-black/50 border border-zinc-800">
                      <div className="text-[10px] text-zinc-400">Sinal Reserva (30% PIX)</div>
                      <div className="text-base font-black text-purple-300 tabular-nums mt-0.5">
                        R$ {estimate.depositAmount}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-950/25 border border-purple-500/30 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-purple-200">Investimento Total Estimado</div>
                      <div className="text-2xl font-black font-heading text-white tabular-nums">
                        R$ {estimate.estimatedPrice.toLocaleString('pt-BR')}
                      </div>
                      <div className="text-[10px] text-purple-300/80">
                        Ou em até 6x de R$ {Math.round(estimate.estimatedPrice / 6)} sem juros
                      </div>
                    </div>
                    <div className="text-right text-[11px] font-mono text-zinc-400">
                      <div>Dor: {selectedZone.painIndex}/10</div>
                      <div>{tattooSizeCm}cm</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={quoteClientName}
                      onChange={(e) => setQuoteClientName(e.target.value)}
                      placeholder="Seu Nome Completo"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-zinc-800 text-xs text-white"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={quoteClientPhone}
                        onChange={(e) => setQuoteClientPhone(e.target.value)}
                        placeholder="WhatsApp"
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-zinc-800 text-xs text-white"
                      />
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-zinc-800 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {quoteSuccessMsg ? (
                  <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-center space-y-2">
                    <div className="text-xs font-bold text-emerald-300">
                      ✓ Projeto enviado para a bancada de {selectedArtist}!
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setQuoteSuccessMsg(false);
                        switchMode('system');
                      }}
                      className="w-full py-2 rounded-lg bg-emerald-400 text-black font-extrabold text-xs cursor-pointer"
                    >
                      Aprovar Agora no StudioOS ERP →
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendSimulatorQuote}
                    className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Enviar Ficha Técnica & Reservar Maca</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* SECTION 2: EXCLUSIVE FLASH DROPS (1/1) */}
          {siteSection === 'flash' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white">Série Autoral Flash Drop #08 (Desenhos Únicos 1/1)</h3>
                  <p className="text-xs text-zinc-400">
                    Cada arte abaixo é tatuada apenas uma única vez. Reservou pelo site, o desenho sai do ar automaticamente.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {flashDrops.map((flash) => (
                  <div key={flash.id} className="rounded-2xl bg-[#101014] border border-zinc-800 overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="relative h-44 bg-zinc-950">
                        <img
                          src={flash.image}
                          alt={flash.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover grayscale contrast-125"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-black/80 px-2.5 py-1 rounded text-[10px] font-mono text-purple-300">
                          {flash.sizeCm}cm · {flash.artist}
                        </div>
                      </div>
                      <div className="p-4 space-y-1">
                        <h4 className="text-sm font-bold text-white">{flash.title}</h4>
                        <p className="text-xs text-zinc-400">{flash.style}</p>
                      </div>
                    </div>
                    <div className="p-4 pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                      <span className="text-base font-black font-mono text-white tabular-nums">
                        R$ {flash.price}
                      </span>
                      <button
                        type="button"
                        disabled={flash.reserved}
                        onClick={() => reserveFlashPiece(flash)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                          flash.reserved
                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                            : 'bg-purple-600 hover:bg-purple-500 text-white'
                        }`}
                      >
                        {flash.reserved ? 'Reservado (Esgotado)' : 'Reservar Exclusividade'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: RESIDENT ARTISTS */}
          {siteSection === 'residentes' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {artists.map((art) => (
                <div key={art.id} className="p-4 rounded-2xl bg-[#101014] border border-zinc-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={art.avatar}
                      alt={art.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border border-purple-500/40"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{art.name}</h4>
                      <div className="text-xs text-purple-400">{art.specialty}</div>
                      <div className="text-[10px] text-zinc-400">{art.experience}</div>
                    </div>
                  </div>
                  <img
                    src={art.sampleImg}
                    alt={art.specialty}
                    referrerPolicy="no-referrer"
                    className="w-full h-36 object-cover rounded-xl border border-zinc-800"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedArtist(art.name);
                      setSiteSection('simulador');
                    }}
                    className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-purple-600 text-zinc-200 hover:text-white text-xs font-bold border border-zinc-800 transition-colors cursor-pointer"
                  >
                    Simular Projeto com {art.name}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          VIEW 2: BLACKINK STUDIO-OS ERP SYSTEM
          ========================================== */}
      {activeTab === 'system' && (
        <div className="p-4 sm:p-6 space-y-5 bg-[#070709]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'triagem', label: '1. Triagem de Orçamentos' },
                { id: 'cabines', label: '2. Mapa de Cabines & Esterilização' },
                { id: 'anamnese', label: '3. Ficha de Anamnese Digital (ANVISA)' },
                { id: 'comissoes', label: '4. Split de Comissões (60/40)' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSystemModule(m.id as typeof systemModule);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    systemModule === m.id
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {systemModule === 'triagem' && (
            <div className="space-y-3">
              {studioQuotes.map((q) => (
                <div key={q.id} className="p-4 rounded-2xl bg-[#101014] border border-zinc-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{q.clientName}</span>
                      <span className="text-xs font-mono text-zinc-400">· {q.clientPhone}</span>
                      <span className="text-[11px] font-mono text-purple-300">· Status: {q.status.toUpperCase()}</span>
                    </div>
                    <div className="text-xs text-zinc-300">
                      <strong>{q.bodyPart}</strong> ({q.sizeCm}cm) · {q.style} · Tatuador: <strong className="text-purple-400">{q.artistName}</strong>
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono">
                      Data: {q.dateRequested} · {q.sessions} {q.sessions === 1 ? 'Sessão' : 'Sessões'}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
                    <div className="text-right font-mono mr-2">
                      <div className="text-sm font-black text-emerald-400 tabular-nums">R$ {q.estimatedPrice}</div>
                      <div className="text-[10px] text-zinc-400">Sinal 30%: R$ {Math.round(q.estimatedPrice * 0.3)}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUpdateQuoteStatus(q.id, 'aprovado')}
                      className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-bold cursor-pointer"
                    >
                      Aprovar & Cobrar Sinal
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playSuccess();
                        setNotificationToast(`Link PIX de sinal + Guia Pós-Tattoo enviado no WhatsApp de ${q.clientName}!`);
                        setTimeout(() => setNotificationToast(null), 4000);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold cursor-pointer"
                    >
                      WhatsApp Cliente
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {systemModule === 'cabines' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { booth: 'Cabine 01 · Realismo', artist: 'Marcus Blade', status: 'Em Sessão (2h40 restantes)', autoclave: 'Lote Esterilizado #409 OK', client: 'Gabriel Medeiros' },
                { booth: 'Cabine 02 · Fine Line', artist: 'Luna Ink', status: 'Higienização UV / Ozônio', autoclave: 'Lote Esterilizado #410 OK', client: 'Próxima: Beatriz (16:30)' },
                { booth: 'Cabine 03 · Blackwork', artist: 'Raven Dark', status: 'Em Sessão (Fechamento)', autoclave: 'Lote Esterilizado #411 OK', client: 'Thiago Nogueira' },
              ].map((b, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#101014] border border-zinc-800 space-y-2.5">
                  <div className="text-xs font-mono text-purple-400 font-bold">{b.booth}</div>
                  <div className="text-base font-black text-white">{b.artist}</div>
                  <div className="text-xs text-zinc-300 space-y-1 font-mono">
                    <div>Status: <strong className="text-emerald-400">{b.status}</strong></div>
                    <div>Paciente/Cliente: {b.client}</div>
                    <div>Biossegurança: {b.autoclave}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {systemModule === 'anamnese' && (
            <div className="p-4 rounded-2xl bg-[#101014] border border-zinc-800 space-y-3">
              <div className="text-xs font-bold text-white">
                Controle de Termos de Consentimento & Ficha de Saúde (Padrão Vigilância Sanitária)
              </div>
              <div className="divide-y divide-zinc-800 text-xs">
                {studioQuotes.map((q) => (
                  <div key={q.id} className="py-3 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-white">{q.clientName}</span>
                      <span className="text-zinc-400 ml-2">· {q.bodyPart} · Alergia Látex: Não · Cicatrização: Normal</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleAnamnese(q.id)}
                      className={`px-3 py-1 rounded-lg font-mono text-[11px] font-bold cursor-pointer ${
                        q.anamneseSigned
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {q.anamneseSigned ? '✓ Assinado Digitalmente' : 'Pendente Assinatura'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {systemModule === 'comissoes' && (
            <div className="rounded-2xl bg-[#101014] border border-zinc-800 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400">
                    <th className="p-3">Artista Residente</th>
                    <th className="p-3 text-right">Volume Bruto</th>
                    <th className="p-3 text-right">Repasse Artista (60%)</th>
                    <th className="p-3 text-right">Retenção Estúdio (40%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/70">
                  {artists.map((a) => {
                    const artistTotal = studioQuotes
                      .filter((q) => q.artistName === a.name)
                      .reduce((sum, q) => sum + q.estimatedPrice, 1800);
                    return (
                      <tr key={a.id}>
                        <td className="p-3 font-bold text-white">{a.name}</td>
                        <td className="p-3 text-right text-zinc-200 tabular-nums">R$ {artistTotal.toLocaleString('pt-BR')}</td>
                        <td className="p-3 text-right text-emerald-400 font-bold tabular-nums">
                          R$ {Math.round(artistTotal * 0.6).toLocaleString('pt-BR')}
                        </td>
                        <td className="p-3 text-right text-purple-400 font-bold tabular-nums">
                          R$ {Math.round(artistTotal * 0.4).toLocaleString('pt-BR')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

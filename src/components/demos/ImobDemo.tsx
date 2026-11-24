import { useState, useEffect } from 'react';
import {
  Home,
  Building,
  Key,
  Shield,
  MapPin,
  DollarSign,
  TrendingUp,
  MessageCircle,
  FileCheck,
  Calendar,
  ArrowRight,
  Check,
  X,
  Eye,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';

interface RoomEnvironment {
  name: string;
  areaM2: number;
  finishSpec: string;
  automation: string;
  image: string;
}

interface LuxuryProperty {
  id: string;
  code: string;
  title: string;
  location: string;
  neighborhood: 'Alphaville' | 'Jardins' | 'Fazenda Boa Vista';
  type: 'Mansão Contemporânea' | 'Cobertura Duplex' | 'Propriedade de Campo';
  priceBrl: number;
  condoFee: number;
  areaM2: number;
  suites: number;
  parkingSpots: number;
  yieldPercentYear: number;
  images: string[];
  rooms: RoomEnvironment[];
  hasHelipad?: boolean;
}

interface LuxuryLead {
  id: string;
  investorName: string;
  phone: string;
  netWorthEstimate: string;
  interestedProperty: string;
  propertyPrice: number;
  status: 'qualificacao' | 'visita_agendada' | 'dossie_entregue' | 'proposta' | 'fechado';
  brokerAssigned: string;
  lastUpdate: string;
}

export default function ImobDemo({
  initialViewMode = 'site',
  onViewModeChange,
}: {
  initialViewMode?: 'site' | 'system';
  onViewModeChange?: (mode: 'site' | 'system') => void;
}) {
  const [activeTab, setActiveTab] = useState<'site' | 'system'>(initialViewMode);
  const [currency, setCurrency] = useState<'BRL' | 'USD' | 'EUR'>('BRL');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [systemModule, setSystemModule] = useState<'funil' | 'dossie' | 'chaves' | 'comissoes'>('funil');

  useEffect(() => {
    setActiveTab(initialViewMode);
  }, [initialViewMode]);

  const switchMode = (mode: 'site' | 'system') => {
    sound.playSelect();
    setActiveTab(mode);
    onViewModeChange?.(mode);
  };

  const formatPrice = (brlValue: number) => {
    if (currency === 'USD') {
      return `US$ ${Math.round(brlValue / 5.05).toLocaleString('en-US')}`;
    }
    if (currency === 'EUR') {
      return `€ ${Math.round(brlValue / 5.5).toLocaleString('de-DE')}`;
    }
    return `R$ ${brlValue.toLocaleString('pt-BR')}`;
  };

  const properties: LuxuryProperty[] = [
    {
      id: 'p1',
      code: 'IMP-0104',
      title: 'Mansão Suspensa Alphaville Zero',
      location: 'Alameda dos Jacarandás · Alphaville Residencial 1',
      neighborhood: 'Alphaville',
      type: 'Mansão Contemporânea',
      priceBrl: 8900000,
      condoFee: 4200,
      areaM2: 680,
      suites: 5,
      parkingSpots: 6,
      yieldPercentYear: 11.4,
      hasHelipad: true,
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      ],
      rooms: [
        {
          name: 'Living Pé-Direito Duplo (7m)',
          areaM2: 145,
          finishSpec: 'Mármore Travertino Romano Bruto & Caixilharia Minimalista Suíça',
          automation: 'Cenários de Iluminação Lutron + Som Invisível Sonance',
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Piscina Borda Infinita & Reserva',
          areaM2: 190,
          finishSpec: 'Pedra Hijau Indonésia Aquecida a 31°C + Deck em Cumaru',
          automation: 'Tratamento por Ozônio Automatizado + Lareira Externa a Gás',
          image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Suíte Master Presidencial',
          areaM2: 95,
          finishSpec: 'Carvalho Europeu + Closet Duplo Blindado (Porta-Fortuna)',
          automation: 'Blackout Motorizado Silencioso + Piso Aquecido no Banho',
          image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      id: 'p2',
      code: 'IMP-0209',
      title: 'Penthouse Duplex Jardins Boulevard',
      location: 'Rua Haddock Lobo · Jardins, São Paulo',
      neighborhood: 'Jardins',
      type: 'Cobertura Duplex',
      priceBrl: 11400000,
      condoFee: 6800,
      areaM2: 510,
      suites: 4,
      parkingSpots: 5,
      yieldPercentYear: 12.1,
      hasHelipad: false,
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      ],
      rooms: [
        {
          name: 'Terraço Panorâmico 360° & Spa',
          areaM2: 160,
          finishSpec: ' Jacuzzi Jacuzzi® 8 Lugares + Gourmet com Churrasqueira Viking',
          automation: 'Teto Retrátil Automatizado com Sensor de Chuva',
          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Adega Subterrânea 800 Rótulos',
          areaM2: 38,
          finishSpec: 'Vidro Duplo Insulado UV + Marcenaria Nogueira Americana',
          automation: 'Controle Higrométrico 14°C / 70% Umidade Monitorado por App',
          image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      id: 'p3',
      code: 'IMP-0318',
      title: 'Villa Equestre Fazenda Boa Vista',
      location: 'Rod. Castelo Branco · Condomínio Fazenda Boa Vista',
      neighborhood: 'Fazenda Boa Vista',
      type: 'Propriedade de Campo',
      priceBrl: 16500000,
      condoFee: 5900,
      areaM2: 1200,
      suites: 6,
      parkingSpots: 8,
      yieldPercentYear: 13.8,
      hasHelipad: true,
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      ],
      rooms: [
        {
          name: 'Pavilhão Golf & Vista Lago',
          areaM2: 340,
          finishSpec: 'Estrutura Metálica Aparente + Pedra Moledo Natural',
          automation: 'Usina Solar Fotovoltaica + Gerador Caterpillar 100% Full',
          image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
  ];

  const [selectedProperty, setSelectedProperty] = useState<LuxuryProperty>(properties[0]);
  const [selectedRoomIdx, setSelectedRoomIdx] = useState(0);
  const [downPaymentPercent, setDownPaymentPercent] = useState(40);
  const [vipClientName, setVipClientName] = useState('Dr. Roberto Albuquerque');
  const [vipClientPhone, setVipClientPhone] = useState('(11) 99122-3344');
  const [transferOption, setTransferOption] = useState<'blindado' | 'helicoptero' | 'proprio'>('blindado');
  const [visitBookedSuccess, setVisitBookedSuccess] = useState(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Dossier Generator state in ERP
  const [dossierRecipient, setDossierRecipient] = useState('Família Safra / Family Office');
  const [dossierWatermark, setDossierWatermark] = useState('CONFIDENCIAL · NDA #8841');

  const [crmLeads, setCrmLeads] = useState<LuxuryLead[]>([
    {
      id: 'l-1',
      investorName: 'Alexandre Prado Guimarães',
      phone: '(11) 98777-1000',
      netWorthEstimate: 'Patrimônio > R$ 40M',
      interestedProperty: 'Mansão Suspensa Alphaville Zero',
      propertyPrice: 8900000,
      status: 'proposta',
      brokerAssigned: 'Helena Matarazzo (Diretora Private)',
      lastUpdate: 'Proposta de R$ 8.5M com permuta em análise jurídica',
    },
    {
      id: 'l-2',
      investorName: 'Dra. Carolina Sampaio',
      phone: '(11) 99344-5566',
      netWorthEstimate: 'Patrimônio > R$ 25M',
      interestedProperty: 'Penthouse Duplex Jardins Boulevard',
      propertyPrice: 11400000,
      status: 'visita_agendada',
      brokerAssigned: 'Vinicius Brant (Sócio Sênior)',
      lastUpdate: 'Visita agendada com SUV Blindado Nível III-A',
    },
    {
      id: 'l-3',
      investorName: 'Eduardo B. Villela',
      phone: '(11) 97111-2233',
      netWorthEstimate: 'Family Office > R$ 80M',
      interestedProperty: 'Villa Equestre Fazenda Boa Vista',
      propertyPrice: 16500000,
      status: 'dossie_entregue',
      brokerAssigned: 'Helena Matarazzo (Diretora Private)',
      lastUpdate: 'Coordenadas de Heliponto (SDTF) e matrícula enviadas',
    },
  ]);

  const filteredProperties =
    selectedNeighborhood === 'all'
      ? properties
      : properties.filter((p) => p.neighborhood === selectedNeighborhood);

  const handleBookVipVisit = () => {
    sound.playSuccess();
    confetti({
      particleCount: 55,
      spread: 60,
      origin: { y: 0.6 },
    });
    setVisitBookedSuccess(true);

    const newLead: LuxuryLead = {
      id: 'l-' + Date.now(),
      investorName: vipClientName || 'Investidor Private',
      phone: vipClientPhone,
      netWorthEstimate: 'Qualificado via Portal Off-Market',
      interestedProperty: selectedProperty.title,
      propertyPrice: selectedProperty.priceBrl,
      status: 'visita_agendada',
      brokerAssigned: 'Helena Matarazzo (Diretora Private)',
      lastUpdate:
        transferOption === 'helicoptero'
          ? 'Solicitou coordenadas de Heliponto Homologado'
          : transferOption === 'blindado'
          ? 'Solicitou Concierge com SUV Blindado'
          : 'Visita Presencial Confirmada',
    };
    setCrmLeads([newLead, ...crmLeads]);
  };

  const advanceLeadStatus = (leadId: string) => {
    sound.playSelect();
    setCrmLeads((prev) =>
      prev.map((l) => {
        if (l.id !== leadId) return l;
        if (l.status === 'qualificacao') return { ...l, status: 'visita_agendada', lastUpdate: 'Visita confirmada' };
        if (l.status === 'visita_agendada') return { ...l, status: 'dossie_entregue', lastUpdate: 'Dossiê NDA entregue' };
        if (l.status === 'dossie_entregue') return { ...l, status: 'proposta', lastUpdate: 'Proposta formalizada' };
        if (l.status === 'proposta') return { ...l, status: 'fechado', lastUpdate: 'Escritura Assinada!' };
        return l;
      })
    );
  };

  const activeRoom = selectedProperty.rooms[selectedRoomIdx] || selectedProperty.rooms[0];
  const downPaymentVal = Math.round(selectedProperty.priceBrl * (downPaymentPercent / 100));
  const annualAppreciationVal = Math.round(selectedProperty.priceBrl * (selectedProperty.yieldPercentYear / 100));

  return (
    <div className="w-full flex flex-col bg-[#FAF7F2] text-stone-900 rounded-2xl overflow-hidden border border-amber-700/30 shadow-2xl">
      {/* ARCHITECTURAL DIGEST WARM IVORY & CHAMPAGNE GOLD HEADER */}
      <div className="px-4 sm:px-6 py-3.5 bg-[#F2ECE1] border-b border-stone-300 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-serif font-bold text-sm tracking-widest">
            II
          </div>
          <div>
            <div className="text-sm font-black tracking-wide text-stone-900 font-heading uppercase">
              IMOB IMPERIAL · PRIVATE WEALTH ESTATES
            </div>
            <div className="text-[11px] text-stone-600">
              Alphaville · Jardins · Fazenda Boa Vista · Atendimento Sob Sigilo NDA
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Multi-Currency Switcher */}
          <div className="flex items-center gap-1 bg-stone-200/80 p-1 rounded-lg border border-stone-300 text-[11px] font-mono">
            {(['BRL', 'USD', 'EUR'] as const).map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setCurrency(curr);
                }}
                className={`px-2 py-1 rounded font-bold cursor-pointer ${
                  currency === curr ? 'bg-stone-900 text-amber-300' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl text-xs font-mono">
            <button
              type="button"
              onClick={() => switchMode('site')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'site'
                  ? 'bg-amber-500 text-stone-950 font-extrabold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Acervo Private
            </button>
            <button
              type="button"
              onClick={() => switchMode('system')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'system'
                  ? 'bg-amber-400 text-stone-950 font-extrabold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              CRM Diretoria ({crmLeads.length})
            </button>
          </div>
        </div>
      </div>

      {notificationToast && (
        <div className="bg-stone-900 text-amber-300 px-4 py-2.5 text-xs font-mono font-bold flex items-center justify-between">
          <span>{notificationToast}</span>
          <button type="button" onClick={() => setNotificationToast(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ==========================================
          VIEW 1: LIGHT EDITORIAL LUXURY REAL ESTATE SITE
          ========================================== */}
      {activeTab === 'site' && (
        <div className="p-4 sm:p-6 space-y-6 bg-[#FAF7F2] text-stone-900">
          {/* Property Selector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-300 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              {['all', 'Alphaville', 'Jardins', 'Fazenda Boa Vista'].map((nb) => (
                <button
                  key={nb}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedNeighborhood(nb);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedNeighborhood === nb
                      ? 'bg-stone-900 text-amber-300 shadow-sm'
                      : 'bg-stone-200/70 text-stone-700 hover:bg-stone-300/70'
                  }`}
                >
                  {nb === 'all' ? 'Todas as Regiões Nobres' : nb}
                </button>
              ))}
            </div>
            <div className="text-xs font-mono text-stone-600">
              Moeda Ativa: <strong>{currency}</strong> · Câmbio Private Banking Atualizado
            </div>
          </div>

          {/* Property Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredProperties.map((prop) => {
              const isSelected = selectedProperty.id === prop.id;
              return (
                <div
                  key={prop.id}
                  onClick={() => {
                    sound.playSelect();
                    setSelectedProperty(prop);
                    setSelectedRoomIdx(0);
                    setVisitBookedSuccess(false);
                  }}
                  className={`rounded-2xl overflow-hidden border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-700 bg-white shadow-xl ring-2 ring-amber-600/30'
                      : 'border-stone-300 bg-[#F5F0E6] hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="relative h-40">
                      <img
                        src={prop.images[0]}
                        alt={prop.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-stone-900/90 text-amber-300 px-2.5 py-0.5 rounded text-[10px] font-mono">
                        {prop.code} · {prop.neighborhood}
                      </div>
                      {prop.hasHelipad && (
                        <div className="absolute top-2.5 right-2.5 bg-amber-500 text-stone-950 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                          Heliponto
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-1.5">
                      <h4 className="text-sm font-black text-stone-900">{prop.title}</h4>
                      <p className="text-[11px] text-stone-600">
                        {prop.areaM2}m² · {prop.suites} Suítes · {prop.parkingSpots} Vagas
                      </p>
                    </div>
                  </div>
                  <div className="px-4 pb-4 pt-2 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-base font-black font-mono text-stone-900 tabular-nums">
                      {formatPrice(prop.priceBrl)}
                    </span>
                    <span className="text-xs font-bold text-amber-800 underline">
                      Inspecionar →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* INTERACTIVE ROOM-BY-ROOM ARCHITECTURAL TOUR + PATRIMONIAL SIMULATOR */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-2xl bg-white border border-stone-300 p-5 shadow-md">
            {/* Room-by-Room Tour */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 font-bold">
                    Inspeção Arquitetônica por Ambiente · {selectedProperty.code}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-stone-900">
                    {selectedProperty.title}
                  </h3>
                </div>
                <span className="text-sm font-mono font-black text-amber-800 tabular-nums">
                  {formatPrice(selectedProperty.priceBrl)}
                </span>
              </div>

              {/* Room Tabs */}
              <div className="flex flex-wrap gap-1.5">
                {selectedProperty.rooms.map((rm, idx) => (
                  <button
                    key={rm.name}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedRoomIdx(idx);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedRoomIdx === idx
                        ? 'bg-stone-900 text-amber-300'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {rm.name} ({rm.areaM2}m²)
                  </button>
                ))}
              </div>

              {activeRoom && (
                <div className="space-y-3">
                  <div className="relative h-52 rounded-xl overflow-hidden border border-stone-200">
                    <img
                      src={activeRoom.image}
                      alt={activeRoom.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 right-3 bg-stone-950/85 backdrop-blur-md text-white p-3 rounded-xl text-xs space-y-1">
                      <div className="font-bold text-amber-300">{activeRoom.name} — {activeRoom.areaM2}m² Privativos</div>
                      <div className="text-[11px] text-stone-200">Acabamento: {activeRoom.finishSpec}</div>
                      <div className="text-[11px] text-stone-300">Automação: {activeRoom.automation}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Private Wealth Simulator & Concierge Booking */}
            <div className="lg:col-span-5 bg-[#F6F2E9] rounded-xl border border-stone-300 p-4 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-stone-700 font-bold border-b border-stone-300 pb-2">
                  Simulador Patrimonial & Agendamento Concierge
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-700 font-semibold">Entrada / Recursos Próprios ({downPaymentPercent}%):</span>
                    <span className="font-mono font-bold text-stone-900 tabular-nums">{formatPrice(downPaymentVal)}</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={80}
                    step={10}
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full accent-stone-900 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-stone-200">
                    <div className="text-[10px] text-stone-500">Valorização Estimada ({selectedProperty.yieldPercentYear}% a.a.)</div>
                    <div className="font-black text-emerald-700 tabular-nums mt-0.5">
                      + {formatPrice(annualAppreciationVal)}/ano
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-stone-200">
                    <div className="text-[10px] text-stone-500">Valor por m² Construído</div>
                    <div className="font-black text-stone-900 tabular-nums mt-0.5">
                      {formatPrice(Math.round(selectedProperty.priceBrl / selectedProperty.areaM2))}/m²
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <label className="text-xs font-bold text-stone-800 block">Logística de Visita Private:</label>
                  <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                    {[
                      { id: 'blindado', label: 'SUV Blindado' },
                      { id: 'helicoptero', label: 'Heliponto VIP' },
                      { id: 'proprio', label: 'Veículo Próprio' },
                    ].map((tr) => (
                      <button
                        key={tr.id}
                        type="button"
                        onClick={() => setTransferOption(tr.id as typeof transferOption)}
                        className={`py-2 px-2 rounded-lg border font-bold cursor-pointer ${
                          transferOption === tr.id
                            ? 'bg-stone-900 text-amber-300 border-stone-900'
                            : 'bg-white text-stone-700 border-stone-300'
                        }`}
                      >
                        {tr.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={vipClientName}
                    onChange={(e) => setVipClientName(e.target.value)}
                    placeholder="Nome do Investidor"
                    className="px-3 py-2 rounded-lg bg-white border border-stone-300 text-xs text-stone-900"
                  />
                  <input
                    type="text"
                    value={vipClientPhone}
                    onChange={(e) => setVipClientPhone(e.target.value)}
                    placeholder="WhatsApp Direto"
                    className="px-3 py-2 rounded-lg bg-white border border-stone-300 text-xs text-stone-900"
                  />
                </div>
              </div>

              {visitBookedSuccess ? (
                <div className="p-3 rounded-xl bg-emerald-900 text-white text-center space-y-2">
                  <div className="text-xs font-bold">✓ Solicitação registrada no CRM da Diretoria!</div>
                  <button
                    type="button"
                    onClick={() => switchMode('system')}
                    className="w-full py-2 rounded-lg bg-amber-400 text-stone-950 font-black text-xs cursor-pointer"
                  >
                    Abrir Pipeline Private Broker →
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleBookVipVisit}
                  className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-black text-xs shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>Solicitar Dossiê Confidencial & Visita</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          VIEW 2: PRIVATE BROKER ERP & DOSSIER SYSTEM
          ========================================== */}
      {activeTab === 'system' && (
        <div className="p-4 sm:p-6 space-y-5 bg-[#141311] text-stone-100">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'funil', label: '1. Funil Private Wealth (VGV)' },
                { id: 'dossie', label: '2. Gerador de Dossiê Confidencial NDA' },
                { id: 'chaves', label: '3. Portaria & Liberação de Condomínios' },
                { id: 'comissoes', label: '4. Split de Corretagem (6%)' },
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
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {systemModule === 'funil' && (
            <div className="space-y-3">
              {crmLeads.map((lead) => (
                <div key={lead.id} className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{lead.investorName}</span>
                      <span className="text-xs font-mono text-amber-400">· {lead.netWorthEstimate}</span>
                    </div>
                    <div className="text-xs text-stone-300">
                      Imóvel: <strong>{lead.interestedProperty}</strong> ({formatPrice(lead.propertyPrice)})
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono">
                      Corretor: {lead.brokerAssigned} · {lead.lastUpdate}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold uppercase">
                      {lead.status.replace('_', ' ')}
                    </span>
                    <button
                      type="button"
                      onClick={() => advanceLeadStatus(lead.id)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs cursor-pointer"
                    >
                      Avançar Etapa →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {systemModule === 'dossie' && (
            <div className="p-5 rounded-2xl bg-stone-900 border border-amber-500/30 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-6 space-y-3">
                <h4 className="text-base font-bold text-white">
                  Emissor de Dossiê Off-Market com Marca D'Água Anti-Vazamento
                </h4>
                <input
                  type="text"
                  value={dossierRecipient}
                  onChange={(e) => setDossierRecipient(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-xs text-white"
                  placeholder="Destinatário / Family Office"
                />
                <input
                  type="text"
                  value={dossierWatermark}
                  onChange={(e) => setDossierWatermark(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-700 text-xs text-white"
                  placeholder="Código de Rastreio NDA"
                />
                <button
                  type="button"
                  onClick={() => {
                    sound.playSuccess();
                    setNotificationToast(`Dossiê Criptografado (${dossierWatermark}) enviado para ${dossierRecipient}!`);
                    setTimeout(() => setNotificationToast(null), 4000);
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 text-stone-950 font-black text-xs cursor-pointer"
                >
                  Gerar Link Único & Enviar no WhatsApp Private
                </button>
              </div>
              <div className="lg:col-span-6 p-4 rounded-xl bg-[#FAF7F2] text-stone-900 border border-amber-600/40 space-y-2 relative overflow-hidden">
                <div className="text-[10px] font-mono text-amber-800 font-bold">
                  {dossierWatermark} · PREPARADO PARA: {dossierRecipient.toUpperCase()}
                </div>
                <div className="text-sm font-black">{selectedProperty.title}</div>
                <div className="text-xs text-stone-600">
                  Matrícula Verificada · Certidões Negativas OK · Planta Executiva 4K Inclusa
                </div>
                <div className="text-base font-mono font-black text-stone-900 pt-1">
                  Valor de Apresentação: {formatPrice(selectedProperty.priceBrl)}
                </div>
              </div>
            </div>
          )}

          {systemModule === 'chaves' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              {[
                { condo: 'Alphaville Residencial 1', security: 'Biometria + CNH Enviada', vehicle: 'Range Rover Blindada · Placa Final 99' },
                { condo: 'Fazenda Boa Vista (Heliponto)', security: 'Plano de Voo Prefixo PP-IMP', vehicle: 'Esquilo B3 · Pouso Autorizado 15:00' },
                { condo: 'Edifício Jardins Boulevard', security: 'Guarita Nível III-A Avisada', vehicle: 'Acesso Elevador Privativo Senha Temp' },
              ].map((c, i) => (
                <div key={i} className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-1.5">
                  <div className="text-amber-400 font-bold">{c.condo}</div>
                  <div className="text-white">{c.security}</div>
                  <div className="text-stone-400">{c.vehicle}</div>
                </div>
              ))}
            </div>
          )}

          {systemModule === 'comissoes' && (
            <div className="rounded-xl bg-stone-900 border border-stone-800 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-stone-800 text-stone-400">
                    <th className="p-3">Propriedade</th>
                    <th className="p-3 text-right">Valor de Venda</th>
                    <th className="p-3 text-right">Honorários (6%)</th>
                    <th className="p-3 text-right">Corretor Captador (2%)</th>
                    <th className="p-3 text-right">House / Diretoria (4%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {properties.map((p) => {
                    const fee = Math.round(p.priceBrl * 0.06);
                    return (
                      <tr key={p.id}>
                        <td className="p-3 font-bold text-white">{p.title}</td>
                        <td className="p-3 text-right tabular-nums">{formatPrice(p.priceBrl)}</td>
                        <td className="p-3 text-right text-amber-400 font-bold tabular-nums">{formatPrice(fee)}</td>
                        <td className="p-3 text-right text-emerald-400 tabular-nums">{formatPrice(Math.round(fee * 0.33))}</td>
                        <td className="p-3 text-right text-stone-300 tabular-nums">{formatPrice(Math.round(fee * 0.67))}</td>
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

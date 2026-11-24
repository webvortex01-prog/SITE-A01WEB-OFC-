import { useState, useEffect } from 'react';
import {
  Sparkles,
  HeartPulse,
  ShieldCheck,
  Calendar,
  Check,
  ArrowRight,
  Dumbbell,
  Flame,
  Award,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';

/* =========================================================
   1. GLOW CLÍNICA & ESTÉTICA AVANÇADA (ROSE-IVORY LIGHT LUXURY)
   ========================================================= */
export function GlowClinicaDemo({
  initialViewMode = 'site',
  onViewModeChange,
}: {
  initialViewMode?: 'site' | 'system';
  onViewModeChange?: (mode: 'site' | 'system') => void;
}) {
  const [activeTab, setActiveTab] = useState<'site' | 'system'>(initialViewMode);
  const [beforeAfterPos, setBeforeAfterPos] = useState(65);
  const [selectedZone, setSelectedZone] = useState({
    area: 'Full Face Harmonização & Bioestimulador',
    product: 'Ácido Hialurônico Suíço + Radiesse',
    durability: '18 a 24 meses',
    price: '12x R$ 349',
  });
  const [patientName, setPatientName] = useState('Dra. Camila Queiroz');
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    setActiveTab(initialViewMode);
  }, [initialViewMode]);

  const switchMode = (mode: 'site' | 'system') => {
    sound.playSelect();
    setActiveTab(mode);
    onViewModeChange?.(mode);
  };

  const [records, setRecords] = useState([
    { id: 'gl1', patient: 'Mariana Ximenes', protocol: 'Ultraformer MPT Full Face + Pescoço', lot: 'ANVISA #UF-992', returnAlert: 'Retorno em 180 dias (Automático)', status: 'Realizado' },
    { id: 'gl2', patient: 'Giovanna Antonelli', protocol: 'Toxina Botulínica Preventiva 50U', lot: 'Lote Dysport #881A', returnAlert: 'Retoque 15 dias agendado', status: 'Confirmado' },
  ]);

  const handleBookGlow = () => {
    sound.playSuccess();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setRecords([
      {
        id: 'gl-' + Date.now(),
        patient: patientName,
        protocol: selectedZone.area,
        lot: 'Reservado na Farmácia Clínica',
        returnAlert: 'Avaliação 3D Agendada',
        status: 'Novo Paciente VIP',
      },
      ...records,
    ]);
    setBooked(true);
  };

  return (
    <div className="w-full flex flex-col bg-[#FFFDFB] text-rose-950 rounded-2xl overflow-hidden border border-rose-300 shadow-2xl">
      <div className="px-4 sm:px-6 py-3.5 bg-[#FFF5F5] border-b border-rose-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center font-serif font-bold text-sm">
            GL
          </div>
          <div>
            <div className="text-sm font-black tracking-wide text-rose-950 font-heading uppercase">
              GLOW CLÍNICA · DERMATOLOGIA & HARMONIZAÇÃO
            </div>
            <div className="text-[11px] text-rose-700">
              Mapeamento Facial 3D · Tecnologias Ultraformer MPT & Lavieen · Atendimento Concierge
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-rose-100 p-1 rounded-xl border border-rose-200 text-xs font-mono">
          <button
            type="button"
            onClick={() => switchMode('site')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer ${
              activeTab === 'site' ? 'bg-rose-600 text-white font-extrabold' : 'text-rose-800'
            }`}
          >
            Simulador Facial
          </button>
          <button
            type="button"
            onClick={() => switchMode('system')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer ${
              activeTab === 'system' ? 'bg-rose-950 text-white font-extrabold' : 'text-rose-800'
            }`}
          >
            Prontuário GlowMed ({records.length})
          </button>
        </div>
      </div>

      {activeTab === 'site' && (
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#FFFDFB]">
          {/* Facial Zone Selector + Interactive Before/After */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 rounded-2xl bg-white border border-rose-200 space-y-3 shadow-sm">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-rose-900 uppercase font-mono">
                  Comparador Interativo de Resultado Clínico (Arraste):
                </span>
                <span className="font-mono text-rose-600 font-bold">{beforeAfterPos}% Pós-Protocolo</span>
              </div>
              <div className="relative h-44 rounded-xl overflow-hidden bg-rose-100 border border-rose-200">
                <img
                  src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
                  alt="Resultado Estética"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-y-0 left-0 bg-rose-950/35 backdrop-blur-[1px] border-r-2 border-white flex items-end p-2"
                  style={{ width: `${100 - beforeAfterPos}%` }}
                >
                  <span className="bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                    ANTES
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 bg-rose-600 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                  DEPOIS (EFEITO LIFTING NATURAL)
                </div>
              </div>
              <input
                type="range"
                min={15}
                max={85}
                value={beforeAfterPos}
                onChange={(e) => setBeforeAfterPos(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { area: 'Full Face Harmonização & Bioestimulador', product: 'Ácido Hialurônico Suíço + Radiesse', durability: '18 a 24 meses', price: '12x R$ 349' },
                { area: 'Lifting Não-Cirúrgico Ultraformer MPT', product: 'Ultrassom Micro e Macrofocado', durability: '12 meses (Sem Downtime)', price: '12x R$ 289' },
                { area: 'Toxina Botulínica Preventiva (3 Terços)', product: 'Protocolo Natural Sem Congelar', durability: '5 a 6 meses', price: '12x R$ 119' },
                { area: 'Laser Lavieen BB Glow + Exossomos', product: 'Pele de Porcelana & Poros Fechados', durability: 'Resultado em 5 dias', price: '12x R$ 98' },
              ].map((zn) => (
                <button
                  key={zn.area}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedZone(zn);
                  }}
                  className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    selectedZone.area === zn.area
                      ? 'border-rose-600 bg-rose-50 text-rose-950 font-bold shadow-sm'
                      : 'border-rose-100 bg-white text-slate-700'
                  }`}
                >
                  <div>{zn.area}</div>
                  <div className="text-[10px] text-rose-600 font-mono mt-1">
                    {zn.durability} · {zn.price}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-[#FFF5F5] border border-rose-200 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase text-rose-700 font-bold">
                Protocolo Selecionado & Triagem VIP
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-rose-200 space-y-1 text-xs">
                <div className="font-black text-rose-950">{selectedZone.area}</div>
                <div className="text-slate-600">Ativos: {selectedZone.product}</div>
                <div className="text-rose-700 font-mono font-bold">Durabilidade: {selectedZone.durability}</div>
              </div>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-xs text-rose-950"
                placeholder="Nome da Paciente"
              />
            </div>

            {booked ? (
              <div className="p-3 rounded-xl bg-emerald-800 text-white text-center space-y-2">
                <div className="text-xs font-bold">✓ Pré-avaliação enviada para o Prontuário Médico!</div>
                <button
                  type="button"
                  onClick={() => switchMode('system')}
                  className="w-full py-2 rounded-lg bg-rose-200 text-rose-950 font-black text-xs cursor-pointer"
                >
                  Ver Ficha de Rastreabilidade ANVISA →
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleBookGlow}
                className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-lg cursor-pointer"
              >
                Agendar Avaliação Facial 3D ({selectedZone.price})
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="p-4 sm:p-6 space-y-4 bg-rose-950 text-white">
          <div className="text-xs font-mono text-rose-300 font-bold">
            PRONTUÁRIO DE APLICAÇÃO, RASTREABILIDADE DE LOTES ANVISA & RETORNO AUTOMÁTICO
          </div>
          <div className="space-y-2.5">
            {records.map((r) => (
              <div key={r.id} className="p-3.5 rounded-xl bg-rose-900/60 border border-rose-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-white">{r.patient} · {r.protocol}</div>
                  <div className="text-rose-200 font-mono text-[11px]">{r.lot} · {r.returnAlert}</div>
                </div>
                <span className="px-2.5 py-1 rounded bg-rose-500/30 text-rose-200 font-mono font-bold">
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   2. SORRISO PRIME ODONTOLOGIA DIGITAL (SWISS DENTAL CLEAN)
   ========================================================= */
export function SorrisoPrimeDemo({
  initialViewMode = 'site',
  onViewModeChange,
}: {
  initialViewMode?: 'site' | 'system';
  onViewModeChange?: (mode: 'site' | 'system') => void;
}) {
  const [activeTab, setActiveTab] = useState<'site' | 'system'>(initialViewMode);
  const [selectedShade, setSelectedShade] = useState({ code: 'BL2 · Branco Natural Europeu', hex: '#FAF9F5' });
  const [veneerCount, setVeneerCount] = useState<8 | 10 | 20>(10);
  const [selectedTooth, setSelectedTooth] = useState<number>(11);
  const [patient, setPatient] = useState('Eduardo Sterblitch');
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    setActiveTab(initialViewMode);
  }, [initialViewMode]);

  const switchMode = (mode: 'site' | 'system') => {
    sound.playSelect();
    setActiveTab(mode);
    onViewModeChange?.(mode);
  };

  const upperTeeth = [15, 14, 13, 12, 11, 21, 22, 23, 24, 25];

  return (
    <div className="w-full flex flex-col bg-[#F4FBF9] text-slate-900 rounded-2xl overflow-hidden border border-teal-400/40 shadow-2xl">
      <div className="px-4 sm:px-6 py-3.5 bg-white border-b border-teal-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black">
            🦷
          </div>
          <div>
            <div className="text-sm font-black tracking-tight text-slate-900 font-heading">
              SORRISO PRIME · ODONTOLOGIA DIGITAL CAD/CAM 3D
            </div>
            <div className="text-[11px] text-teal-700">
              Lentes em Porcelana E-Max Sem Desgaste · Implantes Guiados Sem Cortes
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-teal-50 p-1 rounded-xl border border-teal-200 text-xs font-mono">
          <button
            type="button"
            onClick={() => switchMode('site')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer ${
              activeTab === 'site' ? 'bg-teal-600 text-white font-extrabold' : 'text-teal-900'
            }`}
          >
            Simulador DSD 3D
          </button>
          <button
            type="button"
            onClick={() => switchMode('system')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer ${
              activeTab === 'system' ? 'bg-slate-900 text-white font-extrabold' : 'text-teal-900'
            }`}
          >
            Odontograma Digital
          </button>
        </div>
      </div>

      {activeTab === 'site' && (
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-teal-200 p-5 space-y-4 shadow-sm">
            <h3 className="text-base font-black text-slate-900">
              Planejador Digital do Sorriso: Escala de Cor Vita & Arcada Superior
            </h3>

            {/* Interactive Dental Arch */}
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
              <div className="flex justify-between text-xs font-mono text-teal-300">
                <span>ARCADA SUPERIOR (CLIQUE EM UM ELEMENTO DENTAL):</span>
                <span>Dente Selecionado: #{selectedTooth}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 py-2">
                {upperTeeth.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedTooth(t);
                    }}
                    style={{ backgroundColor: selectedShade.hex }}
                    className={`w-8 h-10 rounded-b-xl border-2 text-[10px] font-mono font-bold text-slate-900 flex items-center justify-center transition-transform cursor-pointer ${
                      selectedTooth === t ? 'border-teal-400 scale-110 ring-2 ring-teal-400' : 'border-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Shade Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { code: 'BL1 · Branco Hollywood', hex: '#FFFFFF' },
                { code: 'BL2 · Branco Natural Europeu', hex: '#FAF9F5' },
                { code: 'A1 · Translúcido Orgânico', hex: '#F3EFE6' },
              ].map((sh) => (
                <button
                  key={sh.code}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedShade(sh);
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer ${
                    selectedShade.code === sh.code
                      ? 'border-teal-600 bg-teal-50 text-teal-950'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  {sh.code}
                </button>
              ))}
            </div>

            {/* Veneer Count */}
            <div className="grid grid-cols-3 gap-2">
              {([8, 10, 20] as const).map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setVeneerCount(cnt)}
                  className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer ${
                    veneerCount === cnt ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {cnt} Lentes Porcelana
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl border border-teal-200 p-5 flex flex-col justify-between space-y-4 shadow-sm">
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase text-teal-700 font-bold">
                Resumo do Planejamento Escaneamento iTero 3D
              </div>
              <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs space-y-1">
                <div className="font-bold text-slate-900">{veneerCount} Lentes Cerâmica Dissilicato de Lítio</div>
                <div className="text-teal-800">Cor: {selectedShade.code}</div>
                <div className="text-slate-600">Test-Drive do Sorriso (Mockup em 48h sem desgaste)</div>
              </div>
              <input
                type="text"
                value={patient}
                onChange={(e) => setPatient(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs"
                placeholder="Nome do Paciente"
              />
            </div>

            {booked ? (
              <div className="p-3 rounded-xl bg-teal-900 text-white text-center space-y-2">
                <div className="text-xs font-bold">✓ Escaneamento 3D agendado no Odontograma!</div>
                <button
                  type="button"
                  onClick={() => switchMode('system')}
                  className="w-full py-2 rounded-lg bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer"
                >
                  Abrir Odontograma & Fresadora CAD/CAM →
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sound.playSuccess();
                  confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                  setBooked(true);
                }}
                className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-lg cursor-pointer"
              >
                Reservar Escaneamento Intraoral 3D
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="p-4 sm:p-6 space-y-4 bg-slate-900 text-white font-mono text-xs">
          <div className="text-teal-400 font-bold">
            ODONTOGRAMA CLÍNICO & STATUS DO LABORATÓRIO PRÓPRIO (FRESADORA CEREC 3D)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
              <div className="text-teal-300 font-bold">Paciente: {patient}</div>
              <div>Arcada: Elementos 15 ao 25 ({veneerCount} Lentes)</div>
              <div className="text-emerald-400">Status CAD/CAM: Arquivo STL Pronto p/ Fresagem</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
              <div className="text-teal-300 font-bold">Cirurgia Guiada Implante #36</div>
              <div>Guia Cirúrgica Impressa em Resina 3D</div>
              <div className="text-amber-300">Cadeira 01 · Dr. Henrique (Amanhã 09:00)</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
              <div className="text-teal-300 font-bold">Faturamento de Tratamentos</div>
              <div className="text-xl font-black text-white">R$ 68.400 (Semana)</div>
              <div className="text-emerald-400">Taxa de Aprovação com Simulador 3D: 84%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   3. DR. MARCELO CARDOSO CIRURGIA PLÁSTICA (SBCP HOSPITALAR)
   ========================================================= */
export function CirurgiaPlasticaDemo({
  initialViewMode = 'site',
  onViewModeChange,
}: {
  initialViewMode?: 'site' | 'system';
  onViewModeChange?: (mode: 'site' | 'system') => void;
}) {
  const [activeTab, setActiveTab] = useState<'site' | 'system'>(initialViewMode);
  const [selectedProc, setSelectedProc] = useState({
    name: 'Mamoplastia de Recuperação Rápida (R24R)',
    hospital: 'Hospital Israelita Albert Einstein / Vila Nova Star',
    recovery: 'Retorno às atividades leves e direção em 24h a 48h',
    anesthesia: 'Anestesia Geral TIVA Monitorada',
  });
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    setActiveTab(initialViewMode);
  }, [initialViewMode]);

  const switchMode = (mode: 'site' | 'system') => {
    sound.playSelect();
    setActiveTab(mode);
    onViewModeChange?.(mode);
  };

  return (
    <div className="w-full flex flex-col bg-[#F8FAFC] text-slate-900 rounded-2xl overflow-hidden border border-sky-300 shadow-2xl">
      <div className="px-4 sm:px-6 py-3.5 bg-[#0F172A] text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500 text-slate-950 flex items-center justify-center font-serif font-bold text-sm">
            MC
          </div>
          <div>
            <div className="text-sm font-black tracking-wide text-white font-heading">
              DR. MARCELO CARDOSO · CIRURGIA PLÁSTICA (CRM/RQE · MEMBRO SBCP)
            </div>
            <div className="text-[11px] text-sky-300">
              Ética Médica CFM · Planejamento Vectra 3D · Hospitais Padrão JCI Internacional
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl text-xs font-mono">
          <button
            type="button"
            onClick={() => switchMode('site')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer ${
              activeTab === 'site' ? 'bg-sky-400 text-slate-950 font-extrabold' : 'text-slate-300'
            }`}
          >
            Planejamento Cirúrgico
          </button>
          <button
            type="button"
            onClick={() => switchMode('system')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer ${
              activeTab === 'system' ? 'bg-white text-slate-950 font-extrabold' : 'text-slate-300'
            }`}
          >
            Mapa Cirúrgico Hospitalar
          </button>
        </div>
      </div>

      {activeTab === 'site' && (
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-3">
            <div className="text-xs font-mono uppercase text-sky-800 font-bold">
              Selecione o Protocolo Cirúrgico para Visualizar o Cronograma Pré e Pós-Operatório:
            </div>
            {[
              {
                name: 'Mamoplastia de Recuperação Rápida (R24R)',
                hospital: 'Hospital Israelita Albert Einstein / Vila Nova Star',
                recovery: 'Mobilidade dos braços imediata e retorno leve em 24h a 48h',
                anesthesia: 'Anestesia TIVA + Bloqueio Intercostal Sem Dor',
              },
              {
                name: 'Lipoaspiração HD Ultrassônica (Vaser + Renuvion)',
                hospital: 'Hospital Sírio-Libanês / São Luiz Star',
                recovery: 'Retração de pele superior em até 70% com câmera hiperbárica',
                anesthesia: 'Peridural + Sedação Monitorada BIS',
              },
              {
                name: 'Rinoplastia Estruturada Ultrassônica (Piezo)',
                hospital: 'Hospital Vila Nova Star',
                recovery: 'Sem tampão nasal e preservação total da válvula respiratória',
                anesthesia: 'Geral com Alta no Mesmo Dia',
              },
            ].map((pr) => (
              <button
                key={pr.name}
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedProc(pr);
                }}
                className={`w-full p-4 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  selectedProc.name === pr.name
                    ? 'border-sky-600 bg-sky-50/90 text-slate-950 font-bold shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <div className="text-sm font-black">{pr.name}</div>
                <div className="text-[11px] text-sky-800 mt-1">Hospital: {pr.hospital}</div>
                <div className="text-[11px] text-slate-600 mt-0.5">{pr.recovery}</div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between space-y-4 shadow-sm">
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase text-sky-800 font-bold">
                Protocolo de Segurança Hospitalar & Sigilo LGPD
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs space-y-1.5">
                <div className="font-bold text-sky-300">{selectedProc.name}</div>
                <div>Local: {selectedProc.hospital}</div>
                <div>Anestesia: {selectedProc.anesthesia}</div>
                <div className="text-emerald-400">✓ Equipe de Fisioterapia Intraoperatória Inclusa</div>
              </div>
            </div>

            {booked ? (
              <div className="p-3 rounded-xl bg-sky-950 text-white text-center space-y-2">
                <div className="text-xs font-bold">✓ Triagem recebida pela Enfermeira Navegadora!</div>
                <button
                  type="button"
                  onClick={() => switchMode('system')}
                  className="w-full py-2 rounded-lg bg-sky-400 text-slate-950 font-black text-xs cursor-pointer"
                >
                  Ver Reserva de Centro Cirúrgico →
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sound.playSuccess();
                  setBooked(true);
                }}
                className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs shadow-lg cursor-pointer"
              >
                Solicitar Consulta Presencial Confidencial
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="p-4 sm:p-6 bg-[#0F172A] text-white space-y-3 font-mono text-xs">
          <div className="text-sky-400 font-bold">
            MAPA DE CENTRO CIRÚRGICO, RISCO CARDIOLÓGICO & ACOMPANHAMENTO PÓS-OP
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-sky-300 font-bold">Sábado 07:30 · Vila Nova Star</div>
              <div>Procedimento: {selectedProc.name}</div>
              <div className="text-emerald-400">Exames Pré-Op & Cardiologista: APROVADOS</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-sky-300 font-bold">Materiais & Próteses Mentor/Motiva</div>
              <div>Reserva de Par Estéril Confirmada</div>
              <div className="text-slate-400">Instrumentadora Chefe: Enf. Cláudia</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-sky-300 font-bold">Régua Pós-Operatória WhatsApp</div>
              <div className="text-emerald-400">14 Pacientes recebendo check-in diário de recuperação</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   4. IRON BOX CROSSFIT & PERFORMANCE (HIGH-OCTANE VOLT ORANGE)
   ========================================================= */
export function IronBoxDemo({
  initialViewMode = 'site',
  onViewModeChange,
}: {
  initialViewMode?: 'site' | 'system';
  onViewModeChange?: (mode: 'site' | 'system') => void;
}) {
  const [activeTab, setActiveTab] = useState<'site' | 'system'>(initialViewMode);
  const [wodCategory, setWodCategory] = useState<'rx' | 'scaled' | 'iniciante'>('rx');
  const [selectedClassTime, setSelectedClassTime] = useState('18:30 · Coach Rodrigo (19/20 vagas)');
  const [athleteName, setAthleteName] = useState('Lucas Viana');
  const [bookedPass, setBookedPass] = useState(false);

  useEffect(() => {
    setActiveTab(initialViewMode);
  }, [initialViewMode]);

  const switchMode = (mode: 'site' | 'system') => {
    sound.playSelect();
    setActiveTab(mode);
    onViewModeChange?.(mode);
  };

  return (
    <div className="w-full flex flex-col bg-[#0C0C0E] text-zinc-100 rounded-2xl overflow-hidden border border-orange-500/40 shadow-2xl">
      <div className="px-4 sm:px-6 py-3.5 bg-[#141418] border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500 text-black flex items-center justify-center font-black">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-black tracking-wider uppercase text-white font-heading">
              IRON BOX · CROSSFIT & HIGH PERFORMANCE ARENA
            </div>
            <div className="text-[11px] text-orange-400">
              WOD Diário na TV · Check-in por App · Coaches Nível L2 CrossFit
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl text-xs font-mono">
          <button
            type="button"
            onClick={() => switchMode('site')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer ${
              activeTab === 'site' ? 'bg-orange-500 text-black font-extrabold' : 'text-zinc-400'
            }`}
          >
            WOD & Vagas Ao Vivo
          </button>
          <button
            type="button"
            onClick={() => switchMode('system')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer ${
              activeTab === 'system' ? 'bg-yellow-400 text-black font-extrabold' : 'text-zinc-400'
            }`}
          >
            TV Leaderboard & Catraca
          </button>
        </div>
      </div>

      {activeTab === 'site' && (
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-2xl bg-[#141418] border border-zinc-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-orange-400 font-bold">
                WOD DO DIA (WORKOUT OF THE DAY) · TIME CAP 16 MIN
              </span>
              <div className="flex gap-1 bg-black p-1 rounded-lg text-[11px] font-mono">
                {(['rx', 'scaled', 'iniciante'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setWodCategory(lvl)}
                    className={`px-2.5 py-1 rounded uppercase font-bold cursor-pointer ${
                      wodCategory === lvl ? 'bg-orange-500 text-black' : 'text-zinc-400'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/60 border border-orange-500/30 font-mono text-xs space-y-1.5">
              <div className="text-orange-400 font-black text-sm">
                3 ROUNDS FOR TIME ({wodCategory.toUpperCase()}):
              </div>
              <div>• 400m Run na Arena Externa</div>
              <div>
                • 21 Thrusters ({wodCategory === 'rx' ? '43kg / 30kg' : wodCategory === 'scaled' ? '30kg / 20kg' : 'Barra Guiada 15kg'})
              </div>
              <div>
                • 12 {wodCategory === 'rx' ? 'Bar Muscle-Ups' : wodCategory === 'scaled' ? 'Pull-Ups na Barra' : 'Ring Rows Adaptados'}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 block">Escolha a Turma de Hoje (Lotação em Tempo Real):</label>
              {[
                '06:00 · Coach Felipe (18/20 vagas)',
                '12:00 · Coach Amanda (14/20 vagas)',
                '18:30 · Coach Rodrigo (19/20 vagas · ÚLTIMA VAGA)',
                '19:30 · Coach Rodrigo (15/20 vagas)',
              ].map((cl) => (
                <button
                  key={cl}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedClassTime(cl);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-mono cursor-pointer ${
                    selectedClassTime === cl
                      ? 'border-orange-500 bg-orange-500/20 text-white font-bold'
                      : 'border-zinc-800 bg-black/40 text-zinc-400'
                  }`}
                >
                  {cl}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-[#141418] border border-orange-500/30 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase text-orange-400 font-bold">
                Emitir Free Pass Experimental (QR Code Catraca)
              </div>
              <input
                type="text"
                value={athleteName}
                onChange={(e) => setAthleteName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-xs text-white"
                placeholder="Nome do Atleta"
              />
              <div className="p-3 rounded-xl bg-black/50 border border-zinc-800 text-xs space-y-1">
                <div className="text-orange-400 font-bold">{selectedClassTime}</div>
                <div className="text-zinc-400">Nível selecionado: {wodCategory.toUpperCase()}</div>
              </div>
            </div>

            {bookedPass ? (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-2">
                <div className="text-xs font-bold text-emerald-300">✓ Check-in confirmado na lista do Coach!</div>
                <button
                  type="button"
                  onClick={() => switchMode('system')}
                  className="w-full py-2 rounded-lg bg-orange-500 text-black font-black text-xs cursor-pointer"
                >
                  Ver Meu Nome no TV Leaderboard da Arena →
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sound.playSuccess();
                  confetti({ particleCount: 55, spread: 60, origin: { y: 0.6 } });
                  setBookedPass(true);
                }}
                className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-black text-xs shadow-lg cursor-pointer"
              >
                Garantir Minha Vaga no Treino Hoje (Grátis)
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="p-4 sm:p-6 bg-black text-white space-y-4 font-mono text-xs">
          <div className="text-orange-400 font-bold">
            PLACAR TV DA ARENA (LEADERBOARD DO WOD) & CONTROLE DE CATRACA BIOMÉTRICA
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="text-yellow-400 font-bold">#1 RX · Pedro Andrade — 11m42s</div>
              <div className="text-zinc-300 mt-1">#2 RX · Matheus Costa — 12m18s</div>
              <div className="text-orange-400 mt-1">Novo Check-in: {athleteName} ({selectedClassTime.split(' ')[0]})</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="text-emerald-400 font-bold">Recorrência Ativa (Planos Semestrais)</div>
              <div className="text-xl font-black text-white mt-1">318 Alunos Ativos</div>
              <div className="text-zinc-400">Inadimplência: 1.2% (Cobrança PIX/Cartão Automática)</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="text-orange-400 font-bold">Conversão de Aulas Experimentais</div>
              <div className="text-xl font-black text-white mt-1">74% Matriculam</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

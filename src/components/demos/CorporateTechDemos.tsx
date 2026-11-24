import { useState, useEffect } from 'react';
import {
  Scale,
  ShieldCheck,
  FileText,
  Building,
  Check,
  ArrowRight,
  ShoppingBag,
  Cpu,
  Flame,
  Truck,
  Sparkles,
  QrCode,
  Layers,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import {
  calculateTaxRecoveryEstimate,
  calculateArchitectureProjectFee,
  calculateSaasRoiSavings,
} from '../../utils/projectCalculators';

/* ============================================================================
   1. LEX ADVOCACIA CORPORATIVA (Sovereign Oxford Navy & Brass Legal Portal + LexDesk)
============================================================================ */
export function LexAdvocaciaDemo({
  initialViewMode = 'site',
  onViewModeChange,
}: {
  initialViewMode?: 'site' | 'system';
  onViewModeChange?: (mode: 'site' | 'system') => void;
}) {
  const [activeTab, setActiveTab] = useState<'site' | 'system'>(initialViewMode);
  const [sysTab, setSysTab] = useState<'dossies' | 'prazos' | 'honorarios'>('dossies');

  useEffect(() => {
    setActiveTab(initialViewMode);
  }, [initialViewMode]);

  const switchMode = (mode: 'site' | 'system') => {
    sound.playSelect();
    setActiveTab(mode);
    onViewModeChange?.(mode);
  };

  const [monthlyRev, setMonthlyRev] = useState(450000);
  const [taxRegime, setTaxRegime] = useState<'lucro_real' | 'lucro_presumido' | 'simples_nacional'>('lucro_real');
  const [companyName, setCompanyName] = useState('Grupo Vanguarda Indústria Ltda');
  const [practiceArea, setPracticeArea] = useState('Recuperação Tributária (PIS/COFINS)');
  const [dossierSubmitted, setDossierSubmitted] = useState(false);

  const taxStats = calculateTaxRecoveryEstimate(monthlyRev, taxRegime, 5);

  const [legalCases, setLegalCases] = useState([
    {
      id: 'lex-1',
      protocol: 'OAB-SIG-9042',
      company: 'Metalúrgica Atlas S.A.',
      area: 'Tributário · Exclusão ICMS da Base PIS/COFINS',
      estimatedValue: 1180000,
      status: 'Auditoria Fiscal',
    },
    {
      id: 'lex-2',
      protocol: 'OAB-SIG-9039',
      company: 'Holding Familiar Albuquerque',
      area: 'Societário · Blindagem Patrimonial & Sucessão',
      estimatedValue: 8500000,
      status: 'Minuta Contratual',
    },
  ]);

  const handleSubmitLegalDossier = () => {
    sound.playSuccess();
    confetti({ particleCount: 45, spread: 55, origin: { y: 0.6 } });
    setLegalCases([
      {
        id: 'lex-' + Date.now(),
        protocol: `OAB-SIG-${9043 + legalCases.length}`,
        company: companyName || 'Empresa Confidencial',
        area: `${practiceArea} (${taxRegime.replace('_', ' ').toUpperCase()})`,
        estimatedValue: taxStats.estimatedRecovery,
        status: 'Triagem Sócio Sênior',
      },
      ...legalCases,
    ]);
    setDossierSubmitted(true);
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-[#2A364F] bg-[#0A0F1D] text-slate-100 font-sans shadow-2xl">
      {/* Top Bar */}
      <div className="px-4 py-3 bg-[#060A12] border-b border-[#1E293B] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-mono uppercase tracking-wider font-bold text-amber-200">
            Lex Advocacia Corporativa · Banca Tributária & Societária
          </span>
        </div>
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => switchMode('site')}
            className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
              activeTab === 'site' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Portal Jurídico Corporativo
          </button>
          <button
            type="button"
            onClick={() => switchMode('system')}
            className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
              activeTab === 'system' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            LexDesk ERP ({legalCases.length})
          </button>
        </div>
      </div>

      {activeTab === 'site' ? (
        <div className="p-5 sm:p-6 space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] border border-amber-400/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-300">
                Sigilo Absoluto OAB & Conformidade LGPD
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
                Protegendo o Patrimônio e Recuperando Créditos Fiscais da Sua Empresa.
              </h2>
              <p className="text-xs text-slate-300">
                Simule o potencial de restituição tributária dos últimos 60 meses e agende reunião confidencial com nossos sócios tributaristas.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#090D16] border border-amber-400/30 text-right font-mono shrink-0">
              <div className="text-[10px] text-slate-400">CRÉDITO ESTIMADO (60 MESES)</div>
              <div className="text-2xl font-black text-amber-300 tabular-nums">
                R$ {taxStats.estimatedRecovery.toLocaleString('pt-BR')}
              </div>
              <div className="text-[10px] text-emerald-400">
                Líquido p/ Empresa: R$ {taxStats.netClientBenefit.toLocaleString('pt-BR')}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 p-5 rounded-2xl bg-[#0E1525] border border-slate-800 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-amber-300">
                1. Calculadora de Recuperação Tributária (Últimos 5 Anos)
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Faturamento Mensal Médio da Empresa:</span>
                  <span className="font-mono font-bold text-amber-300 tabular-nums">
                    R$ {monthlyRev.toLocaleString('pt-BR')}/mês
                  </span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={3000000}
                  step={50000}
                  value={monthlyRev}
                  onChange={(e) => setMonthlyRev(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">2. Regime Tributário Vigente:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'lucro_real', label: 'Lucro Real' },
                    { id: 'lucro_presumido', label: 'Lucro Presumido' },
                    { id: 'simples_nacional', label: 'Simples (Monofásico)' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setTaxRegime(r.id as 'lucro_real' | 'lucro_presumido' | 'simples_nacional');
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer ${
                        taxRegime === r.id
                          ? 'border-amber-400 bg-amber-400/15 text-amber-200'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">3. Frente Jurídica Prioritária:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Recuperação Tributária (PIS/COFINS)',
                    'Holding Familiar & Sucessão Patrimonial',
                    'Defesa de Passivo Trabalhista / Executivo',
                    'Fusões, Aquisições (M&A) & Contratos B2B',
                  ].map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setPracticeArea(area);
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs cursor-pointer ${
                        practiceArea === area
                          ? 'border-amber-400 bg-amber-400/15 text-white font-bold'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400'
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-5 rounded-2xl bg-[#111A2E] border border-amber-400/30 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase text-amber-300 font-bold">
                  Abertura de Dossiê Sob NDA (Acordo de Confidencialidade)
                </div>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Razão Social ou Nome do Grupo"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Potencial Auditado:</span>
                    <span className="text-amber-300 font-bold tabular-nums">
                      R$ {taxStats.estimatedRecovery.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Honorários Ad Exitum (20%):</span>
                    <span className="text-slate-300 tabular-nums">
                      R$ {taxStats.successFee.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1.5 font-bold">
                    <span className="text-emerald-400">Benefício Líquido Cliente:</span>
                    <span className="text-emerald-400 tabular-nums">
                      R$ {taxStats.netClientBenefit.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmitLegalDossier}
                className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer transition-all"
              >
                Protocolar Diagnóstico Jurídico Sigiloso
              </button>

              {dossierSubmitted && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between">
                  <span>Dossiê protocolado no LexDesk ERP!</span>
                  <button
                    type="button"
                    onClick={() => switchMode('system')}
                    className="underline font-bold text-amber-300 cursor-pointer"
                  >
                    Abrir LexDesk
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5 sm:p-6 space-y-5 bg-[#070B14]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <h3 className="text-base font-black text-white">LexDesk Corporate ERP · Controladoria Jurídica</h3>
            <div className="flex gap-1.5">
              {[
                { id: 'dossies', label: `1. Dossiês & Contratos (${legalCases.length})` },
                { id: 'prazos', label: '2. Radar STJ / Receita Federal' },
                { id: 'honorarios', label: '3. Honorários & Êxito Fiscal' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSysTab(t.id as 'dossies' | 'prazos' | 'honorarios')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    sysTab === t.id ? 'bg-amber-400 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {sysTab === 'dossies' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {legalCases.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-amber-300 font-bold">{c.protocol}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">{c.status}</span>
                  </div>
                  <div className="text-sm font-black text-white">{c.company}</div>
                  <div className="text-xs text-slate-400">{c.area}</div>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-300 font-bold tabular-nums">
                      Valor da Causa: R$ {c.estimatedValue.toLocaleString('pt-BR')}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playSuccess();
                        setLegalCases((prev) =>
                          prev.map((item) =>
                            item.id === c.id ? { ...item, status: 'Parecer Aprovado Sócio' } : item
                          )
                        );
                      }}
                      className="px-2.5 py-1 rounded bg-amber-400 text-slate-950 font-bold cursor-pointer"
                    >
                      Aprovar Parecer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {sysTab === 'prazos' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {[
                { court: 'TRF-3ª Região (São Paulo)', deadline: 'Amanhã 18:00', subject: 'Mandado de Segurança PIS/COFINS', lawyer: 'Dr. Henrique Valença' },
                { court: 'Receita Federal (PER/DCOMP)', deadline: 'Em 3 dias', subject: 'Homologação de Crédito R$ 1.18M', lawyer: 'Dra. Beatriz Monteiro' },
                { court: 'Junta Comercial / Registro Holding', deadline: 'Em 5 dias', subject: 'Integralização de Quotas Patrimoniais', lawyer: 'Dr. Eduardo Prado' },
              ].map((p, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="font-mono text-amber-300 font-bold">{p.court}</div>
                  <div className="text-sm font-bold text-white">{p.subject}</div>
                  <div className="text-slate-400">Responsável: {p.lawyer}</div>
                  <div className="text-emerald-400 font-mono">Prazo Fatal: {p.deadline}</div>
                </div>
              ))}
            </div>
          )}

          {sysTab === 'honorarios' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Volume Sob Auditoria Tributária</div>
                <div className="text-xl font-black text-amber-300 mt-1 tabular-nums">R$ 14.820.000</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Honorários de Êxito Projetados (20%)</div>
                <div className="text-xl font-black text-emerald-400 mt-1 tabular-nums">R$ 2.964.000</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Contratos de Partido Mensal (Retainer)</div>
                <div className="text-xl font-black text-white mt-1 tabular-nums">42 Empresas B2B</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   2. VILLA STUDIO ARQUITETURA & DESIGN (Warm Travertine Editorial Light Mode + BIM)
============================================================================ */
export function VillaArquiteturaDemo({
  initialViewMode = 'site',
  onViewModeChange,
}: {
  initialViewMode?: 'site' | 'system';
  onViewModeChange?: (mode: 'site' | 'system') => void;
}) {
  const [activeTab, setActiveTab] = useState<'site' | 'system'>(initialViewMode);
  const [sysTab, setSysTab] = useState<'briefings' | 'obras'>('briefings');

  useEffect(() => {
    setActiveTab(initialViewMode);
  }, [initialViewMode]);

  const switchMode = (mode: 'site' | 'system') => {
    sound.playSelect();
    setActiveTab(mode);
    onViewModeChange?.(mode);
  };

  const [areaM2, setAreaM2] = useState(480);
  const [standard, setStandard] = useState<'essencial' | 'alto_padrao' | 'assinatura_turnkey'>('alto_padrao');
  const [includeLandscaping, setIncludeLandscaping] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState('Travertino Romano Bruto + Madeira Freijó Natural');
  const [clientName, setClientName] = useState('Família Montenegro');
  const [condoLocation, setCondoLocation] = useState('Fazenda Boa Vista · Lote 42');
  const [briefingSent, setBriefingSent] = useState(false);

  const archStats = calculateArchitectureProjectFee(areaM2, standard, includeLandscaping);

  const [briefingsList, setBriefingsList] = useState([
    {
      id: 'ar-1',
      client: 'Residência Terras de São José',
      area: 850,
      palette: 'Concreto Aparente Ripado + Brise Cumaru',
      projectFee: 267750,
      stage: 'Estudo Preliminar 3D Aprovado',
    },
    {
      id: 'ar-2',
      client: 'Penthouse Duplex Vila Nova Conceição',
      area: 420,
      palette: 'Mármore Taj Mahal + Carvalho Americano',
      projectFee: 163800,
      stage: 'Detalhamento Executivo BIM',
    },
  ]);

  const handleSendBriefing = () => {
    sound.playSuccess();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setBriefingsList([
      {
        id: 'ar-' + Date.now(),
        client: `${clientName} (${condoLocation})`,
        area: areaM2,
        palette: selectedMaterial,
        projectFee: archStats.projectFee,
        stage: 'Novo Briefing Recebido',
      },
      ...briefingsList,
    ]);
    setBriefingSent(true);
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-[#DCD3C4] bg-[#F6F3EC] text-[#1E1B18] font-sans shadow-2xl">
      <div className="px-4 py-3 bg-[#EAE3D5] border-b border-[#D5CBB8] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-[#7C5A38]" />
          <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#4A3B2C]">
            Villa Studio · Arquitetura Autoral & Interiores Minimalistas
          </span>
        </div>
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#D5CBB8]">
          <button
            type="button"
            onClick={() => switchMode('site')}
            className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
              activeTab === 'site' ? 'bg-[#1E1B18] text-[#F6F3EC]' : 'text-[#6E6459]'
            }`}
          >
            Portfólio & Configurador
          </button>
          <button
            type="button"
            onClick={() => switchMode('system')}
            className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
              activeTab === 'system' ? 'bg-[#1E1B18] text-[#F6F3EC]' : 'text-[#6E6459]'
            }`}
          >
            VillaBIM Gestão de Obras ({briefingsList.length})
          </button>
        </div>
      </div>

      {activeTab === 'site' ? (
        <div className="p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 p-5 rounded-2xl bg-white border border-[#E2D9C8] space-y-4 shadow-sm">
              <div className="border-b border-[#EDE6D8] pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#8C6A46]">
                    Configurador de Estudo Preliminar
                  </span>
                  <h3 className="text-xl font-black font-heading text-[#1E1B18]">
                    Dimensione Seu Projeto Residencial ou Reforma
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#7C5A38] font-bold">CAU/SP Ativo</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#4A3B2C]">1. Metragem Construída Estimada:</span>
                  <span className="font-mono font-black text-[#7C5A38] tabular-nums">{areaM2} m²</span>
                </div>
                <input
                  type="range"
                  min={180}
                  max={1200}
                  step={20}
                  value={areaM2}
                  onChange={(e) => setAreaM2(Number(e.target.value))}
                  className="w-full accent-[#7C5A38] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4A3B2C] block">2. Escopo do Escritório:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'essencial', label: 'Arquitetônico + BIM' },
                    { id: 'alto_padrao', label: 'Completo + Interiores' },
                    { id: 'assinatura_turnkey', label: 'Turnkey (Chave na Mão)' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setStandard(s.id as 'essencial' | 'alto_padrao' | 'assinatura_turnkey');
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer ${
                        standard === s.id
                          ? 'border-[#1E1B18] bg-[#1E1B18] text-white'
                          : 'border-[#E2D9C8] bg-[#F9F6F0] text-[#5C5349]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4A3B2C] block">
                  3. Moodboard de Materiais Naturais:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Travertino Romano Bruto + Madeira Freijó Natural',
                    'Concreto Aparente Ripado + Brise Metálico Corten',
                    'Mármore Taj Mahal Escovado + Linho Belga',
                    'Pedra Moledo Orgânica + Vidro Duplo Minimalista',
                  ].map((mat) => (
                    <button
                      key={mat}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSelectedMaterial(mat);
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs cursor-pointer ${
                        selectedMaterial === mat
                          ? 'border-[#7C5A38] bg-[#F3ECE1] text-[#1E1B18] font-bold'
                          : 'border-[#E2D9C8] bg-[#FBF9F5] text-[#6E6459]'
                      }`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 p-5 rounded-2xl bg-[#1E1B18] text-[#F6F3EC] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#C8A97E]">
                  Estimativa Técnica de Projeto & Obra
                </span>
                <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[10px] text-stone-400">Honorários Projeto BIM</div>
                    <div className="text-base font-black text-[#E5C9A1] tabular-nums mt-0.5">
                      R$ {archStats.projectFee.toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[10px] text-stone-400">Prazo Estimado Obra</div>
                    <div className="text-base font-black text-white tabular-nums mt-0.5">
                      ~{archStats.monthsDuration} Meses
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <div className="text-[10px] font-mono text-stone-400">PALETA SELECIONADA NO BRIEFING</div>
                  <div className="font-bold text-[#E5C9A1] mt-0.5">{selectedMaterial}</div>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nome / Família"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={condoLocation}
                    onChange={(e) => setCondoLocation(e.target.value)}
                    placeholder="Condomínio / Bairro"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendBriefing}
                className="w-full py-3 rounded-xl bg-[#C8A97E] hover:bg-[#D6B98E] text-[#1E1B18] font-black text-xs cursor-pointer transition-all"
              >
                Enviar Briefing Para os Arquitetos Titulares
              </button>

              {briefingSent && (
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between">
                  <span>Briefing registrado no VillaBIM!</span>
                  <button
                    type="button"
                    onClick={() => switchMode('system')}
                    className="underline font-bold text-[#E5C9A1] cursor-pointer"
                  >
                    Ver Cronograma BIM
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5 sm:p-6 bg-[#181512] text-stone-100 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
            <h3 className="text-base font-black text-white">VillaBIM · Cronograma Executivo & Diário de Obra</h3>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setSysTab('briefings')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  sysTab === 'briefings' ? 'bg-[#C8A97E] text-black' : 'bg-stone-900 text-stone-400'
                }`}
              >
                1. Projetos & Briefings ({briefingsList.length})
              </button>
              <button
                type="button"
                onClick={() => setSysTab('obras')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  sysTab === 'obras' ? 'bg-[#C8A97E] text-black' : 'bg-stone-900 text-stone-400'
                }`}
              >
                2. Acompanhamento Físico-Financeiro
              </button>
            </div>
          </div>

          {sysTab === 'briefings' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {briefingsList.map((b) => (
                <div key={b.id} className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#C8A97E] font-bold">{b.area} m² Construídos</span>
                    <span className="text-emerald-400">{b.stage}</span>
                  </div>
                  <div className="text-sm font-black text-white">{b.client}</div>
                  <div className="text-xs text-stone-400">Acabamentos: {b.palette}</div>
                  <div className="pt-2 border-t border-stone-800 text-xs font-mono text-[#E5C9A1]">
                    Honorários Projeto: R$ {b.projectFee.toLocaleString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {[
                { phase: 'Fundação & Estrutura em Balanço', pct: '100% Concluído', rrt: 'RRT #99218-SP OK' },
                { phase: 'Caixilharia Minimalista & Brises', pct: '78% Em Execução', rrt: 'Medição Laser Validada' },
                { phase: 'Marcenaria Freijó & Automação Savant', pct: '35% Em Fabricação', rrt: 'Entrega em 18 dias' },
              ].map((o, i) => (
                <div key={i} className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-1.5">
                  <div className="text-[#C8A97E] font-mono font-bold">{o.rrt}</div>
                  <div className="text-sm font-bold text-white">{o.phase}</div>
                  <div className="text-emerald-400 font-mono">{o.pct}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   3. HYPE STREETWEAR & SNEAKER DROP (Brutalist Acid Lime Drop Store + Fulfillment OMS)
============================================================================ */
export function HypeStreetwearDemo({
  initialViewMode = 'site',
  onViewModeChange,
}: {
  initialViewMode?: 'site' | 'system';
  onViewModeChange?: (mode: 'site' | 'system') => void;
}) {
  const [activeTab, setActiveTab] = useState<'site' | 'system'>(initialViewMode);

  useEffect(() => {
    setActiveTab(initialViewMode);
  }, [initialViewMode]);

  const switchMode = (mode: 'site' | 'system') => {
    sound.playSelect();
    setActiveTab(mode);
    onViewModeChange?.(mode);
  };

  const [heightCm, setHeightCm] = useState(178);
  const [weightKg, setWeightKg] = useState(76);
  const recommendedSize =
    heightCm > 183 || weightKg > 86 ? 'XL (Boxy Fit)' : heightCm > 174 || weightKg > 72 ? 'L (Oversized)' : 'M (Drop Shoulder)';

  const [selectedPiece, setSelectedPiece] = useState({
    name: 'Heavyweight Hoodie Cyber 01 (440 GSM)',
    price: 289,
    stock: 9,
  });
  const [selectedSize, setSelectedSize] = useState('L');
  const [buyerName, setBuyerName] = useState('Lucas Hype');
  const [dropOrderPlaced, setDropOrderPlaced] = useState(false);

  const [dropOrders, setDropOrders] = useState([
    {
      id: 'dr-1',
      code: '#DROP-882',
      buyer: 'Guilherme Santos (SP)',
      item: 'Heavyweight Hoodie Cyber 01 · Tam L',
      total: 289,
      shipping: 'Correios SEDEX (Etiqueta Pronta)',
    },
    {
      id: 'dr-2',
      code: '#DROP-881',
      buyer: 'Enzo Takahashi (PR)',
      item: 'Calça Cargo Tática Ripstop · Tam M',
      total: 259,
      shipping: 'Despachado · Rastreio Enviado',
    },
  ]);

  const handleInstantPixDrop = () => {
    sound.playSuccess();
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    setDropOrders([
      {
        id: 'dr-' + Date.now(),
        code: `#DROP-${883 + dropOrders.length}`,
        buyer: buyerName || 'Colecionador Drop #04',
        item: `${selectedPiece.name} · Tam ${selectedSize}`,
        total: selectedPiece.price,
        shipping: 'PIX Aprovado · Aguardando Etiqueta',
      },
      ...dropOrders,
    ]);
    setDropOrderPlaced(true);
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-zinc-800 bg-[#09090B] text-zinc-100 font-sans shadow-2xl">
      <div className="px-4 py-3 bg-black border-b border-zinc-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-[#D4FF00]" />
          <span className="text-xs font-mono uppercase tracking-wider font-black text-[#D4FF00]">
            HYPE DROP #04 · LIMITED EDITION 100% ALGODÃO EGÍPCIO 440G
          </span>
        </div>
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          <button
            type="button"
            onClick={() => switchMode('site')}
            className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
              activeTab === 'site' ? 'bg-[#D4FF00] text-black' : 'text-zinc-400'
            }`}
          >
            Loja Drop #04
          </button>
          <button
            type="button"
            onClick={() => switchMode('system')}
            className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
              activeTab === 'system' ? 'bg-[#D4FF00] text-black' : 'text-zinc-400'
            }`}
          >
            Fulfillment & Etiquetas ({dropOrders.length})
          </button>
        </div>
      </div>

      {activeTab === 'site' ? (
        <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xl font-black font-heading text-white uppercase tracking-tight">
              Selecione Sua Peça Numerada + Provador Virtual Oversized
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { name: 'Heavyweight Hoodie Cyber 01 (440 GSM)', price: 289, stock: 9 },
                { name: 'Tee Oversized Matrix Acid Wash', price: 149, stock: 14 },
                { name: 'Calça Cargo Tática Ripstop Fivela', price: 259, stock: 6 },
              ].map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedPiece(p);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedPiece.name === p.name
                      ? 'border-[#D4FF00] bg-[#D4FF00]/10 text-white'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                  }`}
                >
                  <div className="text-[10px] font-mono text-[#D4FF00]">RESTAM {p.stock} UN</div>
                  <div className="text-xs font-black mt-1">{p.name}</div>
                  <div className="text-sm font-mono font-bold text-white mt-2">R$ {p.price},00</div>
                </button>
              ))}
            </div>

            {/* Virtual Size Finder */}
            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono uppercase text-zinc-400">Provador de Caimento Boxy/Oversized:</span>
                <span className="font-mono font-black text-[#D4FF00]">Recomendado: {recommendedSize}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-zinc-400">Sua Altura:</span>
                    <span className="font-mono font-bold text-white">{heightCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min={155}
                    max={198}
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full accent-[#D4FF00] cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-zinc-400">Seu Peso:</span>
                    <span className="font-mono font-bold text-white">{weightKg} kg</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={115}
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full accent-[#D4FF00] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-5 rounded-2xl bg-zinc-950 border border-[#D4FF00]/40 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="text-xs font-mono text-[#D4FF00] uppercase font-bold">
                Checkout 1-Clique PIX · Sem Carrinho Abandonado
              </div>
              <div className="flex gap-2">
                {['S', 'M', 'L', 'XL'].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedSize(sz);
                    }}
                    className={`flex-1 py-2 rounded-lg font-mono text-xs font-black border cursor-pointer ${
                      selectedSize === sz
                        ? 'border-[#D4FF00] bg-[#D4FF00] text-black'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Nome para Etiqueta SEDEX"
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
              />
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-zinc-400">TOTAL PIX COM FRETE EXPRESS</div>
                  <div className="text-xl font-black text-[#D4FF00] font-mono">R$ {selectedPiece.price},00</div>
                </div>
                <QrCode className="w-8 h-8 text-[#D4FF00]" />
              </div>
            </div>

            <button
              type="button"
              onClick={handleInstantPixDrop}
              className="w-full py-3.5 rounded-xl bg-[#D4FF00] hover:bg-lime-300 text-black font-black text-xs uppercase tracking-wider cursor-pointer"
            >
              Garantir Peça do Drop & Gerar Etiqueta
            </button>

            {dropOrderPlaced && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between">
                <span>Peça reservada e enviada p/ expedição!</span>
                <button
                  type="button"
                  onClick={() => switchMode('system')}
                  className="underline font-bold text-[#D4FF00] cursor-pointer"
                >
                  Ver Etiqueta SEDEX
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-5 sm:p-6 space-y-4">
          <h3 className="text-base font-black text-white">HypeFulfillment OMS · Emissão de Etiquetas Melhor Envio</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dropOrders.map((o) => (
              <div key={o.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#D4FF00] font-bold">{o.code}</span>
                  <span className="text-emerald-400">{o.shipping}</span>
                </div>
                <div className="text-sm font-black text-white">{o.item}</div>
                <div className="text-xs text-zinc-400">Destinatário: {o.buyer}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   4. NEXUS AI & CLOUD SOLUTIONS (B2B SaaS ROI Calculator + Cloud Tenant Console)
============================================================================ */
export function NexusSaasDemo({
  initialViewMode = 'site',
  onViewModeChange,
}: {
  initialViewMode?: 'site' | 'system';
  onViewModeChange?: (mode: 'site' | 'system') => void;
}) {
  const [activeTab, setActiveTab] = useState<'site' | 'system'>(initialViewMode);

  useEffect(() => {
    setActiveTab(initialViewMode);
  }, [initialViewMode]);

  const switchMode = (mode: 'site' | 'system') => {
    sound.playSelect();
    setActiveTab(mode);
    onViewModeChange?.(mode);
  };

  const [teamSize, setTeamSize] = useState(18);
  const [hoursSaved, setHoursSaved] = useState(6);
  const [companyDomain, setCompanyDomain] = useState('acmecorp.com.br');
  const [trialCreated, setTrialCreated] = useState(false);

  const roi = calculateSaasRoiSavings(teamSize, hoursSaved, 75, 980);

  const [tenants, setTenants] = useState([
    { id: 'tn-1', domain: 'logistica-bras.com.br', seats: 45, plan: 'Enterprise Dedicated', mrr: 2890, status: 'Cluster Ativo (sa-east-1)' },
    { id: 'tn-2', domain: 'fintech-nova.io', seats: 20, plan: 'Business Pro', mrr: 980, status: 'Trial Dia 9/14 (Alta Adoção)' },
  ]);

  const handleProvisionWorkspace = () => {
    sound.playSuccess();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setTenants([
      {
        id: 'tn-' + Date.now(),
        domain: companyDomain || 'empresa.com.br',
        seats: teamSize,
        plan: 'Business Pro (Trial 14d)',
        mrr: 980,
        status: 'Provisionado Agora (sa-east-1)',
      },
      ...tenants,
    ]);
    setTrialCreated(true);
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-sky-500/30 bg-[#060B16] text-slate-100 font-sans shadow-2xl">
      <div className="px-4 py-3 bg-[#04070F] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-mono uppercase tracking-wider font-bold text-sky-300">
            Nexus Cloud B2B · Plataforma de Automação Operacional & BI
          </span>
        </div>
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => switchMode('site')}
            className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
              activeTab === 'site' ? 'bg-sky-400 text-slate-950' : 'text-slate-400'
            }`}
          >
            Site & Calculadora ROI
          </button>
          <button
            type="button"
            onClick={() => switchMode('system')}
            className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
              activeTab === 'system' ? 'bg-sky-400 text-slate-950' : 'text-slate-400'
            }`}
          >
            Tenant Admin & MRR ({tenants.length})
          </button>
        </div>
      </div>

      {activeTab === 'site' ? (
        <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xl font-black font-heading text-white">
              Simulador de Economia de Horas & ROI para Equipes Corporativas
            </h3>
            <div className="space-y-3 p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Tamanho da Equipe Operacional:</span>
                  <span className="font-mono font-bold text-sky-400 tabular-nums">{teamSize} colaboradores</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={100}
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Horas Poupadas por Semana / Pessoa:</span>
                  <span className="font-mono font-bold text-sky-400 tabular-nums">{hoursSaved}h / semana</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={15}
                  value={hoursSaved}
                  onChange={(e) => setHoursSaved(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Economia Produtiva / Mês</div>
                <div className="text-lg font-black text-emerald-400 tabular-nums mt-1">
                  R$ {roi.monthlyProductivityGain.toLocaleString('pt-BR')}/mês
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400">Retorno Sobre Assinatura</div>
                <div className="text-lg font-black text-sky-300 tabular-nums mt-1">
                  {roi.roiMultiple}x ROI Direto
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-sky-500/30 space-y-4">
            <div className="text-xs font-mono uppercase text-sky-300 font-bold">
              Provisionar Ambiente Trial de 14 Dias (Sem Cartão)
            </div>
            <input
              type="text"
              value={companyDomain}
              onChange={(e) => setCompanyDomain(e.target.value)}
              placeholder="dominio-da-empresa.com.br"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
            />
            <button
              type="button"
              onClick={handleProvisionWorkspace}
              className="w-full py-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-black text-xs cursor-pointer"
            >
              Criar Workspace Dedicado em 5 Segundos
            </button>
            {trialCreated && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between">
                <span>Tenant criado no Cluster sa-east-1!</span>
                <button
                  type="button"
                  onClick={() => switchMode('system')}
                  className="underline font-bold text-sky-300 cursor-pointer"
                >
                  Ver Painel SaaS
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-5 sm:p-6 space-y-4">
          <h3 className="text-base font-black text-white">Nexus Cloud Admin · Gestão de Tenants & MRR Recorrente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tenants.map((t) => (
              <div key={t.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-sky-300 font-bold">{t.domain}</span>
                  <span className="text-emerald-400">{t.status}</span>
                </div>
                <div className="text-sm font-black text-white">{t.plan} · {t.seats} Licenças</div>
                <div className="text-xs font-mono text-slate-400">MRR: R$ {t.mrr}/mês</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   5. NITRO PRO SUPLEMENTOS & NUTRIÇÃO (Express 2h Supplement Store + Batch ERP)
============================================================================ */
export function NitroSuplementosDemo({
  initialViewMode = 'site',
  onViewModeChange,
}: {
  initialViewMode?: 'site' | 'system';
  onViewModeChange?: (mode: 'site' | 'system') => void;
}) {
  const [activeTab, setActiveTab] = useState<'site' | 'system'>(initialViewMode);

  useEffect(() => {
    setActiveTab(initialViewMode);
  }, [initialViewMode]);

  const switchMode = (mode: 'site' | 'system') => {
    sound.playSelect();
    setActiveTab(mode);
    onViewModeChange?.(mode);
  };

  const [selectedGoal, setSelectedGoal] = useState({
    goal: 'Combo Hipertrofia & Força Pura',
    items: 'Whey Isolado 900g + Creatina Creapure 300g',
    regularPrice: 299.8,
    pixPrice: 249.9,
  });
  const [selectedFlavor, setSelectedFlavor] = useState('Chocolate Belga Cremoso');
  const [athleteName, setAthleteName] = useState('Rafael Monteiro');
  const [suppOrdered, setSuppOrdered] = useState(false);

  const [expressOrders, setExpressOrders] = useState([
    {
      id: 'nt-1',
      code: '#NITRO-509',
      customer: 'Bruno Andrade (Entrega 2h)',
      stack: 'Combo Hipertrofia · Sabor Morango Silvestre',
      total: 249.9,
      status: 'Motoboy Express Acionado (38 min)',
    },
  ]);

  const handleOrderSupplement = () => {
    sound.playSuccess();
    confetti({ particleCount: 55, spread: 65, origin: { y: 0.6 } });
    setExpressOrders([
      {
        id: 'nt-' + Date.now(),
        code: `#NITRO-${510 + expressOrders.length}`,
        customer: `${athleteName || 'Atleta'} (Entrega Expressa 2h)`,
        stack: `${selectedGoal.goal} · Sabor ${selectedFlavor}`,
        total: selectedGoal.pixPrice,
        status: 'Separando Lote ANVISA no Estoque',
      },
      ...expressOrders,
    ]);
    setSuppOrdered(true);
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-red-500/30 bg-[#0D0A0B] text-zinc-100 font-sans shadow-2xl">
      <div className="px-4 py-3 bg-black border-b border-zinc-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-red-500" />
          <span className="text-xs font-mono uppercase tracking-wider font-black text-red-400">
            Nitro Pro Suplementos · Laudo 100% Pureza & Entrega Motoboy 2 Horas
          </span>
        </div>
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          <button
            type="button"
            onClick={() => switchMode('site')}
            className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
              activeTab === 'site' ? 'bg-red-600 text-white' : 'text-zinc-400'
            }`}
          >
            Loja & Montador de Stack
          </button>
          <button
            type="button"
            onClick={() => switchMode('system')}
            className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
              activeTab === 'system' ? 'bg-red-600 text-white' : 'text-zinc-400'
            }`}
          >
            Expedição 2h & Lotes ({expressOrders.length})
          </button>
        </div>
      </div>

      {activeTab === 'site' ? (
        <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xl font-black font-heading text-white uppercase">
              Monte Seu Stack por Objetivo com 15% OFF no Combo + 10% PIX
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                {
                  goal: 'Combo Hipertrofia & Força Pura',
                  items: 'Whey Isolado 900g + Creatina Creapure 300g',
                  regularPrice: 299.8,
                  pixPrice: 249.9,
                },
                {
                  goal: 'Stack Definição & Pré-Treino Insane',
                  items: 'Iso Whey Zero Carb + Pré-Treino 300mg Cafeína',
                  regularPrice: 319.8,
                  pixPrice: 264.9,
                },
              ].map((g) => (
                <button
                  key={g.goal}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedGoal(g);
                  }}
                  className={`p-4 rounded-xl border text-left cursor-pointer ${
                    selectedGoal.goal === g.goal
                      ? 'border-red-500 bg-red-500/15 text-white'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400'
                  }`}
                >
                  <div className="text-xs font-black text-white">{g.goal}</div>
                  <div className="text-[11px] text-zinc-300 mt-1">{g.items}</div>
                  <div className="mt-2 flex items-center gap-2 font-mono">
                    <span className="text-xs line-through text-zinc-500">R$ {g.regularPrice.toFixed(2)}</span>
                    <span className="text-sm font-black text-red-400">R$ {g.pixPrice.toFixed(2)} no PIX</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 block">Escolha o Sabor do Whey Protein:</label>
              <div className="grid grid-cols-3 gap-2">
                {['Chocolate Belga Cremoso', 'Morango Silvestre', 'Baunilha Francesa'].map((flav) => (
                  <button
                    key={flav}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedFlavor(flav);
                    }}
                    className={`p-2 rounded-lg border text-xs font-bold cursor-pointer ${
                      selectedFlavor === flav
                        ? 'border-red-500 bg-red-500/20 text-white'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    {flav}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-5 rounded-2xl bg-zinc-950 border border-red-500/30 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase text-red-400 font-bold">
                Entrega Expressa em Até 2 Horas na Sua Cidade
              </div>
              <input
                type="text"
                value={athleteName}
                onChange={(e) => setAthleteName(e.target.value)}
                placeholder="Seu Nome para Entrega Express"
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white"
              />
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex justify-between items-center font-mono">
                <span className="text-xs text-zinc-400">Total PIX c/ Desconto:</span>
                <span className="text-xl font-black text-emerald-400">R$ {selectedGoal.pixPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOrderSupplement}
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase cursor-pointer"
            >
              Pedir Stack Agora · Receber em 2 Horas
            </button>

            {suppOrdered && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between">
                <span>Pedido despachado para separação!</span>
                <button
                  type="button"
                  onClick={() => switchMode('system')}
                  className="underline font-bold text-red-300 cursor-pointer"
                >
                  Rastrear no ERP
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-5 sm:p-6 space-y-4">
          <h3 className="text-base font-black text-white">NitroFulfillment · Despacho Motoboy 2h & Controle de Lotes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {expressOrders.map((o) => (
              <div key={o.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-red-400 font-bold">{o.code}</span>
                  <span className="text-emerald-400">{o.status}</span>
                </div>
                <div className="text-sm font-black text-white">{o.stack}</div>
                <div className="text-xs text-zinc-400">{o.customer} · Pago R$ {o.total.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

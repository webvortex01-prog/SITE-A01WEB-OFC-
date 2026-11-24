import { useState, useEffect } from 'react';
import {
  Scissors,
  Calendar,
  Clock,
  Check,
  ShieldCheck,
  Car,
  Heart,
  MessageCircle,
  Camera,
  ArrowRight,
  Award,
  Truck,
  Sparkles,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';

export function BarberDemo({
  initialViewMode = 'site',
  onViewModeChange,
}: {
  initialViewMode?: 'site' | 'system';
  onViewModeChange?: (mode: 'site' | 'system') => void;
}) {
  const [activeTab, setActiveTab] = useState<'site' | 'system'>(initialViewMode);
  const [sysTab, setSysTab] = useState<'cadeiras' | 'clube' | 'comissoes'>('cadeiras');

  useEffect(() => {
    setActiveTab(initialViewMode);
  }, [initialViewMode]);

  const switchMode = (mode: 'site' | 'system') => {
    sound.playSelect();
    setActiveTab(mode);
    onViewModeChange?.(mode);
  };

  const services = [
    { id: 's1', name: 'Fade Navalhado + Visagismo', duration: '45 min', price: 65, desc: 'Degradê preciso na navalha, lavagem revigorante e pomada matte importada.' },
    { id: 's2', name: 'Barboterapia Real com Ozônio', duration: '40 min', price: 55, desc: 'Vapor de ozônio quente, toalha aromática de eucalipto e óleo de sândalo.' },
    { id: 's3', name: 'Combo Cavalheiro VIP (Corte + Barba)', duration: '75 min', price: 105, desc: 'Ritual completo + sobrancelha + massagem capilar + Chopp IPA Artesanal.' },
    { id: 's4', name: 'Assinatura Fade Club Ilimitado', duration: 'Mensal', price: 149, desc: 'Cortes e barba ilimitados todos os meses + prioridade de agenda + 15% em produtos.' },
  ];

  const barbers = [
    { id: 'b1', name: 'Mestre Donato', role: 'Especialista Visagismo & Clássicos', chair: 'Cadeira 01', occupancy: '96%' },
    { id: 'b2', name: 'Yuri Razor', role: 'Mestre em Fade & Freestyle', chair: 'Cadeira 02', occupancy: '92%' },
    { id: 'b3', name: 'Vitor Barba', role: 'Alquimista de Barboterapia', chair: 'Cadeira 03', occupancy: '89%' },
  ];

  const [selectedService, setSelectedService] = useState(services[2]);
  const [selectedBarber, setSelectedBarber] = useState(barbers[0]);
  const [selectedSlot, setSelectedSlot] = useState('16:30');
  const [selectedDrink, setSelectedDrink] = useState('Chopp IPA Artesanal Gelado (Cortesia)');
  const [clientName, setClientName] = useState('Guilherme Fontes');
  const [bookedSuccess, setBookedSuccess] = useState(false);

  const [appointments, setAppointments] = useState([
    { id: 'ap1', chair: 'Cadeira 01 · Mestre Donato', client: 'Felipe Camargo', service: 'Combo Cavalheiro VIP', time: '15:00', drink: 'Chopp IPA', status: 'Em Atendimento', price: 105 },
    { id: 'ap2', chair: 'Cadeira 02 · Yuri Razor', client: 'André Marques', service: 'Fade Navalhado', time: '15:30', drink: 'Espresso Duplo', status: 'Confirmado (WhatsApp OK)', price: 65 },
    { id: 'ap3', chair: 'Cadeira 03 · Vitor Barba', client: 'Bruno Gagliasso', service: 'Assinatura Fade Club', time: '16:00', drink: 'Whisky Bourbon', status: 'Assinante VIP', price: 149 },
  ]);

  const handleBookBarber = () => {
    sound.playSuccess();
    confetti({ particleCount: 55, spread: 60, origin: { y: 0.6 } });
    setAppointments([
      {
        id: 'ap-' + Date.now(),
        chair: `${selectedBarber.chair} · ${selectedBarber.name}`,
        client: clientName || 'Cliente Lounge',
        service: selectedService.name,
        time: selectedSlot,
        drink: selectedDrink,
        status: 'Novo Agendamento Online',
        price: selectedService.price,
      },
      ...appointments,
    ]);
    setBookedSuccess(true);
  };

  return (
    <div className="w-full flex flex-col bg-[#120D09] text-amber-50 rounded-2xl overflow-hidden border border-amber-600/30 shadow-2xl">
      {/* Vintage Bourbon & Brushed Brass Top Bar */}
      <div className="px-4 sm:px-6 py-3.5 bg-[#1B130D] border-b border-amber-900/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-600 text-black flex items-center justify-center font-black shadow">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-black tracking-wider uppercase text-amber-100 font-heading">
              FADE PRO BARBER LOUNGE · GENTLEMAN CLUB
            </div>
            <div className="text-[11px] text-amber-400/80">
              Agendamento em 3 Toques · Bar Artesanal Cortesia · Clube de Assinatura PIX
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-amber-800/40 text-xs font-mono">
          <button
            type="button"
            onClick={() => switchMode('site')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer ${
              activeTab === 'site' ? 'bg-amber-500 text-black font-extrabold' : 'text-stone-400 hover:text-white'
            }`}
          >
            Agendar Horário
          </button>
          <button
            type="button"
            onClick={() => switchMode('system')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer ${
              activeTab === 'system' ? 'bg-emerald-500 text-black font-extrabold' : 'text-stone-400 hover:text-white'
            }`}
          >
            BarberOS ({appointments.length})
          </button>
        </div>
      </div>

      {activeTab === 'site' && (
        <div className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Step 1 & 2: Service and Master Barber */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-amber-400 font-bold block">
                  1. Escolha o Ritual ou Clube de Assinatura:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {services.map((srv) => (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSelectedService(srv);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedService.id === srv.id
                          ? 'border-amber-500 bg-amber-500/15 text-white'
                          : 'border-stone-800 bg-[#1A120C] text-stone-300'
                      }`}
                    >
                      <div className="flex justify-between text-xs font-bold">
                        <span>{srv.name}</span>
                        <span className="font-mono text-amber-400">R$ {srv.price}</span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-1 leading-snug">{srv.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-amber-400 font-bold block">
                  2. Selecione o Mestre Barbeiro (Cadeiras Ao Vivo):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {barbers.map((barb) => (
                    <button
                      key={barb.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSelectedBarber(barb);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedBarber.id === barb.id
                          ? 'border-amber-500 bg-amber-500/20 text-white'
                          : 'border-stone-800 bg-[#1A120C] text-stone-400'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{barb.name}</div>
                      <div className="text-[10px] text-amber-400">{barb.chair}</div>
                      <div className="text-[10px] text-stone-400 mt-1">{barb.role}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Time Slot, Courtesy Drink & Confirm */}
            <div className="lg:col-span-5 rounded-2xl bg-[#1B130D] border border-amber-500/30 p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="text-xs font-mono uppercase text-amber-400 font-bold border-b border-amber-900/40 pb-2">
                  3. Horário & Bebida de Cortesia no Lounge
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {['14:00', '15:00', '16:30', '18:00', '19:00', '19:30', '20:00', '20:30'].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSelectedSlot(slot);
                      }}
                      className={`py-2 rounded-lg font-mono text-xs font-bold border cursor-pointer ${
                        selectedSlot === slot
                          ? 'bg-amber-500 text-black border-amber-400'
                          : 'bg-black/40 text-stone-300 border-stone-800'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-300 block">Sua Bebida de Boas-Vindas (Grátis):</label>
                  <select
                    value={selectedDrink}
                    onChange={(e) => setSelectedDrink(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-800 text-xs text-amber-300 font-semibold"
                  >
                    <option value="Chopp IPA Artesanal Gelado (Cortesia)">🍺 Chopp IPA Artesanal Trincando</option>
                    <option value="Whisky Bourbon On The Rocks">🥃 Dose Whisky Bourbon On The Rocks</option>
                    <option value="Café Espresso Italiano Torra Média">☕ Café Espresso Italiano</option>
                  </select>
                </div>

                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Seu Nome"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-800 text-xs text-white"
                />
              </div>

              {bookedSuccess ? (
                <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-2">
                  <div className="text-xs font-bold text-emerald-300">
                    ✓ Cadeira reservada às {selectedSlot} + {selectedDrink} separado!
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setBookedSuccess(false);
                      switchMode('system');
                    }}
                    className="w-full py-2 rounded-lg bg-emerald-400 text-black font-black text-xs cursor-pointer"
                  >
                    Ver Minha Reserva no Mapa de Cadeiras →
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleBookBarber}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs shadow-lg cursor-pointer"
                >
                  Confirmar Cadeira às {selectedSlot} · R$ {selectedService.price},00
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="p-4 sm:p-6 space-y-4 bg-[#0D0A07]">
          <div className="flex flex-wrap gap-2 border-b border-stone-800 pb-3">
            {[
              { id: 'cadeiras', label: '1. Mapa de Cadeiras & Bar Ao Vivo' },
              { id: 'clube', label: '2. Assinantes Recorrentes (Fade Club PIX)' },
              { id: 'comissoes', label: '3. Comissões de Barbeiros (50/50)' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSysTab(t.id as typeof sysTab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                  sysTab === t.id ? 'bg-amber-500 text-black' : 'bg-stone-900 text-stone-400'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {sysTab === 'cadeiras' && (
            <div className="space-y-2.5">
              {appointments.map((ap) => (
                <div key={ap.id} className="p-3.5 rounded-xl bg-[#18120D] border border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-white">{ap.time} · {ap.client} ({ap.chair})</div>
                    <div className="text-stone-400">{ap.service} · Bar: <span className="text-amber-300">{ap.drink}</span></div>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-emerald-400 font-bold">R$ {ap.price},00</span>
                    <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300">{ap.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {sysTab === 'clube' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-[#18120D] border border-stone-800">
                <div className="text-stone-400">Assinantes Ativos (Fade Club)</div>
                <div className="text-2xl font-black text-amber-400 mt-1">142 Membros</div>
                <div className="text-[11px] text-emerald-400 mt-1">Receita Garantida no Dia 1º: R$ 21.158/mês</div>
              </div>
              <div className="p-4 rounded-xl bg-[#18120D] border border-stone-800">
                <div className="text-stone-400">Redução de Faltas (No-Show)</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">-89% Faltas</div>
                <div className="text-[11px] text-stone-400 mt-1">Lembrete automático WhatsApp 2h antes</div>
              </div>
              <div className="p-4 rounded-xl bg-[#18120D] border border-stone-800">
                <div className="text-stone-400">Venda de Pomadas & Óleos</div>
                <div className="text-2xl font-black text-white mt-1">R$ 4.820/mês</div>
                <div className="text-[11px] text-amber-300 mt-1">Upsell no checkout online</div>
              </div>
            </div>
          )}

          {sysTab === 'comissoes' && (
            <div className="p-4 rounded-xl bg-[#18120D] border border-stone-800 text-xs font-mono space-y-2">
              <div className="flex justify-between py-2 border-b border-stone-800 text-stone-400">
                <span>Profissional</span>
                <span>Cortes na Semana</span>
                <span>Comissão Líquida (50%)</span>
              </div>
              <div className="flex justify-between py-2 text-white">
                <span>Mestre Donato (Cadeira 01)</span>
                <span>48 atendimentos</span>
                <span className="text-emerald-400 font-bold">R$ 2.420,00</span>
              </div>
              <div className="flex justify-between py-2 text-white">
                <span>Yuri Razor (Cadeira 02)</span>
                <span>44 atendimentos</span>
                <span className="text-emerald-400 font-bold">R$ 2.150,00</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function PetSpaDemo({
  initialViewMode = 'site',
  onViewModeChange,
}: {
  initialViewMode?: 'site' | 'system';
  onViewModeChange?: (mode: 'site' | 'system') => void;
}) {
  const [activeTab, setActiveTab] = useState<'site' | 'system'>(initialViewMode);
  const [sysTab, setSysTab] = useState<'banho' | 'vacinas' | 'taxi'>('banho');

  useEffect(() => {
    setActiveTab(initialViewMode);
  }, [initialViewMode]);

  const switchMode = (mode: 'site' | 'system') => {
    sound.playSelect();
    setActiveTab(mode);
    onViewModeChange?.(mode);
  };

  const [petName, setPetName] = useState('Thor (Golden Retriever)');
  const [petSize, setPetSize] = useState<'pequeno' | 'medio' | 'grande'>('grande');
  const [selectedPack, setSelectedPack] = useState({ name: 'Spa Hidratação de Aveia + Tosa Higiênica', basePrice: 95 });
  const [needsPetTaxi, setNeedsPetTaxi] = useState(true);
  const [booked, setBooked] = useState(false);

  const [petsInSpa, setPetsInSpa] = useState([
    { id: 'pt1', pet: 'Mel (Spitz Alemão)', tutor: 'Juliana Paes', service: 'Banho Ozônio + Tosa Ursinho', stage: 'Secagem & Laço', taxi: 'Entrega às 16:00' },
    { id: 'pt2', pet: 'Bidu (Shih Tzu)', tutor: 'Marcos Mion', service: 'Clube 4 Banhos Mensal', stage: 'No Banho Morno', taxi: 'Tutor busca no local' },
    { id: 'pt3', pet: 'Simba (Gato Persa)', tutor: 'Carla Perez', service: 'Check-up Vet + Vacina Quádrupla', stage: 'Consultório 02', taxi: 'Pet Táxi Climatizado' },
  ]);

  const sizeExtra = petSize === 'grande' ? 35 : petSize === 'medio' ? 15 : 0;
  const totalPetPrice = selectedPack.basePrice + sizeExtra;

  const handleBookPet = () => {
    sound.playSuccess();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setPetsInSpa([
      {
        id: 'pt-' + Date.now(),
        pet: petName,
        tutor: 'Tutor Online VIP',
        service: selectedPack.name,
        stage: needsPetTaxi ? 'Van Pet Táxi a Caminho' : 'Recepção Spa',
        taxi: needsPetTaxi ? 'Busca e Entrega Grátis' : 'Balcão',
      },
      ...petsInSpa,
    ]);
    setBooked(true);
  };

  return (
    <div className="w-full flex flex-col bg-[#F0FDFA] text-slate-900 rounded-2xl overflow-hidden border border-teal-500/30 shadow-2xl">
      {/* Bright Aqua & Emerald Pet Care Header */}
      <div className="px-4 sm:px-6 py-3.5 bg-teal-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-400 text-teal-950 flex items-center justify-center font-black">
            🐾
          </div>
          <div>
            <div className="text-sm font-black tracking-tight text-white font-heading">
              PET PRIME · CENTRO VETERINÁRIO 24H & SPA
            </div>
            <div className="text-[11px] text-teal-200">
              Banho Hipoalergênico · Van Pet Táxi Climatizada · Carteirinha de Vacinas Digital
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-teal-950 p-1 rounded-xl text-xs font-mono">
          <button
            type="button"
            onClick={() => switchMode('site')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer ${
              activeTab === 'site' ? 'bg-emerald-400 text-teal-950 font-extrabold' : 'text-teal-200'
            }`}
          >
            Agendar Spa & Vet
          </button>
          <button
            type="button"
            onClick={() => switchMode('system')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer ${
              activeTab === 'system' ? 'bg-white text-teal-950 font-extrabold' : 'text-teal-200'
            }`}
          >
            Monitor Banho & Vet ({petsInSpa.length})
          </button>
        </div>
      </div>

      {activeTab === 'site' && (
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#F0FDFA]">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-teal-200 p-5 space-y-4 shadow-sm">
            <h3 className="text-lg font-black text-teal-950">
              Configurador de Estética Animal & Saúde Preventiva
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'pequeno', label: 'Porte Pequeno (Até 10kg)' },
                { id: 'medio', label: 'Porte Médio (11 a 25kg)' },
                { id: 'grande', label: 'Porte Grande (+25kg)' },
              ].map((sz) => (
                <button
                  key={sz.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setPetSize(sz.id as typeof petSize);
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer ${
                    petSize === sz.id
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'bg-teal-50/60 text-teal-900 border-teal-200'
                  }`}
                >
                  {sz.label}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {[
                { name: 'Spa Hidratação de Aveia + Tosa Higiênica', basePrice: 95 },
                { name: 'Tosa na Tesoura Padrão da Raça + Ozonioterapia', basePrice: 135 },
                { name: 'Consulta Veterinária + Vacina Importada V10', basePrice: 210 },
                { name: 'Clube Pet Prime Mensal (4 Banhos + Táxi Grátis)', basePrice: 249 },
              ].map((pk) => (
                <button
                  key={pk.name}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedPack(pk);
                  }}
                  className={`w-full p-3 rounded-xl border text-left text-xs flex justify-between items-center cursor-pointer ${
                    selectedPack.name === pk.name
                      ? 'border-teal-600 bg-teal-50 text-teal-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <span>{pk.name}</span>
                  <span className="font-mono font-bold text-teal-800">R$ {pk.basePrice + sizeExtra}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl border border-teal-200 p-5 flex flex-col justify-between space-y-4 shadow-sm">
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase text-teal-700 font-bold">
                Dados do Pet & Logística Leva-e-Traz
              </div>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-teal-50/50 border border-teal-200 text-xs text-slate-900 font-semibold"
                placeholder="Nome do Pet e Raça"
              />
              <button
                type="button"
                onClick={() => setNeedsPetTaxi(!needsPetTaxi)}
                className={`w-full p-3 rounded-xl border text-left text-xs cursor-pointer flex items-center justify-between ${
                  needsPetTaxi
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <span>🚐 Incluir Van Pet Táxi Climatizada (Busca em Casa)</span>
                <span className="font-mono text-emerald-700">GRÁTIS NO SITE</span>
              </button>
              <div className="p-3 rounded-xl bg-teal-950 text-white flex justify-between items-center font-mono">
                <span className="text-xs">Total do Pacote Pet:</span>
                <span className="text-lg font-black text-emerald-400">R$ {totalPetPrice},00</span>
              </div>
            </div>

            {booked ? (
              <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-400 text-emerald-950 text-center space-y-2">
                <div className="text-xs font-bold">✓ {petName} agendado! Veja o status ao vivo no painel!</div>
                <button
                  type="button"
                  onClick={() => switchMode('system')}
                  className="w-full py-2 rounded-lg bg-teal-900 text-white font-black text-xs cursor-pointer"
                >
                  Acompanhar Banho & Foto no WhatsApp →
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleBookPet}
                className="w-full py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-black text-xs shadow-lg cursor-pointer"
              >
                Confirmar Agendamento Pet Prime
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="p-4 sm:p-6 space-y-4 bg-slate-900 text-white">
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
            {[
              { id: 'banho', label: '1. Esteira de Banho & Tosa (Foto no WhatsApp)' },
              { id: 'vacinas', label: '2. Alerta Automático de Vacinas V10/Raiva' },
              { id: 'taxi', label: '3. Roteiro da Van Pet Táxi' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSysTab(t.id as typeof sysTab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                  sysTab === t.id ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {sysTab === 'banho' && (
            <div className="space-y-2.5">
              {petsInSpa.map((p) => (
                <div key={p.id} className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-white">{p.pet} · Tutor: {p.tutor}</div>
                    <div className="text-slate-300">{p.service} · {p.taxi}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                      {p.stage}
                    </span>
                    <button
                      type="button"
                      onClick={() => sound.playSuccess()}
                      className="px-3 py-1.5 rounded-lg bg-teal-500 text-slate-950 font-bold cursor-pointer"
                    >
                      📸 Enviar Foto Pet Pronto
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {sysTab === 'vacinas' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                <div className="text-emerald-400 font-bold">Disparo Automático de Reforço Anual</div>
                <div className="text-white mt-1">38 Pets com Vacina V10 vencendo nos próximos 15 dias</div>
                <div className="text-slate-400 mt-1">Taxa de retorno em consultas: +64%</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                <div className="text-amber-400 font-bold">Controle de Antipulgas & Vermífugo</div>
                <div className="text-white mt-1">Lembrete a cada 90 dias enviado no WhatsApp do tutor</div>
              </div>
            </div>
          )}

          {sysTab === 'taxi' && (
            <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono space-y-2">
              <div className="text-emerald-400 font-bold">Rota Van Sprinter Climatizada #01 — Motorista Ronaldo</div>
              <div>14:00 · Coleta Mel (Spitz) — Rua Bandeira Paulista, 410</div>
              <div>14:25 · Coleta {petName} — Check-in agendado pelo site</div>
              <div>16:00 · Devolução dos Pets perfumados com crachá QR Code</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function GarageDetailDemo({
  initialViewMode = 'site',
  onViewModeChange,
}: {
  initialViewMode?: 'site' | 'system';
  onViewModeChange?: (mode: 'site' | 'system') => void;
}) {
  const [activeTab, setActiveTab] = useState<'site' | 'system'>(initialViewMode);
  const [vehicleSize, setVehicleSize] = useState<'esportivo' | 'sedan' | 'suv'>('esportivo');
  const [selectedPackage, setSelectedPackage] = useState({
    name: 'Vitrificação Cerâmica Nasiol 9H (Garantia 3 Anos)',
    basePrice: 1290,
    hours: '24h de Cura Infravermelha',
  });
  const [carModel, setCarModel] = useState('Porsche 911 Carrera S (Preto Jet)');
  const [bookedBox, setBookedBox] = useState(false);

  useEffect(() => {
    setActiveTab(initialViewMode);
  }, [initialViewMode]);

  const switchMode = (mode: 'site' | 'system') => {
    sound.playSelect();
    setActiveTab(mode);
    onViewModeChange?.(mode);
  };

  const sizeAdder = vehicleSize === 'suv' ? 350 : vehicleSize === 'sedan' ? 150 : 0;
  const finalCarPrice = selectedPackage.basePrice + sizeAdder;

  const [boxes, setBoxes] = useState([
    { box: 'Box 01 · Iluminação Hexagonal LED', car: 'BMW M3 Competition (Isle of Man Green)', stage: 'Aplicação PPF Frontal Regenerativo', progress: '80% Concluído', cam: 'AO VIVO 4K' },
    { box: 'Box 02 · Cabine Infravermelho', car: 'Porsche Cayenne Coupé Blindada', stage: 'Cura Vitrificação Cerâmica 9H', progress: '95% · Pronto às 17h', cam: 'AO VIVO 4K' },
    { box: 'Box 03 · Detalhamento Interno', car: 'Audi RS6 Avant', stage: 'Higienização Couro Valcona + Ozônio', progress: 'Em Polimento Técnico', cam: 'AO VIVO 4K' },
  ]);

  const handleReserveBox = () => {
    sound.playSuccess();
    confetti({ particleCount: 55, spread: 60, origin: { y: 0.6 } });
    setBoxes([
      {
        box: 'Box 04 · Reserva VIP Confirmada',
        car: carModel,
        stage: selectedPackage.name,
        progress: 'Aguardando Check-in 360°',
        cam: 'CÂMERA ATIVA',
      },
      ...boxes,
    ]);
    setBookedBox(true);
  };

  return (
    <div className="w-full flex flex-col bg-[#0B0C10] text-zinc-100 rounded-2xl overflow-hidden border border-yellow-500/30 shadow-2xl">
      <div className="px-4 sm:px-6 py-3.5 bg-[#12141C] border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-yellow-500 text-black flex items-center justify-center font-black">
            🏎️
          </div>
          <div>
            <div className="text-sm font-black tracking-wider uppercase text-white font-heading">
              GARAGE ESPECIALIZADA · DETAILING & PPF STUDIO
            </div>
            <div className="text-[11px] text-yellow-400/90">
              Vitrificação 9H · Película PPF Regenerativa · Câmera Ao Vivo do Box no Celular
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => switchMode('site')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer ${
              activeTab === 'site' ? 'bg-yellow-500 text-black font-extrabold' : 'text-zinc-400'
            }`}
          >
            Simulador Estética
          </button>
          <button
            type="button"
            onClick={() => switchMode('system')}
            className={`px-3 py-1.5 rounded-lg cursor-pointer ${
              activeTab === 'system' ? 'bg-white text-black font-extrabold' : 'text-zinc-400'
            }`}
          >
            Monitor de Boxes ({boxes.length})
          </button>
        </div>
      </div>

      {activeTab === 'site' && (
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'esportivo', label: 'Coupé / Esportivo' },
                { id: 'sedan', label: 'Sedan Executivo' },
                { id: 'suv', label: 'SUV Grande / Picape' },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setVehicleSize(v.id as typeof vehicleSize);
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer ${
                    vehicleSize === v.id
                      ? 'border-yellow-500 bg-yellow-500/20 text-yellow-300'
                      : 'border-zinc-800 bg-zinc-900/60 text-zinc-400'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {[
                { name: 'Vitrificação Cerâmica Nasiol 9H (Garantia 3 Anos)', basePrice: 1290, hours: '24h de Cura Infravermelha' },
                { name: 'Full Front PPF (Película Anti-Pedrada Regenerativa)', basePrice: 4800, hours: '48h Instalação Precisão' },
                { name: 'Polimento Técnico Espelhado + Higienização Couro', basePrice: 790, hours: 'Entrega no Mesmo Dia' },
              ].map((pk) => (
                <button
                  key={pk.name}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedPackage(pk);
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs flex justify-between items-center cursor-pointer ${
                    selectedPackage.name === pk.name
                      ? 'border-yellow-500 bg-yellow-500/15 text-white font-bold'
                      : 'border-zinc-800 bg-zinc-900/40 text-zinc-300'
                  }`}
                >
                  <div>
                    <div>{pk.name}</div>
                    <div className="text-[10px] text-zinc-400">{pk.hours}</div>
                  </div>
                  <span className="font-mono text-yellow-400 font-bold">R$ {pk.basePrice + sizeAdder}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-[#141722] border border-yellow-500/30 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase text-yellow-400 font-bold">
                Reserva de Box Exclusivo + Acesso Câmera 4K
              </div>
              <input
                type="text"
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-zinc-700 text-xs text-white"
                placeholder="Modelo e Cor do Veículo"
              />
              <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 flex justify-between items-center font-mono">
                <span className="text-xs text-zinc-400">Investimento Total:</span>
                <span className="text-xl font-black text-yellow-400">R$ {finalCarPrice.toLocaleString('pt-BR')}</span>
              </div>
            </div>

            {bookedBox ? (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-2">
                <div className="text-xs font-bold text-emerald-300">✓ Box reservado para {carModel}!</div>
                <button
                  type="button"
                  onClick={() => switchMode('system')}
                  className="w-full py-2 rounded-lg bg-yellow-500 text-black font-black text-xs cursor-pointer"
                >
                  Assistir Câmera dos Boxes no Sistema →
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleReserveBox}
                className="w-full py-3.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xs shadow-lg cursor-pointer"
              >
                Reservar Box & Emitir Vistoria Digital
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="p-4 sm:p-6 space-y-4 bg-[#08090C]">
          <div className="text-xs font-mono text-yellow-400 font-bold">
            MONITORAMENTO DE BOXES AO VIVO & CERTIFICADOS DE GARANTIA 9H
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {boxes.map((b, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#12151E] border border-zinc-800 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-yellow-400 font-bold">{b.box}</span>
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300">{b.cam}</span>
                </div>
                <div className="text-sm font-black text-white">{b.car}</div>
                <div className="text-xs text-zinc-300">{b.stage}</div>
                <div className="text-[11px] font-mono text-emerald-400">{b.progress}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

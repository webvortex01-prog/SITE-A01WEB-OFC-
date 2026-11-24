import { useState, useEffect } from 'react';
import {
  Flame,
  Clock,
  Check,
  Plus,
  Send,
  Truck,
  Wine,
  X,
  ChefHat
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { calculateHalfAndHalfPizzaPrice } from '../../utils/projectCalculators';

interface PizzaFlavor {
  id: string;
  name: string;
  ingredients: string;
  price: number;
  colorClass: string;
  tag: string;
  image: string;
}

interface OvenOrder {
  id: string;
  number: string;
  customer: string;
  pizzaDesc: string;
  crust: string;
  wineAddon?: string;
  total: number;
  stage: 'bancada' | 'forno_450' | 'corte_caixa' | 'motoboy';
  ovenSecondsLeft: number;
}

export default function FoodPizzaDemo({
  initialViewMode = 'site',
  onViewModeChange,
}: {
  initialViewMode?: 'site' | 'system';
  onViewModeChange?: (mode: 'site' | 'system') => void;
}) {
  const [activeTab, setActiveTab] = useState<'site' | 'system'>(initialViewMode);
  const [systemModule, setSystemModule] = useState<'forno' | 'fermentacao' | 'dre'>('forno');

  useEffect(() => {
    setActiveTab(initialViewMode);
  }, [initialViewMode]);

  const switchMode = (mode: 'site' | 'system') => {
    sound.playSelect();
    setActiveTab(mode);
    onViewModeChange?.(mode);
  };

  const flavors: PizzaFlavor[] = [
    {
      id: 'pz1',
      name: 'Margherita Verace D.O.P.',
      ingredients: 'Tomate San Marzano, Fior di Latte fresco, manjericão gigante e azeite extravirgem',
      price: 68,
      colorClass: 'from-red-700 via-red-600 to-amber-200',
      tag: 'Certificada Associazione Verace',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'pz2',
      name: 'Burrata & Prosciutto di Parma',
      ingredients: 'Burrata inteira cremosa, presunto de Parma 18 meses, pesto genovês e raspas de limão siciliano',
      price: 88,
      colorClass: 'from-rose-700 via-amber-100 to-emerald-700',
      tag: 'Mais Pedida da Casa',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'pz3',
      name: 'Diavola & Mel Trufado',
      ingredients: 'Salame spianata picante italiano, mozzarella fior di latte e fio de mel com trufas negras',
      price: 79,
      colorClass: 'from-red-900 via-orange-700 to-amber-500',
      tag: 'Contraste Picante & Doce',
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'pz4',
      name: 'Quattro Formaggi & Figo',
      ingredients: 'Gorgonzola Dolce, Parmigiano 24m, Pecorino Romano, Fior di Latte e figos frescos',
      price: 82,
      colorClass: 'from-amber-200 via-yellow-400 to-amber-600',
      tag: 'Seleção Sommelier',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const [isHalfAndHalf, setIsHalfAndHalf] = useState(true);
  const [leftFlavor, setLeftFlavor] = useState<PizzaFlavor>(flavors[0]);
  const [rightFlavor, setRightFlavor] = useState<PizzaFlavor>(flavors[1]);
  const [selectedCrust, setSelectedCrust] = useState<{ name: string; price: number }>({
    name: 'Borda Recheada Burrata & Pesto (Cortesia Site)',
    price: 0,
  });
  const [includeWine, setIncludeWine] = useState(false);
  const [customerName, setCustomerName] = useState('Família Bellini');
  const [customerAddress, setCustomerAddress] = useState('Rua Mato Grosso, 620 - Higienópolis');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [ovenOrders, setOvenOrders] = useState<OvenOrder[]>([
    {
      id: 'ov1',
      number: '#NP-408',
      customer: 'Lorenzo Castellani',
      pizzaDesc: '1/2 Margherita D.O.P. + 1/2 Burrata & Parma',
      crust: 'Borda Recheada Catupiry',
      wineAddon: 'Vinho Chianti Classico DOCG',
      total: 146,
      stage: 'forno_450',
      ovenSecondsLeft: 64,
    },
    {
      id: 'ov2',
      number: '#NP-407',
      customer: 'Patrícia Abravanel',
      pizzaDesc: 'Inteira Diavola & Mel Trufado',
      crust: 'Cornicione Tradicional Napolitano',
      total: 79,
      stage: 'bancada',
      ovenSecondsLeft: 90,
    },
    {
      id: 'ov3',
      number: '#NP-406',
      customer: 'Ricardo Alencar',
      pizzaDesc: '1/2 Quattro Formaggi + 1/2 Margherita',
      crust: 'Borda Burrata & Pesto',
      total: 75,
      stage: 'corte_caixa',
      ovenSecondsLeft: 0,
    },
  ]);

  const pizzaPrice = calculateHalfAndHalfPizzaPrice(
    leftFlavor.price,
    isHalfAndHalf ? rightFlavor.price : leftFlavor.price,
    selectedCrust.price,
    1
  );
  const finalTotal = pizzaPrice + (includeWine ? 68 : 0);

  const handleSendPizzaOrder = () => {
    sound.playSuccess();
    confetti({ particleCount: 60, spread: 65, origin: { y: 0.6 } });
    const desc = isHalfAndHalf
      ? `1/2 ${leftFlavor.name} + 1/2 ${rightFlavor.name}`
      : `Inteira ${leftFlavor.name}`;
    const newOrder: OvenOrder = {
      id: 'ov-' + Date.now(),
      number: `#NP-${409 + ovenOrders.length}`,
      customer: customerName || 'Cliente Forneria',
      pizzaDesc: desc,
      crust: selectedCrust.name,
      wineAddon: includeWine ? 'Chianti Classico DOCG 750ml' : undefined,
      total: finalTotal,
      stage: 'bancada',
      ovenSecondsLeft: 90,
    };
    setOvenOrders([newOrder, ...ovenOrders]);
    setOrderSuccess(true);
  };

  const advanceOvenStage = (id: string) => {
    sound.playSelect();
    setOvenOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        if (o.stage === 'bancada') return { ...o, stage: 'forno_450', ovenSecondsLeft: 85 };
        if (o.stage === 'forno_450') return { ...o, stage: 'corte_caixa', ovenSecondsLeft: 0 };
        return { ...o, stage: 'motoboy' };
      })
    );
  };

  return (
    <div className="w-full flex flex-col bg-[#FFFDF9] text-stone-900 rounded-2xl overflow-hidden border border-orange-800/30 shadow-2xl">
      {/* Authentic Italian Osteria Header (Terracotta, Basil Green & Warm Flour Cream) */}
      <div className="px-4 sm:px-6 py-3.5 bg-[#1F120C] text-amber-50 border-b border-orange-900/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-700 via-orange-600 to-emerald-700 flex items-center justify-center text-white font-serif font-bold text-sm shadow">
            DN
          </div>
          <div>
            <div className="text-sm font-black tracking-wide text-amber-50 font-heading">
              FORNERIA DI NAPOLI · FORNO A LENHA 450°C
            </div>
            <div className="text-[11px] text-orange-200/80">
              Fermentação Natural Longa (48h) · Farinha Caputo 00 Italiana · Assada em 90 Segundos
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-orange-900/50 text-xs font-mono">
          <button
            type="button"
            onClick={() => switchMode('site')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'site'
                ? 'bg-red-700 text-white font-extrabold shadow'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Montador Meio a Meio
          </button>
          <button
            type="button"
            onClick={() => switchMode('system')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'system'
                ? 'bg-emerald-700 text-white font-extrabold shadow'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            KDS Forno 450°C ({ovenOrders.length})
          </button>
        </div>
      </div>

      {/* VIEW 1: ARTISANAL OSTERIA SITE & HALF-AND-HALF PIZZA VISUALIZER */}
      {activeTab === 'site' && (
        <div className="p-4 sm:p-6 space-y-6 bg-[#FFFDF7]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Interactive Circular Pizza Visualizer */}
            <div className="lg:col-span-5 rounded-2xl bg-[#F6EFE2] border border-orange-900/20 p-5 flex flex-col items-center text-center space-y-4">
              <div className="flex items-center justify-between w-full text-xs font-mono text-stone-700">
                <span className="font-bold text-red-800">FORNADA AO VIVO</span>
                <span>35cm · 8 Fatias Napolitanas</span>
              </div>

              {/* Mode Toggle: 1 Sabor vs 2 Sabores */}
              <div className="grid grid-cols-2 gap-2 w-full bg-stone-200/80 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsHalfAndHalf(false);
                  }}
                  className={`py-2 rounded-lg cursor-pointer ${
                    !isHalfAndHalf ? 'bg-red-700 text-white shadow' : 'text-stone-700'
                  }`}
                >
                  Pizza Inteira (1 Sabor)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsHalfAndHalf(true);
                  }}
                  className={`py-2 rounded-lg cursor-pointer ${
                    isHalfAndHalf ? 'bg-red-700 text-white shadow' : 'text-stone-700'
                  }`}
                >
                  Meio a Meio (2 Sabores)
                </button>
              </div>

              {/* Interactive Pizza Disc */}
              <div className="relative w-52 h-52 rounded-full p-3 bg-gradient-to-br from-amber-600 via-amber-700 to-stone-800 shadow-2xl flex items-center justify-center border-4 border-amber-800/60">
                <div className="w-full h-full rounded-full overflow-hidden flex relative border-2 border-amber-200/50">
                  {/* Left Half */}
                  <div className={`w-1/2 h-full relative overflow-hidden`}>
                    <img
                      src={leftFlavor.image}
                      alt={leftFlavor.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover scale-125"
                    />
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center p-1">
                      <span className="bg-black/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                        1/2 {leftFlavor.name.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                  {/* Right Half */}
                  <div className="w-1/2 h-full relative overflow-hidden border-l-2 border-dashed border-amber-200">
                    <img
                      src={(isHalfAndHalf ? rightFlavor : leftFlavor).image}
                      alt="Metade Direita"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover scale-125"
                    />
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center p-1">
                      <span className="bg-black/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                        1/2 {(isHalfAndHalf ? rightFlavor : leftFlavor).name.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full p-3 rounded-xl bg-white border border-stone-200 text-left space-y-1">
                <div className="text-xs font-black text-stone-900">
                  {isHalfAndHalf
                    ? `½ ${leftFlavor.name} + ½ ${rightFlavor.name}`
                    : `Inteira ${leftFlavor.name}`}
                </div>
                <div className="text-[11px] text-emerald-800 font-semibold">{selectedCrust.name}</div>
                <div className="text-lg font-black font-mono text-red-800 pt-1 tabular-nums">
                  Total: R$ {finalTotal.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Right: Flavor Selectors, Crust, Wine Pairing & Checkout */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Left Half Selector */}
                <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-2">
                  <div className="text-xs font-black text-red-800 uppercase font-mono">
                    {isHalfAndHalf ? '1. Escolha a 1ª Metade (Esquerda):' : '1. Escolha o Sabor da Pizza:'}
                  </div>
                  {flavors.map((fl) => (
                    <button
                      key={fl.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setLeftFlavor(fl);
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        leftFlavor.id === fl.id
                          ? 'border-red-700 bg-red-50 text-stone-950 font-bold'
                          : 'border-stone-200 bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="flex justify-between">
                        <span>{fl.name}</span>
                        <span className="font-mono text-red-800">R$ {fl.price}</span>
                      </div>
                      <div className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">{fl.ingredients}</div>
                    </button>
                  ))}
                </div>

                {/* Right Half Selector */}
                <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-2">
                  <div className="text-xs font-black text-emerald-800 uppercase font-mono">
                    {isHalfAndHalf ? '2. Escolha a 2ª Metade (Direita):' : '2. Borda & Harmonização:'}
                  </div>
                  {isHalfAndHalf &&
                    flavors.map((fl) => (
                      <button
                        key={fl.id}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setRightFlavor(fl);
                        }}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                          rightFlavor.id === fl.id
                            ? 'border-emerald-700 bg-emerald-50 text-stone-950 font-bold'
                            : 'border-stone-200 bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className="flex justify-between">
                          <span>{fl.name}</span>
                          <span className="font-mono text-emerald-800">R$ {fl.price}</span>
                        </div>
                        <div className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">{fl.ingredients}</div>
                      </button>
                    ))}
                </div>
              </div>

              {/* Crust & Sommelier Wine Upsell */}
              <div className="p-4 rounded-2xl bg-[#F6EFE2] border border-orange-900/20 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setIncludeWine(!includeWine);
                    }}
                    className={`flex-1 p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                      includeWine
                        ? 'border-red-800 bg-red-900 text-white font-bold'
                        : 'border-stone-300 bg-white text-stone-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Wine className="w-4 h-4 shrink-0" />
                      <span>Harmonizar com Vinho Italiano Chianti DOCG 750ml</span>
                    </span>
                    <span className="font-mono font-bold">+ R$ 68,00</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Seu Nome"
                    className="px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900"
                  />
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Endereço de Entrega"
                    className="px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900"
                  />
                </div>

                {orderSuccess ? (
                  <div className="p-3 rounded-xl bg-emerald-800 text-white text-center space-y-2">
                    <div className="text-xs font-bold">
                      ✓ Pizza enviada para a Bancada de Abertura & Forno a Lenha 450°C!
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOrderSuccess(false);
                        switchMode('system');
                      }}
                      className="w-full py-2 rounded-lg bg-amber-300 text-stone-950 font-black text-xs cursor-pointer"
                    >
                      Acompanhar Fornada no KDS da Pizzaria →
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendPizzaOrder}
                    className="w-full py-3.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-black text-xs shadow-lg cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Flame className="w-4 h-4" />
                    <span>Enviar Pedido Direto ao Pizzaiolo · R$ {finalTotal.toFixed(2)}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: WOOD OVEN 450°C KDS & DOUGH FERMENTATION ERP */}
      {activeTab === 'system' && (
        <div className="p-4 sm:p-6 space-y-5 bg-[#160D09] text-stone-100">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'forno', label: '1. KDS Forno a Lenha 450°C (Cronômetro 90s)' },
                { id: 'fermentacao', label: '2. Lotes de Massa (Fermentação 48h)' },
                { id: 'dre', label: '3. Fechamento da Noite & Economia iFood' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSystemModule(m.id as typeof systemModule)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    systemModule === m.id ? 'bg-red-700 text-white' : 'bg-stone-900 text-stone-400'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <span className="text-xs font-mono text-orange-400 font-bold">
              Temp. Cúpula do Forno: 452°C · Lenha de Macieira
            </span>
          </div>

          {systemModule === 'forno' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ovenOrders.map((ord) => (
                <div key={ord.id} className="p-4 rounded-2xl bg-[#21140E] border border-orange-900/40 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-amber-400 font-black">{ord.number}</span>
                      <span className="px-2 py-0.5 rounded bg-red-900/50 text-red-200 text-[10px]">
                        {ord.stage.toUpperCase().replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white">{ord.customer}</div>
                    <div className="text-xs text-amber-200 font-semibold">{ord.pizzaDesc}</div>
                    <div className="text-[11px] text-stone-400">{ord.crust}</div>
                    {ord.wineAddon && (
                      <div className="text-[11px] text-rose-300 font-mono">+ {ord.wineAddon}</div>
                    )}
                  </div>
                  <div className="pt-2 border-t border-stone-800 space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span>Tempo de Forno: {ord.ovenSecondsLeft}s</span>
                      <span className="text-emerald-400 font-bold">R$ {ord.total.toFixed(2)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => advanceOvenStage(ord.id)}
                      className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs cursor-pointer"
                    >
                      Avançar Etapa da Fornada →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {systemModule === 'fermentacao' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              {[
                { batch: 'Lote #88A (Câmara Fria 4°C)', hydration: 'Hidratação 68% · Farinha Caputo Blu', hours: '48h Concluídas · Pronto p/ Uso', balls: '64 Panetti Disponíveis' },
                { batch: 'Lote #89B (Maturação)', hydration: 'Hidratação 70% · Fermento Levain', hours: '32h de 48h (Uso Amanhã)', balls: '80 Panetti em Descanso' },
                { batch: 'Tomate San Marzano D.O.P.', hydration: 'Importado Nápoles · Lote #19', hours: 'Estoque Ideal', balls: '42 Latas de 2.5kg' },
              ].map((b, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#21140E] border border-stone-800 space-y-1.5">
                  <div className="text-amber-400 font-bold">{b.batch}</div>
                  <div className="text-white">{b.hydration}</div>
                  <div className="text-emerald-400">{b.hours}</div>
                  <div className="text-stone-400">{b.balls}</div>
                </div>
              ))}
            </div>
          )}

          {systemModule === 'dre' && (
            <div className="p-4 rounded-xl bg-[#21140E] border border-stone-800 grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div>
                <div className="text-stone-400">Pizzas Vendidas Hoje (Canal Próprio)</div>
                <div className="text-xl font-black text-white mt-1">84 Pizzas · R$ 7.390,00</div>
              </div>
              <div>
                <div className="text-stone-400">Comissão Economizada (Sem iFood 27%)</div>
                <div className="text-xl font-black text-emerald-400 mt-1">+ R$ 1.995,30 Hoje</div>
              </div>
              <div>
                <div className="text-stone-400">Tempo Médio Forno + Entrega</div>
                <div className="text-xl font-black text-amber-400 mt-1">24 Minutos</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

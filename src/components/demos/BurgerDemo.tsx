import { useState, useEffect } from 'react';
import {
  Flame,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Clock,
  MapPin,
  TrendingUp,
  ChefHat,
  Bell,
  MessageCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Sliders,
  DollarSign,
  Truck,
  Send,
  X,
  Printer,
  Layers,
  QrCode,
  Calculator
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { calculateCustomBurgerPrice, calculateMarketplaceSavings } from '../../utils/projectCalculators';

interface BurgerItem {
  id: string;
  name: string;
  tagline: string;
  price: number;
  cmvCost: number;
  category: 'smash' | 'artesanal' | 'acompanhamento' | 'bebida';
  image: string;
  badge?: string;
  isPopular?: boolean;
  description: string;
  calories: string;
  isAvailable: boolean;
}

interface CartItem {
  burger: BurgerItem;
  quantity: number;
  selectedDoneness: string;
  selectedBread: string;
  extras: { name: string; price: number }[];
  notes: string;
}

interface KdsOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: string[];
  total: number;
  status: 'novos' | 'grelha' | 'embalagem' | 'entregue';
  timeAgo: string;
  deliveryType: 'Delivery (Motoboy)' | 'Retirada Balcão';
  address: string;
  courierName?: string;
}

export default function BurgerDemo({
  initialViewMode = 'site',
  onViewModeChange,
}: {
  initialViewMode?: 'site' | 'system';
  onViewModeChange?: (mode: 'site' | 'system') => void;
}) {
  const [activeTab, setActiveTab] = useState<'site' | 'system'>(initialViewMode);
  const [siteSection, setSiteSection] = useState<'cardapio' | 'montar' | 'avaliacoes'>('cardapio');
  const [systemModule, setSystemModule] = useState<'kds' | 'motoboys' | 'estoque' | 'dre'>('kds');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'smash' | 'artesanal' | 'acompanhamento' | 'bebida'>('all');

  useEffect(() => {
    setActiveTab(initialViewMode);
  }, [initialViewMode]);

  const switchMode = (mode: 'site' | 'system') => {
    sound.playSelect();
    setActiveTab(mode);
    onViewModeChange?.(mode);
  };

  // Interactive Custom Burger Builder State ("Monte Seu Smash")
  const [builderBread, setBuilderBread] = useState<{ name: string; price: number; color: string }>({
    name: 'Brioche Amanteigado Selado',
    price: 0,
    color: 'from-amber-500 to-amber-700',
  });
  const [builderPattyCount, setBuilderPattyCount] = useState<1 | 2 | 3>(2);
  const [builderDoneness, setBuilderDoneness] = useState('Ao Ponto Suculento (Rosado)');
  const [builderCheese, setBuilderCheese] = useState<{ name: string; price: number }>({
    name: 'Cheddar Inglês Melt Duplo',
    price: 4,
  });
  const [builderExtras, setBuilderExtras] = useState<{ name: string; price: number }[]>([
    { name: 'Bacon Defumado em Lenha de Macieira', price: 6.5 },
  ]);
  const [builderSauce, setBuilderSauce] = useState('Maionese Defumada da Casa');
  const [builderCombo, setBuilderCombo] = useState(true);

  const builderExtrasSum = builderExtras.reduce((acc, e) => acc + e.price, 0);
  const customBurgerStats = calculateCustomBurgerPrice({
    breadPrice: builderBread.price,
    pattyCount: builderPattyCount,
    cheesePrice: builderCheese.price,
    extrasTotal: builderExtrasSum,
    isCombo: builderCombo,
  });

  // Customizer modal state
  const [selectedBurgerForModal, setSelectedBurgerForModal] = useState<BurgerItem | null>(null);
  const [customDoneness, setCustomDoneness] = useState<string>('Ao Ponto da Casa (Rosado)');
  const [customBread, setCustomBread] = useState<string>('Brioche Amanteigado');
  const [selectedExtras, setSelectedExtras] = useState<{ name: string; price: number }[]>([]);
  const [customNotes, setCustomNotes] = useState<string>('');

  // Menu items state (allows toggling availability in ERP)
  const [menuItems, setMenuItems] = useState<BurgerItem[]>([
    {
      id: 'b1',
      name: 'Grelha Nobre Smash Duplo',
      tagline: '2x Smash 90g Angus, queijo cheddar inglês derretido, bacon artesanal crocante e maionese defumada.',
      price: 36.9,
      cmvCost: 11.4,
      category: 'smash',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      badge: 'Mais Vendido',
      isPopular: true,
      description: 'Nosso clássico que conquistou a cidade. Carne prensada na chapa a 300°C com crostinha caramelizada irresistível.',
      calories: '780 kcal',
      isAvailable: true,
    },
    {
      id: 'b2',
      name: 'Trufado Supreme Black',
      tagline: 'Pão australiano tostado, 180g blend angus, queijo brie maçaricado, cebola caramelizada e maionese trufada.',
      price: 44.9,
      cmvCost: 14.8,
      category: 'artesanal',
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
      badge: 'Receita do Chef',
      isPopular: true,
      description: 'Experiência gastronômica de alta intensidade. Ingredientes nobres selecionados pelo nosso chef executivo.',
      calories: '860 kcal',
      isAvailable: true,
    },
    {
      id: 'b3',
      name: 'Smash Bacon Jalapeño Bomb',
      tagline: '2x smash 90g, cheddar cremoso, jalapeños defumados salteados e barbecue artesanal de bourbon.',
      price: 38.5,
      cmvCost: 12.1,
      category: 'smash',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
      badge: 'Levemente Picante',
      isPopular: false,
      description: 'Picância equilibrada e sabor defumado perfeito para quem quer sair da rotina.',
      calories: '740 kcal',
      isAvailable: true,
    },
    {
      id: 'b4',
      name: 'Batata Rústica Alecrim & Alho',
      tagline: 'Batatas selecionadas fritas em imersão dupla com alho confitado, páprica e alecrim fresco.',
      price: 19.9,
      cmvCost: 4.5,
      category: 'acompanhamento',
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
      badge: 'Super Crocante',
      isPopular: true,
      description: 'Acompanha nossa famosa maionese verde artesanal à base de ervas frescas.',
      calories: '420 kcal',
      isAvailable: true,
    },
    {
      id: 'b5',
      name: 'Onion Rings Empanadas Panko',
      tagline: 'Anéis de cebola doce empanados na farinha japonesa panko com molho sweet chilli.',
      price: 21.0,
      cmvCost: 5.2,
      category: 'acompanhamento',
      image: 'https://images.unsplash.com/photo-1639024471287-032f66e51085?auto=format&fit=crop&w=600&q=80',
      badge: 'Acompanha Molho',
      isPopular: false,
      description: 'Crocância que dura até a entrega na sua casa em embalagem ventilada.',
      calories: '390 kcal',
      isAvailable: true,
    },
    {
      id: 'b6',
      name: 'Milkshake Nutella & Avelã 450ml',
      tagline: 'Sorvete de baunilha de fava, generosa dose de Nutella pura e farofa de avelã tostada.',
      price: 22.9,
      cmvCost: 6.8,
      category: 'bebida',
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
      badge: 'Sobremesa',
      isPopular: true,
      description: 'Copo de 450ml com calda cremosa e chantilly fresco.',
      calories: '550 kcal',
      isAvailable: true,
    },
  ]);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([
    {
      burger: menuItems[0],
      quantity: 1,
      selectedDoneness: 'Ao Ponto da Casa (Rosado)',
      selectedBread: 'Brioche Amanteigado',
      extras: [{ name: 'Bacon Artesanal Dobrado', price: 7.0 }],
      notes: 'Maionese extra à parte por favor!',
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderDeliveryType, setOrderDeliveryType] = useState<'delivery' | 'retirada'>('delivery');
  const [selectedNeighborhoodZone, setSelectedNeighborhoodZone] = useState<{ name: string; fee: number; mins: number }>({
    name: 'Centro / Jardins (Até 3km)',
    fee: 5.9,
    mins: 22,
  });
  const [couponCode, setCouponCode] = useState('BURGER01');
  const [couponApplied, setCouponApplied] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao' | 'dinheiro'>('pix');
  const [clientName, setClientName] = useState('Carlos Eduardo');
  const [clientAddress, setClientAddress] = useState('Rua das Acácias, 450 - Apto 82');
  const [orderSentSuccess, setOrderSentSuccess] = useState(false);
  const [receiptModalOrder, setReceiptModalOrder] = useState<KdsOrder | null>(null);

  // DRE Simulator state
  const [dreMonthlyOrders, setDreMonthlyOrders] = useState(1200);
  const [dreAvgTicket, setDreAvgTicket] = useState(64);
  const dreSavings = calculateMarketplaceSavings(dreMonthlyOrders, dreAvgTicket);

  // KDS Orders state
  const [kdsOrders, setKdsOrders] = useState<KdsOrder[]>([
    {
      id: 'k1',
      orderNumber: '#0184',
      customerName: 'Mariana Silveira',
      customerPhone: '(11) 98765-4321',
      items: ['1x Trufado Supreme (Pão Australiano)', '1x Batata Rústica Alecrim', '1x Coca Zero'],
      total: 62.9,
      status: 'novos',
      timeAgo: 'Há 2 min',
      deliveryType: 'Delivery (Motoboy)',
      address: 'Av. Paulista, 1200 - Bela Vista',
      courierName: 'Lucas Motoboy (Honda CG 160)',
    },
    {
      id: 'k2',
      orderNumber: '#0183',
      customerName: 'Lucas Rocha',
      customerPhone: '(11) 97123-9988',
      items: ['2x Grelha Nobre Smash Duplo', '1x Onion Rings Crocante'],
      total: 94.8,
      status: 'grelha',
      timeAgo: 'Há 7 min',
      deliveryType: 'Delivery (Motoboy)',
      address: 'Rua Oscar Freire, 310 - Jardins',
      courierName: 'Marcos Silva (Yamaha Fazer)',
    },
    {
      id: 'k3',
      orderNumber: '#0182',
      customerName: 'Rodrigo Antunes',
      customerPhone: '(11) 96541-1122',
      items: ['1x Smash Bacon Jalapeño Bomb', '1x Milkshake Nutella 450ml'],
      total: 61.4,
      status: 'embalagem',
      timeAgo: 'Há 14 min',
      deliveryType: 'Retirada Balcão',
      address: 'Retirada no Balcão 01',
    },
    {
      id: 'k4',
      orderNumber: '#0181',
      customerName: 'Fernanda Lima',
      customerPhone: '(11) 99332-4455',
      items: ['1x Grelha Nobre Smash Duplo', '1x Batata Rústica Alecrim'],
      total: 56.8,
      status: 'entregue',
      timeAgo: 'Há 26 min',
      deliveryType: 'Delivery (Motoboy)',
      address: 'Rua Pamplona, 880',
      courierName: 'Tiago Express',
    },
  ]);

  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const availableExtras = [
    { name: 'Bacon Artesanal Dobrado', price: 7.0 },
    { name: 'Queijo Cheddar Inglês Duplo', price: 6.0 },
    { name: 'Cebola Caramelizada na Chapa', price: 5.0 },
    { name: 'Ovo Caipira Gema Mole', price: 4.5 },
    { name: 'Molho Especial da Casa (Pote Extra)', price: 3.5 },
  ];

  const handleAddCustomBuiltBurger = () => {
    sound.playSuccess();
    const customItem: BurgerItem = {
      id: 'custom-' + Date.now(),
      name: `Smash Autoral (${builderPattyCount}x 90g Angus)`,
      tagline: `${builderBread.name} · ${builderCheese.name} · ${builderSauce}${builderCombo ? ' + Combo Fritas & Bebida' : ''}`,
      price: customBurgerStats.unitPrice,
      cmvCost: Number((customBurgerStats.unitPrice * 0.31).toFixed(2)),
      category: 'smash',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      badge: 'Criado por Você',
      description: 'Hambúrguer personalizado no montador interativo Grelha Nobre.',
      calories: `${customBurgerStats.calories} kcal`,
      isAvailable: true,
    };

    setCart((prev) => [
      ...prev,
      {
        burger: customItem,
        quantity: 1,
        selectedDoneness: builderDoneness,
        selectedBread: builderBread.name,
        extras: builderExtras,
        notes: `Molho: ${builderSauce}${builderCombo ? ' | Acompanha Batata + Refri Lata' : ''}`,
      },
    ]);
    setIsCartOpen(true);
  };

  const openCustomizer = (burger: BurgerItem) => {
    if (!burger.isAvailable) return;
    sound.playSelect();
    setSelectedBurgerForModal(burger);
    setCustomDoneness('Ao Ponto da Casa (Rosado)');
    setCustomBread('Brioche Amanteigado');
    setSelectedExtras([]);
    setCustomNotes('');
  };

  const toggleExtra = (extra: { name: string; price: number }) => {
    sound.playClick();
    if (selectedExtras.some((e) => e.name === extra.name)) {
      setSelectedExtras(selectedExtras.filter((e) => e.name !== extra.name));
    } else {
      setSelectedExtras([...selectedExtras, extra]);
    }
  };

  const handleAddToCartFromModal = () => {
    if (!selectedBurgerForModal) return;
    sound.playSuccess();
    const newItem: CartItem = {
      burger: selectedBurgerForModal,
      quantity: 1,
      selectedDoneness: customDoneness,
      selectedBread: customBread,
      extras: selectedExtras,
      notes: customNotes,
    };
    setCart([...cart, newItem]);
    setSelectedBurgerForModal(null);
    setIsCartOpen(true);
  };

  const updateCartQty = (idx: number, delta: number) => {
    sound.playClick();
    setCart((prev) =>
      prev
        .map((item, i) => (i === idx ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const toggleMenuItemAvailability = (id: string) => {
    sound.playClick();
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isAvailable: !item.isAvailable } : item))
    );
  };

  const subtotal = cart.reduce((acc, item) => {
    const extrasSum = item.extras.reduce((sum, e) => sum + e.price, 0);
    return acc + (item.burger.price + extrasSum) * item.quantity;
  }, 0);

  const deliveryFee = orderDeliveryType === 'delivery' ? selectedNeighborhoodZone.fee : 0;
  const discount = couponApplied ? subtotal * 0.15 : 0;
  const pixBonusDiscount = paymentMethod === 'pix' ? (subtotal - discount) * 0.05 : 0;
  const finalTotal = Math.max(0, subtotal + deliveryFee - discount - pixBonusDiscount);

  const handleFinishOrder = () => {
    if (cart.length === 0) return;
    sound.playSuccess();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
    });

    const newOrderNum = `#0${185 + kdsOrders.length}`;
    const newKdsOrder: KdsOrder = {
      id: 'k-' + Date.now(),
      orderNumber: newOrderNum,
      customerName: clientName || 'Cliente VIP',
      customerPhone: '(11) 99888-7766',
      items: cart.map(
        (c) =>
          `${c.quantity}x ${c.burger.name} (${c.selectedBread}${
            c.extras.length ? ' + ' + c.extras.map((e) => e.name).join(', ') : ''
          })`
      ),
      total: finalTotal,
      status: 'novos',
      timeAgo: 'Agora mesmo',
      deliveryType: orderDeliveryType === 'delivery' ? 'Delivery (Motoboy)' : 'Retirada Balcão',
      address: orderDeliveryType === 'delivery' ? `${clientAddress} · ${selectedNeighborhoodZone.name}` : 'Retirada no Balcão',
      courierName: 'Aguardando Despacho Automático',
    };

    setKdsOrders([newKdsOrder, ...kdsOrders]);
    setOrderSentSuccess(true);
  };

  const advanceOrderStatus = (orderId: string) => {
    sound.playSelect();
    setKdsOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const nextMap: Record<KdsOrder['status'], KdsOrder['status']> = {
          novos: 'grelha',
          grelha: 'embalagem',
          embalagem: 'entregue',
          entregue: 'entregue',
        };
        const nextStatus = nextMap[order.status];
        return { ...order, status: nextStatus };
      })
    );
  };

  const sendWhatsAppNotification = (order: KdsOrder) => {
    sound.playSuccess();
    const statusText =
      order.status === 'novos'
        ? 'foi recebido na cozinha e já vai para a chapa 300°C 🔥'
        : order.status === 'grelha'
        ? 'está na grelha sendo preparado com todo cuidado 🍔'
        : order.status === 'embalagem'
        ? 'está sendo embalado com lacre térmico de segurança 📦'
        : 'saiu para entrega com nosso motoboy parceiro! 🛵💨';

    setNotificationToast(`WhatsApp Automático enviado para ${order.customerName}: "Seu pedido ${order.orderNumber} ${statusText}"`);
    setTimeout(() => setNotificationToast(null), 4500);
  };

  const filteredMenu =
    selectedCategory === 'all' ? menuItems : menuItems.filter((m) => m.category === selectedCategory);

  const totalRevenueToday = kdsOrders.reduce((acc, o) => acc + o.total, 0) + 1840.5;

  return (
    <div className="w-full flex flex-col bg-[#110805] text-stone-100 rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl">
      {/* Top Bar Brand + Mode Switcher */}
      <div className="px-4 sm:px-6 py-3.5 bg-[#190B06] border-b border-amber-900/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-black font-black shadow-md">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="text-sm font-black tracking-tight text-amber-50 font-heading">
              GRELHA NOBRE · SMASH HOUSE
            </div>
            <div className="text-[11px] text-amber-300/80">
              Forno & Chapa 300°C · Tempo Médio: {selectedNeighborhoodZone.mins} min · 0% Taxa iFood
            </div>
          </div>
        </div>

        {/* Navigation inside Site or System Switch */}
        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'site' && (
            <div className="hidden md:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-amber-900/40 text-xs">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSiteSection('cardapio');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  siteSection === 'cardapio' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-stone-400 hover:text-white'
                }`}
              >
                Cardápio Digital
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSiteSection('montar');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  siteSection === 'montar' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-stone-400 hover:text-white'
                }`}
              >
                Montar Meu Smash (3D)
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSiteSection('avaliacoes');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  siteSection === 'avaliacoes' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-stone-400 hover:text-white'
                }`}
              >
                Avaliações (4.9/5)
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-amber-800/50 text-xs font-mono">
            <button
              type="button"
              onClick={() => switchMode('site')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'site'
                  ? 'bg-gradient-to-r from-amber-500 to-red-600 text-black font-extrabold shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
               Cardápio Cliente
            </button>
            <button
              type="button"
              onClick={() => switchMode('system')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'system'
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-extrabold shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>ERP & KDS Cozinha ({kdsOrders.filter((o) => o.status !== 'entregue').length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {notificationToast && (
        <div className="bg-emerald-500 text-slate-950 px-4 py-2.5 text-xs font-mono font-bold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>{notificationToast}</span>
          </div>
          <button type="button" onClick={() => setNotificationToast(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ==========================================
          VIEW 1: CLIENT WEBSITE & DIGITAL MENU
          ========================================== */}
      {activeTab === 'site' && (
        <div className="relative p-4 sm:p-6 space-y-6">
          {/* Hero Split with Artisanal Visual + Quick Action */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#240F07] via-[#1B0B06] to-[#110704] border border-amber-500/30 p-5 sm:p-7">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
              <div className="lg:col-span-7 space-y-3">
                <div className="text-xs font-mono text-amber-400 tracking-wide">
                  BLENDS 100% ANGUS CERTIFICADO · PÃO BRIOCHE DE FERMENTAÇÃO NATURAL
                </div>
                <h2 className="text-2xl sm:text-4xl font-black font-heading text-white leading-tight">
                  Crostinha Caramelizada na Chapa a 300°C.{' '}
                  <span className="text-amber-400">Sem Taxas de Aplicativo.</span>
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
                  Peça direto no nosso canal oficial: ganhe 15% OFF com o cupom <strong className="text-amber-300">BURGER01</strong> + 5% extra no PIX automático e receba quentinho em {selectedNeighborhoodZone.mins} minutos.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playSelect();
                      setSiteSection(siteSection === 'montar' ? 'cardapio' : 'montar');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all cursor-pointer shadow-lg shadow-amber-500/20 whitespace-nowrap"
                  >
                    {siteSection === 'montar' ? 'Voltar ao Cardápio Clássico' : 'Montar Meu Smash em Camadas (3D)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setIsCartOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-amber-200 border border-amber-500/30 font-bold text-xs transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                    <span>Sacola ({cart.reduce((a, b) => a + b.quantity, 0)}) · R$ {finalTotal.toFixed(2)}</span>
                  </button>
                </div>
              </div>

              {/* Delivery Fee Calculator Widget inside Hero */}
              <div className="lg:col-span-5 bg-black/50 backdrop-blur-md border border-amber-500/25 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    Simulador de Entrega Expressa
                  </span>
                  <span className="font-mono text-[11px] text-emerald-400">Motoboys Próprios</span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { name: 'Centro / Jardins (Até 3km)', fee: 5.9, mins: 22 },
                    { name: 'Vila Mariana / Pinheiros (3 a 6km)', fee: 8.9, mins: 29 },
                    { name: 'Moema / Itaim / Brooklin (6 a 9km)', fee: 11.9, mins: 36 },
                  ].map((zone) => (
                    <button
                      key={zone.name}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSelectedNeighborhoodZone(zone);
                      }}
                      className={`w-full px-3 py-2 rounded-xl border text-left text-xs flex items-center justify-between transition-all cursor-pointer ${
                        selectedNeighborhoodZone.name === zone.name
                          ? 'border-amber-500 bg-amber-500/15 text-white font-bold'
                          : 'border-stone-800 bg-stone-900/60 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <span className="truncate">{zone.name}</span>
                      <span className="font-mono shrink-0 ml-2 text-amber-300">
                        ~{zone.mins}min · R$ {zone.fee.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION A: INTERACTIVE 3D-STACK BURGER BUILDER */}
          {siteSection === 'montar' && (
            <div className="rounded-2xl bg-[#1A0C06] border border-amber-500/40 p-5 sm:p-6 space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-900/40 pb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-black font-heading text-white">
                    Laboratório Grelha Nobre: Monte Seu Smash Artesanal
                  </h3>
                  <p className="text-xs text-stone-400">
                    Escolha cada camada e veja o preço, calorias e gramas de proteína atualizarem em tempo real.
                  </p>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xl font-black text-amber-400 tabular-nums">
                    R$ {customBurgerStats.unitPrice.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-stone-400 tabular-nums">
                    {customBurgerStats.calories} kcal · {customBurgerStats.proteinGrams}g Proteína
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Visual Burger Layer Stack Representation */}
                <div className="lg:col-span-5 bg-[#110704] border border-amber-900/50 rounded-2xl p-5 flex flex-col items-center justify-center space-y-2 min-h-[290px]">
                  <div className="text-[11px] font-mono text-amber-300/80 mb-2">
                    VISUALIZAÇÃO DAS CAMADAS NA CHAPA
                  </div>
                  {/* Top Bun */}
                  <div className={`w-48 h-10 rounded-t-full bg-gradient-to-b ${builderBread.color} border border-amber-300/40 flex items-center justify-center text-[11px] font-bold text-white shadow-md`}>
                    {builderBread.name.split(' ')[0]} (Topo)
                  </div>
                  {/* Sauce Layer */}
                  <div className="w-44 h-3.5 rounded-full bg-amber-300/90 text-[9px] font-mono text-black font-bold flex items-center justify-center">
                    {builderSauce}
                  </div>
                  {/* Extras Layers */}
                  {builderExtras.map((ex, i) => (
                    <div
                      key={i}
                      className="w-44 h-4 rounded-md bg-red-800/90 border border-red-400/40 text-[9px] font-mono text-red-100 flex items-center justify-center"
                    >
                      + {ex.name}
                    </div>
                  ))}
                  {/* Cheese Layer */}
                  <div className="w-48 h-3.5 rounded-sm bg-yellow-400 text-[9px] font-mono text-black font-extrabold flex items-center justify-center shadow">
                    {builderCheese.name}
                  </div>
                  {/* Patties */}
                  {Array.from({ length: builderPattyCount }).map((_, idx) => (
                    <div
                      key={idx}
                      className="w-52 h-6 rounded-xl bg-gradient-to-r from-stone-800 via-amber-950 to-stone-800 border border-amber-700/60 flex items-center justify-center text-[10px] font-mono text-amber-200 font-bold shadow-inner"
                    >
                      Smash 90g Angus #{idx + 1} ({builderDoneness.split(' ')[0]})
                    </div>
                  ))}
                  {/* Bottom Bun */}
                  <div className={`w-48 h-7 rounded-b-2xl bg-gradient-to-t ${builderBread.color} border border-amber-300/40 flex items-center justify-center text-[10px] font-bold text-white`}>
                    Base Selada na Manteiga
                  </div>
                </div>

                {/* Controls Column */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Step 1: Bread & Patties */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-amber-300">1. Escolha o Pão Artesanal:</label>
                      {[
                        { name: 'Brioche Amanteigado Selado', price: 0, color: 'from-amber-500 to-amber-700' },
                        { name: 'Australiano Cacau & Mel (+R$ 3)', price: 3, color: 'from-amber-900 to-stone-900' },
                        { name: 'Pretzel Alemão Sal Marinho (+R$ 4)', price: 4, color: 'from-amber-700 to-amber-950' },
                      ].map((b) => (
                        <button
                          key={b.name}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setBuilderBread(b);
                          }}
                          className={`w-full px-3 py-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                            builderBread.name === b.name
                              ? 'border-amber-400 bg-amber-500/20 text-white font-bold'
                              : 'border-stone-800 bg-black/40 text-stone-300'
                          }`}
                        >
                          {b.name}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-amber-300">2. Quantidade de Carnes (90g cada):</label>
                      {([1, 2, 3] as const).map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setBuilderPattyCount(count);
                          }}
                          className={`w-full px-3 py-2 rounded-xl border text-left text-xs flex items-center justify-between transition-all cursor-pointer ${
                            builderPattyCount === count
                              ? 'border-amber-400 bg-amber-500/20 text-white font-bold'
                              : 'border-stone-800 bg-black/40 text-stone-300'
                          }`}
                        >
                          <span>{count}x Smash Angus ({count * 90}g)</span>
                          <span className="font-mono text-amber-300">
                            R$ {count === 1 ? '22,90' : count === 2 ? '31,90' : '39,90'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 3: Cheese & Combo */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-amber-300">3. Queijo Derretido no Vapor:</label>
                      {[
                        { name: 'Cheddar Inglês Melt Duplo', price: 4 },
                        { name: 'Queijo Prato Fazenda Duplo', price: 3.5 },
                        { name: 'Gorgonzola Dolce Maçaricado', price: 6 },
                      ].map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setBuilderCheese(c);
                          }}
                          className={`w-full px-3 py-1.5 rounded-xl border text-left text-xs flex justify-between cursor-pointer ${
                            builderCheese.name === c.name
                              ? 'border-amber-400 bg-amber-500/20 text-white font-bold'
                              : 'border-stone-800 bg-black/40 text-stone-300'
                          }`}
                        >
                          <span>{c.name}</span>
                          <span className="font-mono text-amber-300">+R$ {c.price.toFixed(2)}</span>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2 flex flex-col justify-between">
                      <div>
                        <label className="text-xs font-bold text-amber-300 block mb-1.5">4. Upgrade Combo Completo:</label>
                        <button
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setBuilderCombo(!builderCombo);
                          }}
                          className={`w-full p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                            builderCombo
                              ? 'border-emerald-500 bg-emerald-500/15 text-white font-bold'
                              : 'border-stone-800 bg-black/40 text-stone-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>+ Batata Rústica + Bebida Lata</span>
                            <span className="font-mono text-emerald-300">+R$ 14,90</span>
                          </div>
                          <div className="text-[10px] text-stone-300 mt-1">
                            Economize R$ 9,00 levando o combo completo
                          </div>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddCustomBuiltBurger}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 text-black font-black text-xs shadow-lg shadow-amber-500/25 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Adicionar Meu Smash Autoral · R$ {customBurgerStats.unitPrice.toFixed(2)}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION B: SOCIAL REVIEWS */}
          {siteSection === 'avaliacoes' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-200">
              {[
                {
                  author: 'Henrique Vasconcelos',
                  neighborhood: 'Jardins · Pedido #0179',
                  quote: 'Antes eu pedia pelo aplicativo e chegava murcho. Pelo site próprio da Grelha Nobre chegou em 21 minutos fumegando e paguei 20% mais barato no PIX!',
                  item: 'Grelha Nobre Smash Duplo + Batata Rústica',
                },
                {
                  author: 'Camila Andrade',
                  neighborhood: 'Pinheiros · Pedido #0174',
                  quote: 'O montador de Smash em camadas é viciante! Escolhi pão pretzel com cheddar inglês e gorgonzola e recebi o aviso no WhatsApp quando entrou na chapa.',
                  item: 'Smash Autoral 2x 90g no Pão Pretzel',
                },
                {
                  author: 'Rafael Mendonça',
                  neighborhood: 'Vila Mariana · Pedido #0168',
                  quote: 'A batata com alecrim e alho confitado continua super crocante na embalagem térmica. Melhor hamburgueria artesanal de longe.',
                  item: 'Trufado Supreme Black + Milkshake Nutella',
                },
              ].map((rev, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#180B06] border border-amber-900/40 space-y-2.5">
                  <div className="text-xs text-amber-400 font-mono">★★★★★ · Compra Verificada</div>
                  <p className="text-xs text-stone-200 leading-relaxed">"{rev.quote}"</p>
                  <div className="pt-2 border-t border-stone-800/80 text-[11px] text-stone-400">
                    <strong className="text-white block">{rev.author}</strong>
                    <span>{rev.neighborhood} · {rev.item}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SECTION C: TRADITIONAL DIGITAL MENU */}
          {siteSection === 'cardapio' && (
            <>
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
                <div className="flex items-center gap-2">
                  {[
                    { id: 'all', label: 'Todo o Cardápio' },
                    { id: 'smash', label: 'Smash na Chapa' },
                    { id: 'artesanal', label: 'Artesanais 180g' },
                    { id: 'acompanhamento', label: 'Batatas & Porções' },
                    { id: 'bebida', label: 'Shakes & Bebidas' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setSelectedCategory(cat.id as typeof selectedCategory);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                          : 'bg-[#1B0C07] text-stone-400 hover:text-white border border-amber-950'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMenu.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => openCustomizer(item)}
                    className={`group rounded-2xl bg-[#180B06] border border-amber-900/30 hover:border-amber-500/60 overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                      item.isAvailable ? 'cursor-pointer hover:-translate-y-0.5' : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <div className="relative h-40 overflow-hidden bg-stone-950">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#180B06] via-transparent to-black/30" />
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-amber-200">
                          <span className="bg-black/75 px-2.5 py-0.5 rounded-md backdrop-blur-sm">
                            {item.badge || 'Artesanal'}
                          </span>
                          <span className="bg-black/75 px-2 py-0.5 rounded-md">{item.calories}</span>
                        </div>
                      </div>

                      <div className="p-4 space-y-1.5">
                        <h4 className="text-base font-bold font-heading text-white group-hover:text-amber-400 transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">{item.tagline}</p>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-amber-950/50">
                      <div>
                        <span className="text-[10px] text-stone-400 block">Valor Direto</span>
                        <span className="text-lg font-black font-heading text-amber-400 tabular-nums">
                          R$ {item.price.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <button
                        type="button"
                        disabled={!item.isAvailable}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 group-hover:bg-amber-500 text-amber-300 group-hover:text-black font-bold text-xs border border-amber-500/30 transition-all cursor-pointer whitespace-nowrap"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{item.isAvailable ? 'Personalizar' : 'Esgotado'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ITEM CUSTOMIZER MODAL */}
          {selectedBurgerForModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-[#180B06] border-2 border-amber-500/50 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="relative h-36 bg-stone-900">
                  <img
                    src={selectedBurgerForModal.image}
                    alt={selectedBurgerForModal.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#180B06] via-[#180B06]/40 to-transparent" />
                  <button
                    type="button"
                    onClick={() => setSelectedBurgerForModal(null)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 text-white hover:bg-black cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-extrabold font-heading text-white">
                      {selectedBurgerForModal.name}
                    </h3>
                    <p className="text-xs text-amber-300 font-mono">
                      Base: R$ {selectedBurgerForModal.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>

                <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                  {selectedBurgerForModal.category !== 'bebida' &&
                    selectedBurgerForModal.category !== 'acompanhamento' && (
                      <>
                        <div className="space-y-1.5">
                          <label className="text-xs font-mono uppercase text-amber-400 font-bold block">
                            1. Ponto da Carne Angus:
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {['Mal Passado', 'Ao Ponto da Casa (Rosado)', 'Bem Passado'].map((pt) => (
                              <button
                                key={pt}
                                type="button"
                                onClick={() => {
                                  sound.playClick();
                                  setCustomDoneness(pt);
                                }}
                                className={`p-2 rounded-xl border text-[11px] font-semibold text-center transition-all cursor-pointer ${
                                  customDoneness === pt
                                    ? 'border-amber-500 bg-amber-500/20 text-white font-bold'
                                    : 'border-stone-800 bg-black/40 text-stone-400'
                                }`}
                              >
                                {pt}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-mono uppercase text-amber-400 font-bold block">
                            2. Turbine seu Burger (Adicionais):
                          </label>
                          <div className="space-y-1.5">
                            {availableExtras.map((extra) => {
                              const isChecked = selectedExtras.some((e) => e.name === extra.name);
                              return (
                                <button
                                  key={extra.name}
                                  type="button"
                                  onClick={() => toggleExtra(extra)}
                                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${
                                    isChecked
                                      ? 'border-amber-500 bg-amber-500/15 text-white'
                                      : 'border-stone-800 bg-black/30 text-stone-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                                        isChecked ? 'bg-amber-500 border-amber-500 text-black' : 'border-stone-600'
                                      }`}
                                    >
                                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                    </div>
                                    <span>{extra.name}</span>
                                  </div>
                                  <span className="font-mono text-amber-400 font-bold">
                                    + R$ {extra.price.toFixed(2).replace('.', ',')}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-stone-400 block">
                      Observações para a Cozinha:
                    </label>
                    <input
                      type="text"
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      placeholder="Ex: Sem cebola, maionese à parte..."
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="p-4 bg-black/60 border-t border-stone-800 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedBurgerForModal(null)}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleAddToCartFromModal}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>Adicionar à Sacola</span>
                    <span className="font-mono bg-black/20 px-2 py-0.5 rounded">
                      R${' '}
                      {(
                        selectedBurgerForModal.price +
                        selectedExtras.reduce((acc, e) => acc + e.price, 0)
                      )
                        .toFixed(2)
                        .replace('.', ',')}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CART & PIX CHECKOUT DRAWER */}
          {isCartOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
              <div className="bg-[#160A05] border-l border-amber-500/40 w-full max-w-md h-full flex flex-col justify-between p-5 overflow-y-auto animate-in slide-in-from-right duration-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-amber-400" />
                      <h3 className="text-base font-extrabold font-heading text-white">
                        Checkout Direto (Sem Taxa)
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCartOpen(false);
                        setOrderSentSuccess(false);
                      }}
                      className="p-1.5 rounded-lg bg-stone-900 text-stone-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {orderSentSuccess ? (
                    <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-center space-y-4 my-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                        <Check className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-extrabold font-heading text-white">
                        Pedido Enviado Direto Para a Chapa! 🔥
                      </h4>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        Seu pedido já entrou na coluna <strong>"Novos na Fila"</strong> do KDS da Cozinha com alerta sonoro para o chapeiro!
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCartOpen(false);
                          setOrderSentSuccess(false);
                          switchMode('system');
                          setSystemModule('kds');
                        }}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg cursor-pointer flex items-center justify-center gap-2"
                      >
                        <ChefHat className="w-4 h-4" />
                        <span>Ver Meu Pedido no KDS da Cozinha Agora</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                        {cart.map((item, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-black/40 border border-stone-800 space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-xs font-bold text-white">{item.burger.name}</div>
                                <div className="text-[10px] text-amber-400 font-mono">{item.selectedDoneness}</div>
                              </div>
                              <div className="flex items-center gap-1.5 bg-stone-950 px-2 py-1 rounded-lg border border-stone-800">
                                <button
                                  type="button"
                                  onClick={() => updateCartQty(idx, -1)}
                                  className="text-stone-400 hover:text-white cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-mono font-bold px-1">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateCartQty(idx, 1)}
                                  className="text-amber-400 hover:text-amber-300 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setOrderDeliveryType('delivery')}
                          className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                            orderDeliveryType === 'delivery'
                              ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                              : 'border-stone-800 bg-black/40 text-stone-400'
                          }`}
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Delivery (~{selectedNeighborhoodZone.mins}m)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderDeliveryType('retirada')}
                          className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                            orderDeliveryType === 'retirada'
                              ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                              : 'border-stone-800 bg-black/40 text-stone-400'
                          }`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Retirada (Grátis)</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        <input
                          type="text"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="Seu Nome"
                          className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-800 text-xs text-white"
                        />
                        {orderDeliveryType === 'delivery' && (
                          <input
                            type="text"
                            value={clientAddress}
                            onChange={(e) => setClientAddress(e.target.value)}
                            placeholder="Endereço de Entrega"
                            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-stone-800 text-xs text-white"
                          />
                        )}
                      </div>

                      {/* Payment Method with PIX QR Preview */}
                      <div className="space-y-2">
                        <label className="text-[11px] font-mono uppercase text-stone-400 block">
                          Forma de Pagamento:
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'pix', label: 'PIX (-5%)' },
                            { id: 'cartao', label: 'Cartão' },
                            { id: 'dinheiro', label: 'Dinheiro' },
                          ].map((pm) => (
                            <button
                              key={pm.id}
                              type="button"
                              onClick={() => setPaymentMethod(pm.id as typeof paymentMethod)}
                              className={`p-2 rounded-xl border text-xs font-bold cursor-pointer ${
                                paymentMethod === pm.id
                                  ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                                  : 'border-stone-800 bg-black/40 text-stone-400'
                              }`}
                            >
                              {pm.label}
                            </button>
                          ))}
                        </div>
                        {paymentMethod === 'pix' && (
                          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3 text-xs">
                            <QrCode className="w-8 h-8 text-emerald-400 shrink-0" />
                            <div className="text-[11px] text-emerald-200 leading-tight">
                              <strong>PIX Copia e Cola Instantâneo</strong>
                              <span className="block text-emerald-400/80">
                                Baixa automática em 2 segundos direto para a impressora da cozinha.
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-3.5 rounded-xl bg-black/50 border border-stone-800 space-y-1.5 text-xs font-mono">
                        <div className="flex justify-between text-stone-400">
                          <span>Subtotal:</span>
                          <span>R$ {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-stone-400">
                          <span>Taxa de Entrega:</span>
                          <span>{deliveryFee === 0 ? 'GRÁTIS' : `R$ ${deliveryFee.toFixed(2)}`}</span>
                        </div>
                        {couponApplied && (
                          <div className="flex justify-between text-emerald-400">
                            <span>Cupom BURGER01 (15%):</span>
                            <span>- R$ {discount.toFixed(2)}</span>
                          </div>
                        )}
                        {paymentMethod === 'pix' && (
                          <div className="flex justify-between text-emerald-400">
                            <span>Desconto PIX (5%):</span>
                            <span>- R$ {pixBonusDiscount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-stone-800">
                          <span>Total Final:</span>
                          <span className="text-amber-400">R$ {finalTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {!orderSentSuccess && cart.length > 0 && (
                  <button
                    type="button"
                    onClick={handleFinishOrder}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl cursor-pointer mt-4"
                  >
                    <Send className="w-4 h-4" />
                    <span>Confirmar e Enviar p/ Cozinha (R$ {finalTotal.toFixed(2)})</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          VIEW 2: MULTI-MODULE RESTAURANT ERP & KDS
          ========================================== */}
      {activeTab === 'system' && (
        <div className="p-4 sm:p-6 space-y-5 bg-[#0D0907]">
          {/* ERP Module Sub-Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'kds', label: '1. KDS Cozinha & Chapa (Kanban)' },
                { id: 'motoboys', label: '2. Expedição & Motoboys' },
                { id: 'estoque', label: '3. Ficha Técnica & Cardápio (CMV)' },
                { id: 'dre', label: '4. Calculadora Economia vs. iFood' },
              ].map((mod) => (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSystemModule(mod.id as typeof systemModule);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    systemModule === mod.id
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                  }`}
                >
                  {mod.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-emerald-400 font-bold tabular-nums">
                Caixa Hoje: R$ {totalRevenueToday.toFixed(2)}
              </span>
            </div>
          </div>

          {/* MODULE 1: KDS KANBAN + THERMAL RECEIPT */}
          {systemModule === 'kds' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {[
                  { key: 'novos', title: '1. Novos na Fila', badgeColor: 'text-amber-300 border-amber-500/30', btnText: 'Mandar p/ Chapa (300°C)' },
                  { key: 'grelha', title: '2. Na Chapa (300°C)', badgeColor: 'text-red-300 border-red-500/30', btnText: 'Embalar & Lacrar Pedido' },
                  { key: 'embalagem', title: '3. Embalagem & Lacre', badgeColor: 'text-purple-300 border-purple-500/30', btnText: 'Despachar c/ Motoboy' },
                  { key: 'entregue', title: '4. Saiu / Entregues', badgeColor: 'text-emerald-300 border-emerald-500/30', btnText: null },
                ].map((col) => {
                  const colOrders = kdsOrders.filter((o) => o.status === col.key);
                  return (
                    <div key={col.key} className="rounded-2xl bg-[#140E0B] border border-stone-800 p-3 flex flex-col justify-between min-h-[320px]">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                          <span className="text-xs font-extrabold font-heading text-white">{col.title}</span>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${col.badgeColor}`}>
                            {colOrders.length}
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {colOrders.map((order) => (
                            <div key={order.id} className="p-3 rounded-xl bg-black/50 border border-stone-800 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-mono font-black text-amber-400">{order.orderNumber}</span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => setReceiptModalOrder(order)}
                                    title="Imprimir Cupom Térmico 80mm"
                                    className="px-1.5 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-[10px] font-mono text-stone-300 cursor-pointer flex items-center gap-1"
                                  >
                                    <Printer className="w-3 h-3" />
                                    <span>Cupom</span>
                                  </button>
                                  <span className="text-[10px] font-mono text-stone-400">{order.timeAgo}</span>
                                </div>
                              </div>

                              <div>
                                <div className="text-xs font-bold text-white">{order.customerName}</div>
                                <div className="text-[10px] text-stone-400">{order.deliveryType}</div>
                              </div>

                              <div className="p-2 rounded-lg bg-stone-950 border border-stone-800/80 space-y-1">
                                {order.items.map((it, idx) => (
                                  <div key={idx} className="text-[11px] text-stone-200 leading-snug">
                                    • {it}
                                  </div>
                                ))}
                              </div>

                              <div className="flex items-center justify-between pt-1">
                                <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                                  R$ {order.total.toFixed(2)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => sendWhatsAppNotification(order)}
                                  className="px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold cursor-pointer"
                                >
                                  Avisar WhatsApp
                                </button>
                              </div>

                              {col.btnText && (
                                <button
                                  type="button"
                                  onClick={() => advanceOrderStatus(order.id)}
                                  className="w-full py-1.5 px-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[11px] transition-all cursor-pointer"
                                >
                                  {col.btnText}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Thermal Receipt Modal Preview */}
              {receiptModalOrder && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                  <div className="bg-[#FFFDF7] text-stone-900 font-mono p-5 rounded-xl max-w-xs w-full shadow-2xl border-t-8 border-amber-500 space-y-3">
                    <div className="text-center border-b border-dashed border-stone-400 pb-2">
                      <div className="font-black text-sm">GRELHA NOBRE SMASH HOUSE</div>
                      <div className="text-[10px] text-stone-600">CUPOM DE PRODUÇÃO COZINHA · 80MM</div>
                      <div className="text-base font-black mt-1">SENHA {receiptModalOrder.orderNumber}</div>
                    </div>
                    <div className="text-[11px] space-y-1">
                      <div>CLIENTE: {receiptModalOrder.customerName}</div>
                      <div>TIPO: {receiptModalOrder.deliveryType}</div>
                      <div>END: {receiptModalOrder.address}</div>
                    </div>
                    <div className="border-y border-dashed border-stone-400 py-2 space-y-1 text-xs font-bold">
                      {receiptModalOrder.items.map((it, i) => (
                        <div key={i}>{it}</div>
                      ))}
                    </div>
                    <div className="flex justify-between font-black text-sm">
                      <span>TOTAL PAGO (PIX):</span>
                      <span>R$ {receiptModalOrder.total.toFixed(2)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReceiptModalOrder(null)}
                      className="w-full py-2 rounded-lg bg-stone-900 text-white text-xs font-bold cursor-pointer"
                    >
                      Fechar Impressão Térmica
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODULE 2: COURIER DISPATCH & TRACKING */}
          {systemModule === 'motoboys' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Lucas Motoboy', plate: 'Honda CG 160 · FXY-9A12', status: 'Em Rota (2 entregas)', bagTemp: '68°C Lacre OK', feeEarned: 'R$ 84,00 hoje' },
                { name: 'Marcos Silva', plate: 'Yamaha Fazer · BTR-4C88', status: 'Disponível na Base', bagTemp: 'Pronto p/ Saída', feeEarned: 'R$ 62,00 hoje' },
                { name: 'Tiago Express', plate: 'Honda PCX · KLP-2D09', status: 'Retornando p/ Loja (4 min)', bagTemp: '65°C Lacre OK', feeEarned: 'R$ 95,00 hoje' },
              ].map((courier, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#140E0B] border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{courier.name}</span>
                    <span className="text-[11px] font-mono text-amber-400">{courier.plate}</span>
                  </div>
                  <div className="text-xs text-stone-300 space-y-1 font-mono">
                    <div>Status: <strong className="text-emerald-400">{courier.status}</strong></div>
                    <div>Bag Térmica: {courier.bagTemp}</div>
                    <div>Taxas Acumuladas: {courier.feeEarned}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playSuccess();
                      setNotificationToast(`Roteiro Google Maps enviado para o celular de ${courier.name}!`);
                      setTimeout(() => setNotificationToast(null), 4000);
                    }}
                    className="w-full py-2 rounded-xl bg-stone-800 hover:bg-amber-500 hover:text-black text-stone-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Despachar Próxima Rota via WhatsApp
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* MODULE 3: MENU ENGINEERING & CMV */}
          {systemModule === 'estoque' && (
            <div className="rounded-2xl bg-[#140E0B] border border-stone-800 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-stone-800 text-stone-400 font-mono">
                    <th className="p-3">Item do Cardápio</th>
                    <th className="p-3 text-right">Custo Ficha (CMV)</th>
                    <th className="p-3 text-right">Preço Site</th>
                    <th className="p-3 text-right">Margem Bruta</th>
                    <th className="p-3 text-right">Disponibilidade Ao Vivo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/70">
                  {menuItems.map((item) => {
                    const margin = Math.round(((item.price - item.cmvCost) / item.price) * 100);
                    return (
                      <tr key={item.id} className="hover:bg-white/5">
                        <td className="p-3 font-bold text-white">{item.name}</td>
                        <td className="p-3 text-right font-mono text-stone-300 tabular-nums">R$ {item.cmvCost.toFixed(2)}</td>
                        <td className="p-3 text-right font-mono text-amber-400 font-bold tabular-nums">R$ {item.price.toFixed(2)}</td>
                        <td className="p-3 text-right font-mono text-emerald-400 font-bold tabular-nums">{margin}% Lucro</td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => toggleMenuItemAvailability(item.id)}
                            className={`px-3 py-1 rounded-lg font-mono text-[11px] font-bold cursor-pointer ${
                              item.isAvailable
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            }`}
                          >
                            {item.isAvailable ? 'Ativo no Site' : 'Pausado (Esgotado)'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* MODULE 4: IFOOD VS OWN CHANNEL SAVINGS CALCULATOR */}
          {systemModule === 'dre' && (
            <div className="p-5 rounded-2xl bg-[#140E0B] border border-amber-500/30 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-6 space-y-4">
                <h4 className="text-base font-black font-heading text-white">
                  Simulador de Economia: Cardápio Próprio 01Web vs. App de Entrega (27% Taxa)
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-stone-400">Pedidos por Mês:</span>
                      <span className="font-mono font-bold text-amber-400 tabular-nums">{dreMonthlyOrders} pedidos/mês</span>
                    </div>
                    <input
                      type="range"
                      min={200}
                      max={3000}
                      step={100}
                      value={dreMonthlyOrders}
                      onChange={(e) => setDreMonthlyOrders(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-stone-400">Ticket Médio por Pedido:</span>
                      <span className="font-mono font-bold text-amber-400 tabular-nums">R$ {dreAvgTicket},00</span>
                    </div>
                    <input
                      type="range"
                      min={35}
                      max={120}
                      step={5}
                      value={dreAvgTicket}
                      onChange={(e) => setDreAvgTicket(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30">
                  <div className="text-[11px] text-rose-300">Comissão Paga ao App (27%/mês)</div>
                  <div className="text-xl font-black text-rose-400 tabular-nums mt-1">
                    - R$ {dreSavings.ifoodCommissionCost.toLocaleString('pt-BR')}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
                  <div className="text-[11px] text-emerald-300">Lucro Extra no Bolso em 12 Meses</div>
                  <div className="text-xl font-black text-emerald-400 tabular-nums mt-1">
                    + R$ {dreSavings.annualSavings.toLocaleString('pt-BR')}/ano
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

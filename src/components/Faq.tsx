import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';
import { Scroll3DStage } from '../utils/scrollytelling';

interface FaqItem {
  question: string;
  answer: string;
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'Por que ter um site rápido faz diferença para quem anuncia no Instagram ou Google?',
      answer:
        'Quando alguém clica no seu anúncio pelo celular, uma página pesada demora para abrir e faz muitos visitantes desistirem no meio do caminho. Nossos projetos são construídos em código leve para abrir rapidamente no 4G, apresentando seu trabalho com clareza e levando o cliente direto para o seu WhatsApp.',
    },
    {
      question: 'A 01 Web desenvolve apenas sites ou também cria sistemas e automações?',
      answer:
        'Desenvolvemos a estrutura completa conforme a sua necessidade: desde Landing Pages e Sites Institucionais até Sistemas Web sob medida (painéis para controle de agendamentos, clientes, estoque ou pedidos) e fluxos de triagem automática no WhatsApp.',
    },
    {
      question: 'Como funciona o bônus de 1 Ano de Hospedagem + Domínio Inclusos?',
      answer:
        'Ao fechar seu projeto conosco, nós já configuramos e incluímos o registro do seu domínio próprio (.com.br ou .com) e 12 meses de hospedagem rápida com certificado de segurança SSL. Assim você recebe tudo funcionando sem custos extras de servidor no primeiro ano.',
    },
    {
      question: 'Qual é o prazo de entrega para colocar meu projeto no ar?',
      answer:
        'Landing Pages profissionais ficam prontas e publicadas entre 3 a 5 dias úteis. Projetos maiores com múltiplas páginas, painel administrativo ou automações personalizadas são entregues entre 7 a 10 dias úteis.',
    },
    {
      question: 'O site e o sistema têm alguma mensalidade obrigatória?',
      answer:
        'Não cobramos mensalidade de aluguel pelo seu site ou sistema. Você faz o investimento único de desenvolvimento e toda a estrutura fica pronta para a sua empresa usar livremente.',
    },
  ];

  const toggleFaq = (index: number) => {
    sound.playSelect();
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 sm:py-28 relative overflow-x-clip bg-[#06080F] border-t border-white/[0.06]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Scroll3DStage intensity="medium">
          <div className="space-y-3 mb-12">
            <div className="text-xs font-mono uppercase tracking-[0.16em] text-cyan-400 font-semibold">
              06 / DÚVIDAS FREQUENTES
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              Respostas Diretas Antes de Iniciar Seu Projeto.
            </h2>
          </div>
        </Scroll3DStage>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <Scroll3DStage key={idx} intensity="subtle">
                <div className="rounded-xl border border-white/10 hover:border-cyan-400/35 bg-[#0B0F1A] overflow-hidden transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-white font-heading">
                      {faq.question}
                    </span>
                    <div
                      className={`p-1.5 rounded-lg bg-slate-900 text-cyan-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-cyan-300' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.06] pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Scroll3DStage>
            );
          })}
        </div>

        <Scroll3DStage intensity="medium">
          <div className="mt-10 p-6 rounded-xl bg-[#0B0F1A] border border-white/10 hover:border-cyan-400/40 transition-colors flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-slate-300 text-center sm:text-left">
              Quer tirar alguma dúvida específica sobre o projeto da sua empresa?
            </div>
            <a
              href="https://wa.me/5566999697087?text=Ol%C3%A1%2001%20WEB!%20Tenho%20uma%20d%C3%BAvida%20sobre%20um%20projeto%20para%20minha%20empresa."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-colors shrink-0 cursor-pointer"
            >
              <span>Chamar no WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </Scroll3DStage>
      </div>
    </section>
  );
}

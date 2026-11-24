import { useState, useEffect } from 'react';
import CyberCanvas from './components/CyberCanvas';
import Header from './components/Header';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import LossCalculator from './components/LossCalculator';
import EcosystemSection from './components/EcosystemSection';
import InteractiveTechShowcase from './components/InteractiveTechShowcase';
import ConversionPowerhouse from './components/ConversionPowerhouse';
import BastidoresShowreel from './components/BastidoresShowreel';
import BeforeAfterSlider from './components/BeforeAfterSlider';
import ClientReviewsGallery from './components/ClientReviewsGallery';
import BonusSection from './components/BonusSection';
import BudgetCalculator from './components/BudgetCalculator';
import Faq from './components/Faq';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import LeadFunnelModal from './components/LeadFunnelModal';
import ExitIntentRecoveryModal from './components/ExitIntentRecoveryModal';
import AdminPanel from './components/AdminPanel';
import { GuaranteeRiskReversalSection } from './components/SalesConversionTriggers';
import { BottleneckType } from './utils/calculator';
import { ScrollytellingChapterRail } from './utils/scrollytelling';
import { liveRadarService } from './services/liveRadarService';

export default function App() {
  const [selectedQuoteProject, setSelectedQuoteProject] = useState<string | undefined>();
  const [selectedDiagnosticPreset, setSelectedDiagnosticPreset] = useState<BottleneckType | undefined>();

  // Funnel & Dedicated Admin System state
  const [isFunnelOpen, setIsFunnelOpen] = useState<boolean>(false);
  const [funnelSegment, setFunnelSegment] = useState<string | undefined>();
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  useEffect(() => {
    if (
      window.location.search.includes('admin=true') ||
      window.location.hash === '#admin'
    ) {
      setIsAdminOpen(true);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const stopTelemetry = liveRadarService.startPageTelemetry();
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stopTelemetry();
    };
  }, []);

  // WHEN ADMIN IS OPEN, RENDER PURE STANDALONE CEO OPERATING SYSTEM (NO LANDING PAGE BEHIND IT)
  if (isAdminOpen) {
    return (
      <AdminPanel
        isOpen={true}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.hash === '#admin') {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }}
      />
    );
  }

  const handleOpenContact = () => {
    const el = document.getElementById('orcamento');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenFunnel = (segment?: string) => {
    setFunnelSegment(segment);
    setIsFunnelOpen(true);
  };

  const handleSelectProjectForQuote = (projectName: string) => {
    setSelectedQuoteProject(projectName);
  };

  const handleSelectDiagnosisForQuote = (bottleneck: BottleneckType, title: string) => {
    setSelectedDiagnosticPreset(bottleneck);
    setSelectedQuoteProject(title);
  };

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 relative selection:bg-cyan-400 selection:text-slate-950">
      <CyberCanvas />
      <ScrollytellingChapterRail />

      <Header
        onOpenContact={handleOpenContact}
        onOpenFunnel={() => handleOpenFunnel()}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main className="relative z-10">
        <Hero onOpenFunnel={() => handleOpenFunnel()} />
        <BastidoresShowreel onOpenFunnel={() => handleOpenFunnel()} />
        <Portfolio onSelectProjectForQuote={handleSelectProjectForQuote} />
        <InteractiveTechShowcase onOpenFunnel={() => handleOpenFunnel()} />
        <ConversionPowerhouse onOpenFunnel={handleOpenFunnel} />
        <EcosystemSection onSelectDiagnosisForQuote={handleSelectDiagnosisForQuote} />
        <BeforeAfterSlider />
        <LossCalculator />
        <ClientReviewsGallery />
        <BonusSection />
        <BudgetCalculator
          initialProjectName={selectedQuoteProject}
          selectedDiagnosticPreset={selectedDiagnosticPreset}
        />
        <GuaranteeRiskReversalSection onOpenFunnel={() => handleOpenFunnel()} />
        <Faq />
      </main>

      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFunnel={() => handleOpenFunnel()}
      />

      <FloatingWhatsApp onOpenFunnel={() => handleOpenFunnel()} />
      <ExitIntentRecoveryModal />

      <LeadFunnelModal
        isOpen={isFunnelOpen}
        onClose={() => setIsFunnelOpen(false)}
        initialSegment={funnelSegment}
      />
    </div>
  );
}

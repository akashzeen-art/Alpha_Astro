import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ReadingsProvider } from "@/contexts/ReadingsContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useEffect } from "react";
import LoadingOverlay from "./components/LoadingOverlay";
import CosmicBackground from "./components/CosmicBackground";

import Index from "./pages/Index";
import PalmAnalysis from "./pages/PalmAnalysis";
import Numerology from "./pages/Numerology";
import AstrologyReading from "./pages/AstrologyReading";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import VideoBackgroundDemo from "./pages/VideoBackgroundDemo";
import KidsBoxPortal from "./pages/KidsBoxPortal";
import VideoTest from "./pages/VideoTest";
import Checkout from "./pages/Checkout";
import LiveConsultation from "./pages/LiveConsultation";
import Consultation from "./pages/Consultation";
import AdminPanel from "./pages/AdminPanel";
import TermsAndConditions from "./pages/TermsAndConditions";
import RefundPolicy from "./pages/RefundPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import MyAccount from "./pages/MyAccount";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const queryClient = new QueryClient();

const App = () => (
  <>
    <CosmicBackground />
    <LoadingOverlay />
    <div className="relative z-[1]">
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <ReadingsProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ScrollToTop />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/palm-analysis" element={<PalmAnalysis />} />
                    <Route path="/numerology" element={<Numerology />} />
                    <Route path="/astrology" element={<AstrologyReading />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/live-consultation" element={<LiveConsultation />} />
                    <Route path="/consultation" element={<Consultation />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/my-account" element={<MyAccount />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/terms" element={<TermsAndConditions />} />
                    <Route path="/refund-policy" element={<RefundPolicy />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/video-demo" element={<VideoBackgroundDemo />} />
                    <Route path="/kids-portal" element={<KidsBoxPortal />} />
                    <Route path="/video-test" element={<VideoTest />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </ReadingsProvider>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
    </div>
  </>
);

export default App;

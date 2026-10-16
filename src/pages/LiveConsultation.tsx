import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import LiveConsultationSection from "@/components/consultation/LiveConsultationSection";
import ConsultationModal from "@/components/consultation/ConsultationModal";
import { Phone, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const LiveConsultation = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <Layout noMobileFabPad>
      <div className="grahveda-page pb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 grahveda-link mb-8 text-sm group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </Link>

        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="section-ornament mb-4" aria-hidden>
            <Phone className="h-4 w-4 text-amber-400/60" />
          </div>
          <p className="text-teal-400/80 text-xs font-medium tracking-[0.25em] uppercase mb-3">Guru Darshan</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-amber-50 mb-4 leading-tight">
            Talk With <span className="grahveda-text">Pandit Ji</span>
          </h1>
          <div className="grahveda-divider max-w-xs mx-auto mb-4" />
          <p className="text-sm md:text-base text-orange-100/55 leading-relaxed">
            Book a private live consultation for astrology, numerology, palmistry, muhurat, and remedies — guided by ancient Vedic wisdom.
          </p>
        </div>

        <LiveConsultationSection variant="full" onTalkClick={() => setShowModal(true)} />

        <ConsultationModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onProceed={() => {
            setShowModal(false);
            navigate("/consultation");
          }}
        />
      </div>
    </Layout>
  );
};

export default LiveConsultation;

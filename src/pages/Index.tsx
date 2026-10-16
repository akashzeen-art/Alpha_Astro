import { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import SectionHeader from "@/components/SectionHeader";
import LiveConsultationSection from "@/components/consultation/LiveConsultationSection";
import ConsultationModal from "@/components/consultation/ConsultationModal";
import { Star, Calculator, Hand, ArrowRight, Orbit } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { whenPreloaderReady, refreshScrollTriggers } from "@/lib/scrollAnimations";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    path: "/numerology",
    icon: Calculator,
    title: "Numbers",
    subtitle: "Anka Shastra",
    desc: "Life path, destiny, and soul urge — mapped from name and birth date.",
    num: "01",
  },
  {
    path: "/astrology",
    icon: Star,
    title: "Kundli",
    subtitle: "Jyotish",
    desc: "Vedic birth chart with planetary positions, dashas, and clear predictions.",
    num: "02",
  },
  {
    path: "/palm-analysis",
    icon: Hand,
    title: "Palm",
    subtitle: "Hasta Rekha",
    desc: "Line and mount analysis from a single clear palm photograph.",
    num: "03",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: gsap.Context | undefined;

    const setup = () => {
      ctx = gsap.context(() => {
        gsap.fromTo(
          ".service-row",
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: servicesRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });
      refreshScrollTriggers();
    };

    const remove = whenPreloaderReady(setup);
    return () => {
      remove();
      ctx?.revert();
    };
  }, []);

  return (
    <Layout>
      <Hero />

      <section ref={servicesRef} className="relative container mx-auto px-4 py-16 md:py-24">
        <SectionHeader
          eyebrow="Three instruments"
          badgeIcon={Orbit}
          title={
            <>
              One observatory. <span className="alpha-text">Three readings.</span>
            </>
          }
          subtitle="Each path stands alone. Together they form a clearer map of your timing, temperament, and trajectory."
        />

        <div className="mx-auto max-w-3xl space-y-3">
          {SERVICES.map((s) => (
            <Link
              key={s.path}
              to={s.path}
              className={cn(
                "service-row group flex items-start gap-5 border border-white/[0.08] bg-[hsl(215_28%_8%/0.4)] px-5 py-5 transition-colors hover:border-teal-400/30 hover:bg-[hsl(215_28%_10%/0.55)] md:px-7 md:py-6"
              )}
            >
              <span className="font-display text-sm text-teal-400/50">{s.num}</span>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-teal-400/25 bg-teal-400/5 text-teal-300">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="mb-0.5 text-[10px] uppercase tracking-[0.2em] text-sky-300/50">
                  {s.subtitle}
                </p>
                <h3 className="font-display text-xl font-semibold text-slate-100 md:text-2xl">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400/80">{s.desc}</p>
              </div>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-teal-300" />
            </Link>
          ))}
        </div>

        <div className="alpha-divider mx-auto mt-14 max-w-md" />
      </section>

      <LiveConsultationSection variant="banner" onTalkClick={() => setShowModal(true)} />

      <Features />

      <ConsultationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onProceed={() => {
          setShowModal(false);
          navigate("/consultation");
        }}
      />
    </Layout>
  );
};

export default Index;

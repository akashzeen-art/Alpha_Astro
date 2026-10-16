import { Link } from "react-router-dom";
import { Shield, Zap, Eye, Clock } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { BRAND } from "@/lib/brand";

const ITEMS = [
  {
    icon: Eye,
    title: "Readable charts",
    desc: "No cluttered dashboards — each reading surfaces what matters first.",
  },
  {
    icon: Zap,
    title: "Fast calibration",
    desc: "AI-assisted interpretation grounded in classical Vedic and numeric systems.",
  },
  {
    icon: Shield,
    title: "Private by default",
    desc: "Your birth data and palm images stay on secured infrastructure.",
  },
  {
    icon: Clock,
    title: "Expert when needed",
    desc: "Escalate from digital reading to a live consultation in one step.",
  },
];

const Features = () => (
  <section className="relative container mx-auto px-4 py-16 md:py-24">
    <SectionHeader
      eyebrow="Why Alpha"
      title={
        <>
          Built for <span className="alpha-text">signal, not spectacle</span>
        </>
      }
      subtitle="A quieter interface for people who want accurate timing and temperament — without carnival graphics."
    />

    <div className="mx-auto grid max-w-5xl gap-px overflow-hidden border border-white/10 bg-transparent sm:grid-cols-2">
      {ITEMS.map(({ icon: Icon, title, desc }) => (
        <div
          key={title}
          className="border border-white/[0.06] bg-transparent p-6 backdrop-blur-[2px] transition-colors hover:bg-white/[0.03] md:p-8"
        >
          <Icon className="mb-4 h-5 w-5 text-teal-300/80" />
          <h3 className="font-display mb-2 text-lg font-semibold text-slate-100">{title}</h3>
          <p className="text-sm leading-relaxed text-slate-300/80">{desc}</p>
        </div>
      ))}
    </div>

    <div className="mt-10 text-center">
      <Link
        to="/about"
        className="text-sm text-teal-300/80 underline-offset-4 hover:text-teal-200 hover:underline"
      >
        About {BRAND.NAME}
      </Link>
    </div>
  </section>
);

export default Features;

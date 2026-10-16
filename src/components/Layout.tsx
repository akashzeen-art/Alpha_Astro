import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { BRAND } from "@/lib/brand";

const Footer = ({ noMobileFabPad = false }: { noMobileFabPad?: boolean }) => (
  <footer
    className={`relative z-[1] border-t border-white/[0.06] bg-[hsl(215_30%_4%/0.85)] py-12 backdrop-blur-md ${
      noMobileFabPad ? "" : ""
    }`}
  >
    <div className="container mx-auto px-4">
      <div className="grid gap-10 text-center md:grid-cols-3 md:text-left">
        <div className="flex flex-col items-center md:items-start">
          <img
            src={BRAND.LOGO}
            alt={BRAND.NAME}
            className="mb-3 h-12 w-12 rounded-xl border border-teal-400/25 object-contain"
          />
          <p className="font-display mb-2 text-2xl font-semibold alpha-text">{BRAND.NAME}</p>
          <p className="max-w-xs text-sm text-slate-400/70">{BRAND.TAGLINE}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm md:justify-center">
          {[
            ["/numerology", "Numbers"],
            ["/astrology", "Kundli"],
            ["/palm-analysis", "Palm"],
            ["/terms", "Terms"],
            ["/refund-policy", "Refund"],
            ["/privacy-policy", "Privacy"],
            ["/contact", "Contact"],
          ].map(([to, label]) => (
            <Link
              key={to}
              to={to}
              className="text-slate-400/60 transition-colors hover:text-teal-300"
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="text-sm text-slate-500 md:text-right">
          <p>{BRAND.COMPANY}</p>
          <p className="mt-1 text-xs">© 2026 · {BRAND.PRIMARY_DOMAIN}</p>
        </div>
      </div>
    </div>
  </footer>
);

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  fullBleed?: boolean;
  noMobileFabPad?: boolean;
}

const Layout = ({ children, className = "", fullBleed = false, noMobileFabPad = false }: LayoutProps) => (
  <div className={`relative flex min-h-screen flex-col ${className}`}>
    <Navbar />
    <main
      className={`relative z-[1] flex-1 pt-16 ${
        fullBleed || noMobileFabPad ? "" : ""
      }`}
    >
      {children}
    </main>
    <Footer noMobileFabPad={noMobileFabPad} />
  </div>
);

export { Footer };
export default Layout;

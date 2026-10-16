import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { BRAND } from "@/lib/brand";

interface LegalPageProps {
  title: string;
  subtitle?: string;
  updated?: string;
  children: React.ReactNode;
}

export const LegalPage = ({ title, subtitle, updated, children }: LegalPageProps) => (
  <Layout>
    <div className="alpha-page mx-auto max-w-3xl">
      <Link to="/" className="alpha-link mb-6 inline-flex items-center gap-2 text-sm">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <div className="mb-6 border border-white/10 bg-[hsl(215_28%_8%/0.55)] p-6 backdrop-blur-md md:p-8">
        <h1 className="font-display mb-2 text-3xl font-semibold text-slate-50">{title}</h1>
        {subtitle && <p className="font-medium text-teal-300/80">{subtitle}</p>}
        {updated && <p className="mt-2 text-sm text-slate-500">Last Updated: {updated}</p>}
      </div>

      <div className="space-y-4 text-sm leading-relaxed text-slate-300/75">{children}</div>

      <p className="mt-10 text-center text-xs text-slate-500">© 2026 {BRAND.COMPANY}</p>
    </div>
  </Layout>
);

export const LegalIntro = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-3 border border-white/10 bg-[hsl(215_28%_8%/0.45)] p-5 md:p-6">
    {children}
  </div>
);

export const LegalSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="border border-white/10 bg-[hsl(215_28%_8%/0.45)] p-5 md:p-6">
    <h2 className="font-display mb-3 text-lg font-semibold text-slate-100">{title}</h2>
    {children}
  </section>
);

export const LegalList = ({ items }: { items: string[] }) => (
  <ul className="space-y-2">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-2">
        <span className="mt-0.5 shrink-0 text-teal-400">›</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export default LegalPage;

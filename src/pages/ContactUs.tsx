import { Link } from "react-router-dom";
import { ArrowLeft, Building2, MapPin, Phone, Mail } from "lucide-react";
import Layout from "@/components/Layout";
import { LegalSection } from "@/components/LegalPage";
import { BRAND } from "@/lib/brand";

const ContactUs = () => (
  <Layout>
    <div className="alpha-page mx-auto max-w-3xl">
      <Link to="/" className="alpha-link mb-6 inline-flex items-center gap-2 text-sm">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>

      <div className="mb-6 border border-white/10 bg-[hsl(215_28%_8%/0.55)] p-6 backdrop-blur-md md:p-8">
        <h1 className="font-display mb-2 text-3xl font-semibold text-slate-50">Contact Us</h1>
        <p className="text-sm text-slate-400">
          Reach {BRAND.NAME} / {BRAND.COMPANY} anytime.
        </p>
      </div>

      <LegalSection title="Get In Touch">
        <div className="space-y-5">
          {[
            { icon: Building2, label: "Company", value: BRAND.COMPANY },
            { icon: MapPin, label: "Address", value: BRAND.CONTACT.ADDRESS },
            {
              icon: Phone,
              label: "Phone",
              value: BRAND.CONTACT.PHONE_DISPLAY,
              href: `tel:+91${BRAND.CONTACT.PHONE}`,
            },
            {
              icon: Mail,
              label: "Email",
              value: BRAND.CONTACT.EMAIL,
              href: `mailto:${BRAND.CONTACT.EMAIL}`,
            },
          ].map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-teal-400/25 bg-teal-400/5">
                <Icon className="h-4 w-4 text-teal-300" />
              </div>
              <div>
                <p className="mb-0.5 text-xs uppercase tracking-widest text-slate-500">{label}</p>
                {href ? (
                  <a href={href} className="text-sm font-medium text-slate-100 hover:text-teal-300">
                    {value}
                  </a>
                ) : (
                  <p className="text-sm text-slate-100">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </LegalSection>
    </div>
  </Layout>
);

export default ContactUs;

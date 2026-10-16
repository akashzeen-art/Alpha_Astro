import { LegalPage, LegalIntro, LegalSection, LegalList } from "@/components/LegalPage";
import { BRAND } from "@/lib/brand";

const PrivacyPolicy = () => (
  <LegalPage title="Privacy Policy" subtitle={BRAND.COMPANY} updated="01-01-2026">
    <LegalIntro>
      <p>
        This Privacy Policy describes how {BRAND.COMPANY} (&quot;we&quot;, &quot;us&quot;, or
        &quot;our&quot;) collects, uses, discloses, and protects your personal information when you
        visit our website, make a purchase, or use any of our astrology consultation services,
        reports, subscriptions, or related digital services.
      </p>
      <p>
        By using our services, you agree to the collection and use of information as outlined in
        this Privacy Policy. If you do not agree, please do not use the services.
      </p>
    </LegalIntro>

    <LegalSection title="1. Information We Collect">
      <p className="mb-2 font-medium text-slate-100">a) Information You Provide Directly</p>
      <LegalList
        items={[
          "Contact details: name, phone number, email address, postal address",
          "Birth details or astrology-related details voluntarily provided for consultation, kundli, numerology, horoscope, or report services",
          "Order details: service purchase history, billing information, and payment status",
          "Account information: login credentials and preferences",
          "Customer support queries, feedback, and communication history",
        ]}
      />
      <p className="mb-2 mt-4 font-medium text-slate-100">b) Automatically Collected Information</p>
      <LegalList
        items={[
          "IP address",
          "Browser type and version",
          "Device type and operating system",
          "Pages visited, time spent, and referring URLs",
        ]}
      />
      <p className="mt-2">
        This data may be gathered using cookies and other tracking tools to improve browsing
        experience, platform security, and service quality.
      </p>
      <p className="mb-2 mt-4 font-medium text-slate-100">c) Third-Party Sources</p>
      <LegalList
        items={[
          "Payment gateways to process transactions",
          "Analytics providers to analyse traffic and usage patterns",
          "Advertising or marketing platforms to optimise campaign performance",
        ]}
      />
    </LegalSection>

    <LegalSection title="2. How We Use Your Information">
      <LegalList
        items={[
          "Process and fulfil service orders, consultations, reports, or subscriptions",
          "Communicate with users about orders, updates, or support issues",
          "Improve website functionality and user experience",
          "Respond to inquiries and provide customer support",
          "Send promotional emails, newsletters, and offers, with opt-out options",
          "Monitor and prevent fraudulent transactions and abuse of services",
        ]}
      />
    </LegalSection>

    <LegalSection title="3. How We Share Your Information">
      <p className="mb-2">Your personal information may be shared only in limited circumstances:</p>
      <LegalList
        items={[
          "With service providers such as payment processors, hosting providers, and email platforms",
          "With authorised partners only where required to deliver the requested service or with user consent",
          "With legal authorities where required by law or to protect our rights",
          "With affiliates or during business restructuring, such as mergers or acquisitions",
        ]}
      />
      <p className="mt-3">
        We do not sell personal information. We do not share sensitive personal information for
        targeted advertising purposes.
      </p>
    </LegalSection>

    <LegalSection title="4. Cookies and Tracking Technologies">
      <p>
        Cookies help us provide, protect, and improve our services. They enable features such as
        remembering user preferences and measuring user activity. Users can manage or disable cookies
        through browser settings, but disabling cookies may affect certain website features.
      </p>
    </LegalSection>

    <LegalSection title="5. User-Generated Content">
      <p>
        If users post reviews, comments, testimonials, or other content on public areas of the
        platform, such content may become publicly accessible. We are not responsible for how others
        use publicly shared information.
      </p>
    </LegalSection>

    <LegalSection title="6. External Links">
      <p>
        Our website may include links to third-party websites. We are not responsible for the privacy
        or security practices of external platforms. Users should review third-party privacy policies
        separately.
      </p>
    </LegalSection>

    <LegalSection title="7. Children's Privacy">
      <p>
        Our services are not intended for users under the age of 16. We do not knowingly collect
        personal data from children. If you believe a child has submitted personal information
        through our platform, please contact us at{" "}
        <a href={`mailto:${BRAND.CONTACT.EMAIL}`} className="text-teal-300 hover:text-teal-200">
          {BRAND.CONTACT.EMAIL}
        </a>
        {" | Phone: "}
        <a href={`tel:+91${BRAND.CONTACT.PHONE}`} className="text-teal-300 hover:text-teal-200">
          {BRAND.CONTACT.PHONE}
        </a>{" "}
        and we will take prompt steps to delete such information from our records.
      </p>
    </LegalSection>

    <LegalSection title="8. Security and Retention">
      <p>
        We take reasonable precautions to protect personal information. However, no online
        transmission or storage system is completely secure. We retain information only as long as
        necessary for business purposes or legal requirements.
      </p>
    </LegalSection>

    <LegalSection title="9. Your Rights">
      <LegalList
        items={[
          "Access and update personal information",
          "Delete personal data where legally permissible",
          "Opt out of marketing communications",
          "Restrict or object to certain processing",
          "Request data portability",
        ]}
      />
      <p className="mt-3">
        To make any such request, please contact us at{" "}
        <a href={`mailto:${BRAND.CONTACT.EMAIL}`} className="text-teal-300 hover:text-teal-200">
          {BRAND.CONTACT.EMAIL}
        </a>
        {" | Phone: "}
        <a href={`tel:+91${BRAND.CONTACT.PHONE}`} className="text-teal-300 hover:text-teal-200">
          {BRAND.CONTACT.PHONE}
        </a>{" "}
        or {BRAND.COMPANY}, {BRAND.CONTACT.ADDRESS_SHORT}.
      </p>
    </LegalSection>

    <LegalSection title="10. Disclaimer">
      <p>
        The content and services provided on this platform, including astrology consultation,
        horoscope, numerology, palmistry, kundli-related guidance, predictions, reports, and related
        materials, are intended for general guidance, informational, spiritual, and entertainment
        purposes only.
      </p>
      <p className="mt-2">
        Astrology-based guidance should not be considered a substitute for professional medical,
        legal, financial, psychological, or career advice. Users are advised to consult qualified
        professionals before making important decisions related to health, finance, law, career,
        relationships, or personal matters.
      </p>
      <p className="mt-2">
        By using this platform, you acknowledge that you do so voluntarily and at your own
        discretion. The platform, its owners, consultants, and creators shall not be held responsible
        for any decisions, losses, damages, or consequences arising from reliance on astrology-related
        content or services. Individual results and experiences may vary.
      </p>
    </LegalSection>

    <LegalSection title="11. Governing Law and Jurisdiction">
      <p>
        These Terms shall be governed and interpreted in accordance with the laws of India. Any
        disputes arising out of or relating to the use of this website shall be subject to the
        exclusive jurisdiction of the courts located in Gurgaon, Haryana.
      </p>
    </LegalSection>

    <LegalSection title="12. Updates to this Privacy Policy">
      <p>
        We may update this Privacy Policy periodically to reflect changes in our practices or legal
        obligations. Updates will be posted on this page with the revised date.
      </p>
    </LegalSection>

    <LegalSection title="Contact">
      <div className="space-y-1 border border-white/10 bg-[hsl(215_28%_8%/0.35)] p-4">
        <p>{BRAND.COMPANY}</p>
        <p>{BRAND.CONTACT.ADDRESS}</p>
        <a href={`mailto:${BRAND.CONTACT.EMAIL}`} className="text-teal-300 hover:text-teal-200">
          {BRAND.CONTACT.EMAIL}
        </a>
        <br />
        <a href={`tel:+91${BRAND.CONTACT.PHONE}`} className="text-teal-300 hover:text-teal-200">
          {BRAND.CONTACT.PHONE_DISPLAY}
        </a>
      </div>
    </LegalSection>
  </LegalPage>
);

export default PrivacyPolicy;

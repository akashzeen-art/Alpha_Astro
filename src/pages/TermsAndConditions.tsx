import { LegalPage, LegalIntro, LegalSection, LegalList } from "@/components/LegalPage";
import { BRAND } from "@/lib/brand";

const TermsAndConditions = () => (
  <LegalPage title="Terms and Conditions" subtitle={BRAND.COMPANY} updated="01-01-2026">
    <LegalIntro>
      <p>
        At {BRAND.COMPANY}, one of our main priorities is the privacy and trust of our users. This
        document explains how information may be collected, used, and protected when users access
        our website, astrology consultation services, digital guidance services, or related platform
        features.
      </p>
      <p>
        If you have additional questions or require more information about our policies, please
        contact us.
      </p>
    </LegalIntro>

    <LegalSection title="Consent">
      <p>
        By using our website or services, you hereby consent to our policies and agree to the terms
        mentioned herein.
      </p>
    </LegalSection>

    <LegalSection title="Information We Collect">
      <p>
        The personal information that you are asked to provide, and the reasons why it is required,
        will be made clear at the point where we request such information.
      </p>
      <p className="mt-2">
        If you contact us directly, we may receive additional information such as your name, email
        address, phone number, message content, attachments, birth details provided for
        astrology-related services, and any other information you choose to provide.
      </p>
    </LegalSection>

    <LegalSection title="How We Use Your Information">
      <LegalList
        items={[
          "Provide, operate, and maintain our website and astrology consultation services",
          "Improve, personalise, and expand our platform experience",
          "Understand and analyse how users interact with our services",
          "Develop new services, features, and functionality",
          "Communicate with users for customer service, updates, and marketing purposes",
          "Send service-related emails or notifications",
          "Process payments and subscription-related activities",
          "Find and prevent fraud or misuse of the platform",
        ]}
      />
    </LegalSection>

    <LegalSection title="Log Files">
      <p>
        The platform may follow a standard procedure of using log files. These files log visitors when
        they visit websites. The information collected may include IP addresses, browser type,
        Internet Service Provider, date and time stamp, referring/exit pages, and possibly number of
        clicks. This information is used to analyse trends, administer the site, track user movement,
        and gather demographic information.
      </p>
    </LegalSection>

    <LegalSection title="Cookies and Web Beacons">
      <p>
        Like many websites, the platform may use cookies. These cookies are used to store information
        including visitor preferences and pages accessed or visited. This helps improve the user
        experience and customise website content based on browser type or other information.
      </p>
    </LegalSection>

    <LegalSection title="CCPA Privacy Rights">
      <LegalList
        items={[
          "Request disclosure of categories and specific pieces of personal data collected",
          "Request deletion of personal data",
          "Request that a business not sell the consumer's personal data",
        ]}
      />
    </LegalSection>

    <LegalSection title="GDPR Data Protection Rights">
      <LegalList
        items={[
          "The right to access personal data",
          "The right to rectification of inaccurate information",
          "The right to erasure of personal data",
          "The right to restrict processing",
          "The right to object to processing",
          "The right to data portability",
        ]}
      />
    </LegalSection>

    <LegalSection title="Children's Information">
      <p>
        The platform does not knowingly collect personally identifiable information from children under
        the age of 16. If you believe that a child has provided such information, please contact us
        immediately and we will take appropriate steps to remove it.
      </p>
    </LegalSection>

    <LegalSection title="Terms of Use">
      <p className="mb-3">
        This document is an electronic record in terms of the Information Technology Act, 2000 and
        rules thereunder as applicable.
      </p>
      <p className="mb-3">
        The platform is owned by {BRAND.COMPANY}, a company incorporated under applicable Indian
        laws. Your use of the platform and services is governed by these Terms of Use.
      </p>
      <p className="mb-4 font-semibold text-slate-100">
        Accessing, browsing, registering, or otherwise using the platform indicates your agreement
        to all terms and conditions under these terms of use.
      </p>
      <p className="mb-2 font-medium text-slate-100">Key Terms</p>
      <LegalList
        items={[
          "You agree to provide true, accurate, and complete information during registration or service usage.",
          "You understand that astrology guidance is based on astrological interpretations and should not be treated as a guaranteed outcome or professional legal, medical, financial, or psychological advice.",
          "Your use of our services is solely at your own discretion and risk.",
          "You agree to pay all applicable charges associated with availing consultations, subscriptions, reports, or other services.",
          "You agree not to use the platform for any unlawful, abusive, misleading, or fraudulent purpose.",
          "You shall indemnify and hold harmless the platform owner from claims arising due to misuse of services or violation of these terms.",
        ]}
      />
      <p className="mt-4">
        All disputes arising out of or in connection with these Terms shall be subject to the
        exclusive jurisdiction of Indian courts and governed by the laws of India.
      </p>
    </LegalSection>

    <LegalSection title="Contact">
      <p>
        {BRAND.CONTACT.ADDRESS_SHORT}
        <br />
        <a href={`mailto:${BRAND.CONTACT.EMAIL}`} className="text-teal-300 hover:text-teal-200">
          {BRAND.CONTACT.EMAIL}
        </a>
        {" | Phone: "}
        <a href={`tel:+91${BRAND.CONTACT.PHONE}`} className="text-teal-300 hover:text-teal-200">
          {BRAND.CONTACT.PHONE}
        </a>
      </p>
    </LegalSection>
  </LegalPage>
);

export default TermsAndConditions;

import { LegalPage, LegalIntro, LegalSection, LegalList } from "@/components/LegalPage";
import { BRAND } from "@/lib/brand";

const RefundPolicy = () => (
  <LegalPage title="Refund Policy" subtitle={BRAND.COMPANY} updated="01-01-2026">
    <LegalIntro>
      <p>
        Thank you for subscribing to or purchasing services from {BRAND.COMPANY.toUpperCase()}. We
        hope you are satisfied with our astrology-related services, but if not, we are here to help.
      </p>
    </LegalIntro>

    <LegalSection title="1. Free Trial">
      <p>
        It may or may not offer a free trial for new users, depending on the service plan or
        promotional offer available at the time. If a trial is offered, users may cancel during the
        trial period as per the terms displayed at the time of purchase.
      </p>
    </LegalSection>

    <LegalSection title="2. Cancellation Policy">
      <p>
        Users may cancel recurring subscriptions, if applicable, at any time. Upon cancellation,
        access may remain active until the end of the current billing cycle unless otherwise stated
        in the selected plan.
      </p>
    </LegalSection>

    <LegalSection title="3. Refund Eligibility">
      <p>
        To be eligible for a refund, you must submit a request within 2 days of your subscription or
        service purchase date. Refunds may be considered on a case-by-case basis and are granted at
        the sole discretion of {BRAND.COMPANY}.
      </p>
      <p className="mt-2">
        Refund requests may be considered where users face technical issues that prevent access to
        paid astrology services and such issues cannot be resolved by our support team. Proof of the
        issue may be required.
      </p>
      <p className="mt-2">
        Refunds are not guaranteed and may vary depending on the circumstances. Refund requests due
        to change of mind, incorrect user details provided for astrology services, completed
        consultations, delivered reports, third-party failures, or personal circumstances may not be
        honoured.
      </p>
    </LegalSection>

    <LegalSection title="4. Process for Requesting a Refund">
      <p>
        To request a refund, please contact our customer support team at{" "}
        <a href={`mailto:${BRAND.CONTACT.EMAIL}`} className="text-teal-300 hover:text-teal-200">
          {BRAND.CONTACT.EMAIL}
        </a>
        {" | Phone: "}
        <a href={`tel:+91${BRAND.CONTACT.PHONE}`} className="text-teal-300 hover:text-teal-200">
          {BRAND.CONTACT.PHONE}
        </a>
        . Include your account information, payment details, service/subscription details, and a
        brief explanation of the reason for the refund request.
      </p>
    </LegalSection>

    <LegalSection title="5. Refund Processing">
      <p>
        Once your refund request is received and reviewed, we will notify you regarding approval or
        rejection. If approved, the refund will be processed to the original method of payment within
        7 working days, subject to payment gateway timelines.
      </p>
    </LegalSection>

    <LegalSection title="6. Changes to Refund Policy">
      <p>
        {BRAND.COMPANY} reserves the right to modify this refund policy at any time. Changes will
        take effect immediately upon posting on the website. By continuing to use our services after
        changes are made, you agree to the revised policy.
      </p>
    </LegalSection>

    <LegalSection title="Scenarios Where Refunds Would Typically Be Granted">
      <LegalList
        items={[
          "Technical issues that prevent access to paid astrology services despite support attempts.",
          "Billing errors, such as duplicate charges or charges made after valid cancellation.",
        ]}
      />
    </LegalSection>

    <LegalSection title="Scenarios Where Refunds Would Not Typically Be Granted">
      <LegalList
        items={[
          "Change of mind after purchase or after the refund eligibility period.",
          "Completed astrology consultations, delivered reports, or services already consumed.",
          "Incorrect birth details or personal information submitted by the user.",
          "Dissatisfaction based solely on predictions, interpretations, or expected outcomes.",
        ]}
      />
    </LegalSection>

    <LegalSection title="7. Contact Us">
      <p>
        If you have any questions about our refund policy, please contact us at{" "}
        <a href={`mailto:${BRAND.CONTACT.EMAIL}`} className="text-teal-300 hover:text-teal-200">
          {BRAND.CONTACT.EMAIL}
        </a>
        {" | Phone: "}
        <a href={`tel:+91${BRAND.CONTACT.PHONE}`} className="text-teal-300 hover:text-teal-200">
          {BRAND.CONTACT.PHONE}
        </a>
        .
      </p>
    </LegalSection>
  </LegalPage>
);

export default RefundPolicy;

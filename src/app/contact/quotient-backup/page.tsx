import type { Metadata } from 'next';
import { ContactDetails } from '@/components/organisms/contact-details';
import { QuotientLeadForm } from '@/components/organisms/quotient-lead-form';
import { InnerPageHero } from '@/components/templates/inner-page-hero';

export const metadata: Metadata = {
  title: 'Quotient Quote Backup',
  description: 'Internal backup quote request page with the embedded Quotient form.',
  robots: {
    follow: false,
    index: false
  }
};

export default function QuotientQuoteBackupPage() {
  return (
    <>
      <InnerPageHero
        eyebrow="Contact"
        title="Tell us about the property, timeline, and finish you need."
        body="Share the key details and our team will review your request, check the scope, and get back to you with clear next steps."
        imageSrc={'/assets/hero-contact.jpeg'}
        imageAlt="Freemans Bay interior plastering and painting finish"
        meta="Quotient embed backup"
        pageNumber="05"
      />
      <section className="py-20 sm:py-28">
        <div className="site-shell grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <ContactDetails />
          <QuotientLeadForm />
        </div>
      </section>
    </>
  );
}

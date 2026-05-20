import { AnimatedReveal } from '@/components/molecules/animated-reveal';
import { CheckListItem } from '@/components/molecules/check-list-item';
import { SectionHeading } from '@/components/molecules/section-heading';
import { StaggeredImagePair } from '@/components/molecules/staggered-image-pair';

const values = [
  'Professional and reliable service',
  'Customer-focused project delivery',
  'Durable finishes using proven systems',
  'Long-term partnerships with trusted suppliers'
];

export function AboutStorySection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="site-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="We work for people"
            title="The finish matters, but so does the way the project feels."
            body="Plastering and painting can be disruptive when communication is loose. The team is built around practical scheduling, tidy preparation, and the kind of follow-through that gives clients confidence from first visit to handover."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {values.map((value) => (
              <CheckListItem key={value}>{value}</CheckListItem>
            ))}
          </div>
        </AnimatedReveal>

        <AnimatedReveal delay={0.08}>
          <StaggeredImagePair
            primary={{
              alt: 'Completed PlasterPro Solution exterior finish in Auckland',
              className: 'grayscale',
              height: 650,
              src: '/assets/about-second-section-1.jpeg',
              width: 520
            }}
            secondary={{
              alt: 'Completed exterior plastering project in Auckland',
              height: 775,
              src: '/assets/about-second-section-2.jpeg',
              width: 620
            }}
          />
        </AnimatedReveal>
      </div>
    </section>
  );
}

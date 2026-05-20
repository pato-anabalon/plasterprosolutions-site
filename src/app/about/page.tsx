import type { Metadata } from 'next';
import { BadgeCheck, BriefcaseBusiness, ShieldCheck, Sparkles } from 'lucide-react';
import { AboutMissionVision } from '@/components/organisms/about-mission-vision';
import { AboutProofStrip } from '@/components/organisms/about-proof-strip';
import { AboutQualificationsSection } from '@/components/organisms/about-qualifications-section';
import { AboutStorySection } from '@/components/organisms/about-story-section';
import { AboutStrengthsSection } from '@/components/organisms/about-strengths-section';
import { AboutTeamSection } from '@/components/organisms/about-team-section';
import { InnerPageHero } from '@/components/templates/inner-page-hero';
import { siteConfig } from '@/data/site';
import { teamMembers } from '@/data/team';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about PlasterPro Solution, an Auckland plastering and painting team with more than 20 years of industry experience.'
};

const siteStrengths = [
  {
    title: 'Reliable site communication',
    body: 'Clear scoping, practical updates, and fewer surprises for homeowners, builders, agents, and property managers.',
    icon: BriefcaseBusiness
  },
  {
    title: 'Preparation-led finishes',
    body: 'Plastering, painting, and gib stopping work is approached from the surface up, with proper preparation before the final coat.',
    icon: Sparkles
  },
  {
    title: 'Certified systems and suppliers',
    body: 'Recognised credentials and trusted product partners help support durable results across Auckland conditions.',
    icon: BadgeCheck
  },
  {
    title: 'Careful handover',
    body: 'The team works toward clean, photo-ready presentation, tidy site conduct, and finishes that hold up in person.',
    icon: ShieldCheck
  }
];

export default function AboutPage() {
  return (
    <>
      <InnerPageHero
        eyebrow="About"
        title="Auckland finishing specialists built on craft, clarity, and care."
        body="For over 20 years, PlasterPro Solution has supported Auckland homes, builders, commercial teams, agents, and property managers with precise plastering, painting, and gib stopping work."
        imageSrc={'/assets/hero-about.jpeg'}
        imageAlt="Premium residential exterior coating work by PlasterPro Solution"
        meta="20+ years industry experience"
        pageNumber="03"
      />

      <AboutProofStrip proofPoints={siteConfig.metrics} />
      <AboutStorySection />
      <AboutStrengthsSection strengths={siteStrengths} />
      <AboutTeamSection members={teamMembers} />
      <AboutMissionVision />
      <AboutQualificationsSection qualifications={siteConfig.qualifications} />
    </>
  );
}

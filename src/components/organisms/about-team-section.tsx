import { AnimatedReveal } from "@/components/molecules/animated-reveal";
import { SectionHeading } from "@/components/molecules/section-heading";
import { TeamMemberCard } from "@/components/molecules/team-member-card";
import type { TeamMember } from "@/data/team";

type AboutTeamSectionProps = {
  members: TeamMember[];
};

export function AboutTeamSection({ members }: AboutTeamSectionProps) {
  return (
    <section className="py-20 sm:py-28">
      <div className="site-shell">
        <div className="grid gap-10">
          <AnimatedReveal className="max-w-3xl">
            <SectionHeading
              eyebrow="The team behind the finish"
              title="Hands-on people, practical coordination, and pride in the details."
              body="Meet the people responsible for keeping projects moving, from quoting and planning through to site coordination, delivery, and brand communication."
            />
          </AnimatedReveal>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {members.map((member, index) => (
              <AnimatedReveal
                delay={(index % 3) * 0.05}
                key={member.name}
              >
                <TeamMemberCard index={index} member={member} />
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

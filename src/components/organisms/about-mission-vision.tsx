import { StatementCard } from "@/components/molecules/statement-card";

export function AboutMissionVision() {
  return (
    <section className="bg-surface-strong py-20 sm:py-28" data-testid="about-mission-vision">
      <div className="site-shell grid gap-5 lg:grid-cols-2" data-testid="about-mission-vision-grid">
        <StatementCard
          body="To provide reliable plastering, painting, and gib stopping solutions across Auckland, consistently exceeding expectations through clear communication, durable workmanship, and a customer-focused service experience."
          eyebrow="Our mission"
          title="High-quality finishes delivered with professionalism and care."
          tone="dark"
        />
        <StatementCard
          body="To keep strengthening the company through respected systems, leading suppliers, continuous improvement, and long-lasting work that gives clients confidence well beyond handover."
          delay={0.08}
          eyebrow="Our vision"
          title="To be recognised for excellence on every Auckland project."
        />
      </div>
    </section>
  );
}

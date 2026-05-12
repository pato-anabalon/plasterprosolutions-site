type LegalDocumentSectionProps = {
  content: string;
  id: string;
  title: string;
};

export function LegalDocumentSection({
  content,
  id,
  title,
}: LegalDocumentSectionProps) {
  return (
    <section
      className="scroll-mt-28 rounded-lg border border-charcoal/10 bg-surface p-6 shadow-[0_20px_70px_rgb(25_23_20/0.08)] sm:p-8"
      id={id}
    >
      <h2 className="text-3xl font-black leading-tight text-charcoal">
        {title}
      </h2>
      <div className="legal-copy mt-8 whitespace-pre-line text-base font-bold leading-8 text-muted sm:text-lg sm:leading-9">
        {content}
      </div>
    </section>
  );
}

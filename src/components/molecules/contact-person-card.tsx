import { Mail, Phone } from "lucide-react";

type ContactPersonCardProps = {
  email: string;
  name: string;
  phone: string;
  role: string;
};

export function ContactPersonCard({
  email,
  name,
  phone,
  role,
}: ContactPersonCardProps) {
  return (
    <article
      className="rounded-lg border border-charcoal/10 bg-surface p-4 shadow-[0_14px_34px_rgb(25_23_20/0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-spicy-orange/40 hover:shadow-[0_20px_46px_rgb(25_23_20/0.1)]"
      data-testid="contact-person-card"
    >
      <div>
        <h4
          className="text-lg font-black leading-tight text-charcoal"
          data-testid="contact-person-card-name"
        >
          {name}
        </h4>
        <p className="mt-1 text-sm font-extrabold uppercase tracking-[0.12em] text-spicy-orange">
          {role}
        </p>
      </div>

      <div className="mt-4 grid gap-2 text-sm font-bold text-muted">
        <a
          className="flex items-center gap-2 transition hover:text-spicy-orange"
          data-testid="contact-person-card-phone"
          href={`tel:${phone.replaceAll(" ", "")}`}
        >
          <Phone size={16} aria-hidden="true" />
          <span>{phone}</span>
        </a>
        <a
          className="flex items-center gap-2 break-all transition hover:text-spicy-orange"
          data-testid="contact-person-card-email"
          href={`mailto:${email}`}
        >
          <Mail size={16} aria-hidden="true" />
          <span>{email}</span>
        </a>
      </div>
    </article>
  );
}

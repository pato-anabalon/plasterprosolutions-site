import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/data/site";

export function ContactDetails() {
  return (
    <aside className="surface-panel rounded-lg p-8">
      <h2 className="text-2xl font-black text-charcoal">Contact details</h2>
      <ul className="mt-6 grid gap-5 text-muted">
        <li className="flex gap-3">
          <Phone className="text-spicy-orange" size={20} aria-hidden="true" />
          <a href={`tel:${siteConfig.phone.replaceAll(" ", "")}`}>
            {siteConfig.phone}
          </a>
        </li>
        <li className="flex gap-3">
          <Mail className="text-spicy-orange" size={20} aria-hidden="true" />
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        </li>
        <li className="flex gap-3">
          <MapPin className="text-spicy-orange" size={20} aria-hidden="true" />
          <span>{siteConfig.address}</span>
        </li>
      </ul>
      <div className="mt-8 border-t border-charcoal/10 pt-6">
        <div className="flex gap-3">
          <Clock
            className="mt-1 shrink-0 text-spicy-orange"
            size={20}
            aria-hidden="true"
          />
          <p className="pretty text-base font-bold leading-7 text-charcoal">
            Include access notes, target dates, and photos if you have them.
            That helps the first response get practical quickly.
          </p>
        </div>
      </div>
    </aside>
  );
}

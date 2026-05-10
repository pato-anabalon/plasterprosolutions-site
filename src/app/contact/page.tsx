import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { InnerPageHero } from "@/components/templates/inner-page-hero";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Request a plastering, painting, gib stopping, or real estate property presentation quote from PlasterProSolution.",
};

export default function ContactPage() {
  return (
    <>
      <InnerPageHero
        eyebrow="Contact"
        title="Tell us about the property, timeline, and finish you need."
        body={`Quote requests are prepared to route to ${siteConfig.email}. Email delivery will be connected through the production provider before launch.`}
      />
      <section className="py-20 sm:py-28">
        <div className="site-shell grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="surface-panel rounded-lg p-8">
            <h2 className="text-2xl font-black text-charcoal">
              Contact details
            </h2>
            <ul className="mt-6 grid gap-5 text-muted">
              <li className="flex gap-3">
                <Phone
                  className="text-spicy-orange"
                  size={20}
                  aria-hidden="true"
                />
                <a href={`tel:${siteConfig.phone.replaceAll(" ", "")}`}>
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail
                  className="text-spicy-orange"
                  size={20}
                  aria-hidden="true"
                />
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </li>
              <li className="flex gap-3">
                <MapPin
                  className="text-spicy-orange"
                  size={20}
                  aria-hidden="true"
                />
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
                  Include access notes, target dates, and photos if you have
                  them. That helps the first response get practical quickly.
                </p>
              </div>
            </div>
          </aside>

          <form
            action={`mailto:${siteConfig.email}`}
            className="surface-panel grid gap-5 rounded-lg p-6 sm:p-8"
            method="post"
            encType="text/plain"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="field-label">
                Name
                <input className="field-control" name="name" required />
              </label>
              <label className="field-label">
                Email
                <input
                  className="field-control"
                  name="email"
                  required
                  type="email"
                />
              </label>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="field-label">
                Phone
                <input className="field-control" name="phone" />
              </label>
              <label className="field-label">
                Service type
                <select className="field-control" name="service">
                  <option>Commercial Plastering</option>
                  <option>Residential Plastering</option>
                  <option>Painting</option>
                  <option>Gib Stopping</option>
                  <option>Real Estate Make-ready</option>
                </select>
              </label>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="field-label">
                Timeline
                <select className="field-control" name="timeline">
                  <option>As soon as possible</option>
                  <option>This week</option>
                  <option>This month</option>
                  <option>Planning ahead</option>
                </select>
              </label>
              <label className="field-label">
                Property type
                <select className="field-control" name="propertyType">
                  <option>Home</option>
                  <option>Commercial site</option>
                  <option>Rental property</option>
                  <option>Listing / real estate</option>
                </select>
              </label>
            </div>
            <label className="field-label">
              Property address or suburb
              <input className="field-control" name="address" />
            </label>
            <label className="field-label">
              Message
              <textarea
                className="field-control min-h-40 py-3"
                name="message"
                required
              />
            </label>
            <Button className="w-full sm:w-fit" type="submit">
              Send Request
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}

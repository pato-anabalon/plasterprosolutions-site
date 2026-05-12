"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import type { TeamMember } from "@/data/team";

type TeamMemberCardProps = {
  index: number;
  member: TeamMember;
};

export function TeamMemberCard({ index, member }: TeamMemberCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const memberNumber = String(index + 1).padStart(2, "0");

  return (
    <article className="group relative min-h-[34rem] overflow-hidden rounded-lg border border-charcoal/10 bg-[var(--charcoal-panel)] shadow-[0_24px_70px_rgba(25,23,20,0.12)] transition duration-500 hover:-translate-y-1 hover:border-spicy-orange/70 hover:shadow-[0_30px_90px_rgba(25,23,20,0.2)]">
      <Image
        className={`object-cover transition duration-700 ease-out ${
          isOpen
            ? "scale-105 opacity-35 grayscale"
            : "opacity-95 group-hover:scale-105"
        }`}
        src={member.image}
        alt={`${member.name}, ${member.role} at PlasterPro Solution`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectPosition: member.imagePosition ?? "center" }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(25,23,20,0.04)_18%,rgba(25,23,20,0.32)_52%,rgba(25,23,20,0.92)_100%)]" />
      <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(227,65,15,0.12),transparent_42%)]" />
      </div>

      <div className="absolute left-5 top-5 flex items-center gap-3">
        <span className="rounded-full border border-white/18 bg-white/12 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white/80 backdrop-blur-md">
          Team / {memberNumber}
        </span>
      </div>

      <button
        className="focus-ring absolute right-5 top-5 z-30 grid size-11 place-items-center rounded-full border border-white/20 bg-surface text-charcoal shadow-[0_16px_42px_rgba(0,0,0,0.18)] transition duration-300 hover:bg-spicy-orange hover:text-white"
        type="button"
        aria-label={`${isOpen ? "Close" : "Open"} ${member.name} profile`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? (
          <X size={18} aria-hidden="true" />
        ) : (
          <Plus size={20} aria-hidden="true" />
        )}
      </button>

      <div
        className={`absolute inset-x-0 bottom-0 z-20 p-5 text-white transition duration-500 ${
          isOpen ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100"
        }`}
        aria-hidden={isOpen}
      >
        <p className="text-xs font-black uppercase tracking-[0.18em] text-spicy-orange">
          {member.role}
        </p>
        <h3 className="balanced mt-2 text-3xl font-black leading-none">
          {member.name}
        </h3>
        <p className="pretty mt-4 text-base font-bold leading-7 text-white/72">
          {member.shortBio}
        </p>
      </div>

      <div
        className={`absolute inset-0 z-20 flex flex-col justify-end bg-[rgb(21_19_17/0.9)] p-5 text-white backdrop-blur-md transition duration-500 ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-8 opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="mb-auto mt-14">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-spicy-orange">
            {member.role}
          </p>
          <h3 className="balanced mt-2 text-3xl font-black leading-none">
            {member.name}
          </h3>
        </div>
        <div className="max-h-[22rem] overflow-y-auto pr-2">
          <p className="pretty text-sm font-bold leading-6 text-white/76">
            {member.bio}
          </p>
          {member.outsideWork ? (
            <div className="mt-5 border-t border-white/14 pt-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/42">
                Outside work
              </p>
              <p className="pretty mt-2 text-sm font-bold leading-6 text-white/68">
                {member.outsideWork}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

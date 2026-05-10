"use client";

import { useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type MetricCardProps = {
  value: string;
  label: string;
};

function splitMetric(value: string) {
  const match = value.match(/^(\d+)(.*)$/);

  if (!match) {
    return { number: 0, suffix: value };
  }

  return {
    number: Number(match[1]),
    suffix: match[2] ?? "",
  };
}

export function MetricCard({ value, label }: MetricCardProps) {
  const scope = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const metric = useMemo(() => splitMetric(value), [value]);

  useGSAP(
    () => {
      const target = numberRef.current;

      if (!target) {
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        target.textContent = `${metric.number}${metric.suffix}`;
        return;
      }

      const counter = { value: 0 };

      gsap.fromTo(
        scope.current,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.62,
          ease: "power3.out",
          scrollTrigger: {
            trigger: scope.current,
            start: "top 84%",
            once: true,
          },
        },
      );

      gsap.to(counter, {
        value: metric.number,
        duration: 1.25,
        ease: "power2.out",
        snap: { value: 1 },
        scrollTrigger: {
          trigger: scope.current,
          start: "top 84%",
          once: true,
        },
        onUpdate: () => {
          target.textContent = `${counter.value}${metric.suffix}`;
        },
      });
    },
    { dependencies: [metric.number, metric.suffix], scope },
  );

  return (
    <div
      ref={scope}
      className="surface-panel rounded-lg p-6 opacity-0"
    >
      <p className="text-4xl font-black text-charcoal">
        <span ref={numberRef}>0{metric.suffix}</span>
      </p>
      <p className="mt-2 text-sm font-extrabold uppercase tracking-[0.12em] text-spicy-orange">
        {label}
      </p>
    </div>
  );
}

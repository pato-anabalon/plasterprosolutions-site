'use client';

import { type RefObject, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { useGSAP } from '@gsap/react';
import { CircleCheck, CloudOff } from 'lucide-react';

gsap.registerPlugin(useGSAP, MorphSVGPlugin);

export type QuoteSendPhase = 'idle' | 'sending' | 'success' | 'error' | 'closing';
export type QuoteSendOutcome = 'success' | 'error';

/** A sheet of paper with a folded corner, the shape the plane is folded from. */
const sheetPath = 'M34 18 L74 18 L90 34 L90 102 L34 102 Z';
/** A paper dart pointing right. */
const planePath = 'M108 54 L14 28 L38 60 L22 92 Z';

const clouds = [
  { className: 'top-[10%] w-28 opacity-40', offset: 0.15, speed: 7 },
  { className: 'top-[24%] w-16 opacity-25', offset: 0.65, speed: 11 },
  { className: 'top-[58%] w-36 opacity-30', offset: 0.4, speed: 8.5 },
  { className: 'top-[72%] w-20 opacity-45', offset: 0.85, speed: 6 },
  { className: 'top-[86%] w-24 opacity-20', offset: 0.05, speed: 12 }
];

type QuoteSendOverlayProps = {
  caption: string;
  errorMessage: string;
  onBackToForm: () => void;
  onClose: () => void;
  onRetry: () => void;
  outcome: QuoteSendOutcome | null;
  phase: QuoteSendPhase;
};

function CloudShape({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`absolute left-0 fill-white ${className}`}
      data-send="cloud"
      viewBox="0 0 120 60"
    >
      <path d="M30 56 C14 56 6 46 8 36 C10 26 20 22 28 24 C30 12 42 4 56 6 C68 8 76 16 78 24 C84 18 96 18 102 26 C110 26 116 34 114 42 C112 50 106 56 96 56 Z" />
    </svg>
  );
}

/**
 * What covers the quote form while it's being sent: a sheet folds into a paper
 * plane that flies through passing clouds, then lands or crashes depending on
 * how the request went. The form stays mounted underneath, so nothing typed is
 * lost if it has to be sent again.
 */
export function QuoteSendOverlay({
  caption,
  errorMessage,
  onBackToForm,
  onClose,
  onRetry,
  outcome,
  phase
}: QuoteSendOverlayProps) {
  const showMessage = outcome !== null && phase !== 'idle' && phase !== 'sending';

  return (
    <div
      className="invisible absolute inset-0 z-10 overflow-hidden rounded-lg bg-spicy-orange text-white opacity-0"
      data-send="overlay"
      data-testid="quote-send-overlay"
    >
      <div className="pointer-events-none absolute inset-0" data-send="sky">
        {clouds.map((cloud) => (
          <div data-offset={cloud.offset} data-speed={cloud.speed} key={cloud.className}>
            <CloudShape className={cloud.className} />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 grid place-items-center p-6" data-send="scene">
        <div className="grid justify-items-center gap-6">
          <svg
            aria-hidden="true"
            className="size-36 overflow-visible drop-shadow-[0_18px_30px_rgba(25,23,20,0.25)] sm:size-44"
            data-send="plane"
            viewBox="0 0 120 120"
          >
            <path className="fill-white" d={sheetPath} data-send="plane-shape" />
            <path className="fill-[#f6d5c9] opacity-0" d="M108 54 L38 60 L22 92 Z" data-send="plane-shade" />
            <path
              className="fill-none stroke-[#e3410f]/40 opacity-0"
              d="M38 60 L108 54"
              data-send="plane-crease"
              strokeLinecap="round"
              strokeWidth="1.5"
            />
            <path className="fill-[#f6d5c9]" d="M74 18 L74 34 L90 34 Z" data-send="sheet-corner" />
            <g className="stroke-[#e3410f]/25" data-send="sheet-lines" strokeLinecap="round" strokeWidth="3">
              <path d="M44 48 H80" />
              <path d="M44 60 H80" />
              <path d="M44 72 H80" />
              <path d="M44 84 H66" />
            </g>
          </svg>

          <p
            aria-live="polite"
            className="text-sm font-extrabold uppercase tracking-[0.14em] text-white/90"
            data-send="caption"
            role="status"
          >
            {phase === 'sending' ? caption : ''}
          </p>
        </div>
      </div>

      {showMessage ? (
        <div
          className="absolute inset-0 grid place-items-center p-8 text-center"
          data-send="message"
          data-testid="quote-send-message"
          role={outcome === 'error' ? 'alert' : 'status'}
        >
          <div className="grid max-w-sm justify-items-center gap-4">
            {outcome === 'success' ? (
              <CircleCheck aria-hidden="true" size={56} strokeWidth={1.8} />
            ) : (
              <CloudOff aria-hidden="true" size={56} strokeWidth={1.8} />
            )}
            <h3 className="text-2xl font-extrabold leading-tight sm:text-3xl">
              {outcome === 'success' ? 'Request sent!' : "Your request didn't make it"}
            </h3>
            <p className="text-base font-bold leading-7 text-white/90">
              {outcome === 'success'
                ? "Thanks for reaching out. Your quote request has landed with our team and we'll be in touch soon."
                : errorMessage}
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              {outcome === 'success' ? (
                <button
                  className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-extrabold uppercase tracking-[0.08em] text-spicy-orange shadow-[0_18px_40px_rgba(25,23,20,0.2)] transition duration-300 hover:-translate-y-0.5"
                  data-send-action="primary"
                  data-testid="quote-send-close"
                  onClick={onClose}
                  type="button"
                >
                  Close
                </button>
              ) : (
                <>
                  <button
                    className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-extrabold uppercase tracking-[0.08em] text-spicy-orange shadow-[0_18px_40px_rgba(25,23,20,0.2)] transition duration-300 hover:-translate-y-0.5"
                    data-send-action="primary"
                    data-testid="quote-send-retry"
                    onClick={onRetry}
                    type="button"
                  >
                    Try again
                  </button>
                  <button
                    className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-extrabold uppercase tracking-[0.08em] text-white underline-offset-4 transition duration-300 hover:underline"
                    data-testid="quote-send-back"
                    onClick={onBackToForm}
                    type="button"
                  >
                    Back to form
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type QuoteSendAnimationOptions = {
  buttonRef: RefObject<HTMLButtonElement | null>;
  formRef: RefObject<HTMLFormElement | null>;
  onClosed: () => void;
  phase: QuoteSendPhase;
};

type Circle = { r: number; x: number; y: number };

/** The submit button's circle, in the form's coordinates. */
function getButtonCircle(form: HTMLElement, button: HTMLElement): Circle {
  const formBox = form.getBoundingClientRect();
  const buttonBox = button.getBoundingClientRect();

  return {
    r: buttonBox.height / 2,
    x: buttonBox.left - formBox.left + buttonBox.height / 2,
    y: buttonBox.top - formBox.top + buttonBox.height / 2
  };
}

/** Radius that reaches the form's farthest corner from the circle's centre. */
function getCoverRadius(form: HTMLElement, { x, y }: Circle) {
  const { height, width } = form.getBoundingClientRect();

  return Math.max(
    Math.hypot(x, y),
    Math.hypot(width - x, y),
    Math.hypot(x, height - y),
    Math.hypot(width - x, height - y)
  );
}

function clipCircle(radius: number, { x, y }: Circle) {
  return `circle(${radius}px at ${x}px ${y}px)`;
}

/**
 * Drives the send animation from the form's phase. The form never waits on it
 * except when closing, where `onClosed` hands the button back.
 */
export function useQuoteSendAnimation({ buttonRef, formRef, onClosed, phase }: QuoteSendAnimationOptions) {
  const previousPhase = useRef<QuoteSendPhase>('idle');
  const activeTimeline = useRef<gsap.core.Timeline | null>(null);
  const flightLoops = useRef<gsap.core.Tween[]>([]);
  const cloudLoops = useRef<gsap.core.Tween[]>([]);
  const buttonSize = useRef({ padding: '', width: 0 });
  // Read when the closing timeline ends, which can be several renders later.
  const onClosedRef = useRef(onClosed);

  useEffect(() => {
    onClosedRef.current = onClosed;
  });

  useEffect(
    () => () => {
      flightLoops.current.forEach((tween) => tween.kill());
      cloudLoops.current.forEach((tween) => tween.kill());
    },
    []
  );

  useGSAP(
    () => {
      const from = previousPhase.current;
      previousPhase.current = phase;

      const form = formRef.current;
      const button = buttonRef.current;

      if (from === phase || !form || !button) {
        return;
      }

      const find = (name: string) => form.querySelector<HTMLElement>(`[data-send="${name}"]`);
      const overlay = find('overlay');
      const plane = find('plane');
      const caption = find('caption');
      const label = button.querySelector('[data-send="label"]');
      const envelope = button.querySelector('[data-send="envelope"]');

      if (!overlay || !plane || !caption || !label || !envelope) {
        return;
      }

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const d = (seconds: number) => (reduceMotion ? 0 : seconds);
      const circle = () => getButtonCircle(form, button);
      const message = () => find('message');
      const remaining = activeTimeline.current?.isActive()
        ? activeTimeline.current.duration() - activeTimeline.current.time()
        : 0;

      const stopFlight = () => {
        flightLoops.current.forEach((tween) => tween.kill());
        flightLoops.current = [];
      };

      const startFlight = () => {
        if (reduceMotion) {
          return;
        }

        flightLoops.current = [
          gsap.fromTo(plane, { y: 12 }, { duration: 1.2, ease: 'sine.inOut', repeat: -1, y: -12, yoyo: true }),
          gsap.fromTo(
            plane,
            { rotation: -8 },
            { duration: 1.7, ease: 'sine.inOut', repeat: -1, rotation: -3, yoyo: true }
          )
        ];
      };

      const startClouds = () => {
        if (reduceMotion) {
          return;
        }

        if (cloudLoops.current.length) {
          gsap.to(cloudLoops.current, { duration: 0.6, timeScale: 1 });
          return;
        }

        cloudLoops.current = Array.from(overlay.querySelectorAll<HTMLElement>('[data-speed]')).map((cloud) => {
          const shape = cloud.firstElementChild as HTMLElement;
          const tween = gsap.fromTo(
            shape,
            { x: () => overlay.offsetWidth + 20 },
            {
              duration: Number(cloud.dataset.speed),
              ease: 'none',
              repeat: -1,
              x: () => -shape.getBoundingClientRect().width - 20
            }
          );

          tween.progress(Number(cloud.dataset.offset));
          return tween;
        });
      };

      const slowClouds = (timeScale: number) =>
        gsap.to(cloudLoops.current, { duration: d(1.2), ease: 'power1.out', timeScale });

      const foldPlane = () => {
        const shape = find('plane-shape');
        const sheetParts = [find('sheet-corner'), find('sheet-lines')];
        const planeParts = [find('plane-shade'), find('plane-crease')];

        return gsap
          .timeline()
          .set(plane, { autoAlpha: 1, rotation: 0, scale: 1, x: 0, y: 0 })
          .set(shape, { morphSVG: sheetPath })
          .set(planeParts, { autoAlpha: 0 })
          .set(sheetParts, { autoAlpha: 1 })
          .fromTo(
            plane,
            { autoAlpha: 0, rotation: -10, scale: 0.6, y: 40 },
            { autoAlpha: 1, duration: d(0.5), ease: 'back.out(1.7)', rotation: 0, scale: 1, y: 0 }
          )
          .fromTo(caption, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, duration: d(0.3), y: 0 }, '<0.2')
          .to(sheetParts, { autoAlpha: 0, duration: d(0.2) }, '+=0.15')
          .to(shape, { duration: d(0.75), ease: 'power2.inOut', morphSVG: planePath }, '<')
          .to(planeParts, { autoAlpha: 1, duration: d(0.25) }, '-=0.25')
          .to(plane, { duration: d(0.3), ease: 'sine.out', rotation: -8 })
          .call(startFlight);
      };

      const showMessage = (timeline: gsap.core.Timeline) =>
        timeline
          .fromTo(message(), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, duration: d(0.45), ease: 'power3.out', y: 0 })
          .call(() => message()?.querySelector<HTMLElement>('[data-send-action="primary"]')?.focus());

      let timeline: gsap.core.Timeline | null = null;

      if (phase === 'sending' && from === 'idle') {
        buttonSize.current = {
          padding: getComputedStyle(button).paddingLeft,
          width: button.offsetWidth
        };

        timeline = gsap
          .timeline({ defaults: { ease: 'power3.inOut' } })
          .set([find('scene'), find('sky')], { autoAlpha: 1 })
          .to(label, { autoAlpha: 0, duration: d(0.2), y: -8 })
          .to(button, { duration: d(0.4), paddingLeft: 0, paddingRight: 0, width: () => button.offsetHeight }, '<')
          .fromTo(
            envelope,
            { autoAlpha: 0, rotation: -20, scale: 0.3 },
            { autoAlpha: 1, duration: d(0.3), ease: 'back.out(2.2)', rotation: 0, scale: 1 },
            '-=0.1'
          )
          .to(envelope, { duration: d(0.12), repeat: 1, y: -4, yoyo: true })
          .set(overlay, { autoAlpha: 1, clipPath: () => clipCircle(circle().r, circle()) })
          .to(overlay, {
            clipPath: () => clipCircle(getCoverRadius(form, circle()), circle()),
            duration: d(0.7),
            ease: 'power2.in'
          })
          .call(startClouds)
          .add(foldPlane());
      }

      if (phase === 'sending' && from === 'error') {
        timeline = gsap.timeline().call(startClouds).add(foldPlane());
      }

      if (phase === 'success') {
        stopFlight();
        timeline = gsap
          .timeline({ delay: remaining })
          .to(caption, { autoAlpha: 0, duration: d(0.2) })
          .to(
            plane,
            {
              duration: d(1),
              ease: 'power2.in',
              rotation: -24,
              scale: 0.5,
              x: () => overlay.offsetWidth * 0.7,
              y: () => -overlay.offsetHeight * 0.35
            },
            '<'
          )
          .to(plane, { autoAlpha: 0, duration: d(0.25) }, '-=0.25')
          .add(slowClouds(0.35), '<');
        showMessage(timeline);
      }

      if (phase === 'error') {
        stopFlight();
        timeline = gsap
          .timeline({ delay: remaining })
          .to(caption, { autoAlpha: 0, duration: d(0.2) })
          .to(plane, { duration: d(0.25), ease: 'sine.out', rotation: 14, y: '-=10' }, '<')
          .to(plane, { duration: d(0.2), ease: 'sine.inOut', rotation: -12 })
          .to(plane, {
            duration: d(1.1),
            ease: 'power2.in',
            rotation: 75,
            x: '+=60',
            y: () => overlay.offsetHeight * 0.75
          })
          .to(plane, { autoAlpha: 0, duration: d(0.2) }, '-=0.2')
          .add(slowClouds(0), '<-0.8');
        showMessage(timeline);
      }

      if (phase === 'closing') {
        stopFlight();
        timeline = gsap
          .timeline({
            defaults: { ease: 'power3.inOut' },
            onComplete: () => {
              cloudLoops.current.forEach((tween) => tween.kill());
              cloudLoops.current = [];
              onClosedRef.current();
            }
          })
          .to([message(), find('scene'), find('sky')], { autoAlpha: 0, duration: d(0.25) })
          .to(overlay, {
            clipPath: () => clipCircle(circle().r, circle()),
            duration: d(0.6),
            ease: 'power2.inOut'
          })
          .set(overlay, { autoAlpha: 0, clearProps: 'clipPath' })
          .to(envelope, { autoAlpha: 0, duration: d(0.2), scale: 0.3 })
          .to(
            button,
            {
              duration: d(0.4),
              paddingLeft: buttonSize.current.padding,
              paddingRight: buttonSize.current.padding,
              width: buttonSize.current.width
            },
            '<'
          )
          .set(button, { clearProps: 'width,paddingLeft,paddingRight' })
          .to(label, { autoAlpha: 1, duration: d(0.25), y: 0 });
      }

      activeTimeline.current = timeline;
    },
    { dependencies: [phase], scope: formRef }
  );
}

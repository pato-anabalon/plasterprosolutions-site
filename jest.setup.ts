import "@testing-library/jest-dom";
import React from "react";
import { TextDecoder, TextEncoder } from "node:util";

Object.assign(global, {
  TextDecoder,
  TextEncoder,
});

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    alt,
    src,
    ...props
  }: {
    alt?: string;
    fill?: boolean;
    priority?: boolean;
    src: string | { src: string };
    [key: string]: unknown;
  }) => {
    const imageProps = { ...props };

    delete imageProps.fill;
    delete imageProps.priority;

    return React.createElement("img", {
      ...imageProps,
      alt,
      src: typeof src === "string" ? src : src.src,
    });
  },
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/"),
}));

jest.mock("@gsap/react", () => ({
  useGSAP: jest.fn(),
}));

jest.mock("gsap", () => {
  const tween = {
    fromTo: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    to: jest.fn().mockReturnThis(),
  };

  return {
    __esModule: true,
    default: {
      fromTo: jest.fn(),
      registerPlugin: jest.fn(),
      set: jest.fn(),
      timeline: jest.fn(() => tween),
      to: jest.fn(),
    },
  };
});

jest.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {},
}));

jest.mock("@vercel/blob/client", () => ({
  handleUpload: jest.fn(),
  upload: jest.fn(),
}));

jest.mock("@vercel/analytics", () => ({
  Analytics: () => null,
  track: jest.fn(),
}));

if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      addEventListener: jest.fn(),
      addListener: jest.fn(),
      dispatchEvent: jest.fn(),
      matches: false,
      media: query,
      onchange: null,
      removeEventListener: jest.fn(),
      removeListener: jest.fn(),
    })),
  });
}

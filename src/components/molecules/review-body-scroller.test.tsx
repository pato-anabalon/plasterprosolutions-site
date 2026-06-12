import { ReviewBodyScroller } from "./review-body-scroller";
import { fireEvent } from "@testing-library/react";
import { render, screen } from "@/test/test-utils";

describe("ReviewBodyScroller", () => {
  it("should render review paragraphs and line breaks", () => {
    render(
      <ReviewBodyScroller
        body={"First paragraph.\nStill first paragraph.\n\nSecond paragraph."}
        tone="light"
      />,
    );

    const body = screen.getByTestId("review-card-body");

    expect(body).toHaveTextContent("First paragraph.");
    expect(body).toHaveTextContent("Still first paragraph.");
    expect(body).toHaveTextContent("Second paragraph.");
    expect(body.querySelectorAll("p")).toHaveLength(2);
    expect(body.querySelectorAll("br")).toHaveLength(1);
  });

  it("should start auto-scroll on mouse hover when the review overflows", () => {
    const requestAnimationFrame = jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation(() => 1);

    render(
      <ReviewBodyScroller
        body={"Long review paragraph.\n\nSecond paragraph."}
        tone="light"
      />,
    );

    const body = screen.getByTestId("review-card-body");

    Object.defineProperty(body, "clientHeight", {
      configurable: true,
      value: 80,
    });
    Object.defineProperty(body, "scrollHeight", {
      configurable: true,
      value: 200,
    });

    fireEvent.mouseEnter(body);

    expect(requestAnimationFrame).toHaveBeenCalled();

    requestAnimationFrame.mockRestore();
  });

  it("should accumulate slow sub-pixel scroll progress", () => {
    const frameCallbacks: FrameRequestCallback[] = [];
    const requestAnimationFrame = jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((callback) => {
        frameCallbacks.push(callback);
        return frameCallbacks.length;
      });

    render(
      <ReviewBodyScroller
        body={"Long review paragraph.\n\nSecond paragraph."}
        tone="light"
      />,
    );

    const body = screen.getByTestId("review-card-body");
    let scrollTop = 0;

    Object.defineProperty(body, "clientHeight", {
      configurable: true,
      value: 80,
    });
    Object.defineProperty(body, "scrollHeight", {
      configurable: true,
      value: 200,
    });
    Object.defineProperty(body, "scrollTop", {
      configurable: true,
      get: () => scrollTop,
      set: (value) => {
        scrollTop = Math.floor(Number(value));
      },
    });

    fireEvent.mouseEnter(body);

    for (let frameIndex = 0; frameIndex <= 6; frameIndex += 1) {
      frameCallbacks.shift()?.(frameIndex * 16);
    }

    expect(scrollTop).toBeGreaterThan(0);

    requestAnimationFrame.mockRestore();
  });
});

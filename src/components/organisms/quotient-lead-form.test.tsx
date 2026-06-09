import { act } from "@testing-library/react";
import { QuotientLeadForm } from "./quotient-lead-form";
import { render, screen } from "@/test/test-utils";

describe("QuotientLeadForm", () => {
  it("should render the Quotient embed iframe", () => {
    render(<QuotientLeadForm />);

    expect(screen.getByTestId("quotient-lead-form")).toBeInTheDocument();
    expect(screen.getByTitle(/quotient lead form/i)).toHaveAttribute(
      "src",
      "https://www.quotientapp.com/e/17251-dc26ea1bb5ec4fe6b9bb86531d1d0cdb/form?embed",
    );
  });

  it("should update iframe height from trusted Quotient messages", () => {
    render(<QuotientLeadForm />);

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: {
            changeHeight: 920,
          },
          origin: "https://www.quotientapp.com",
        }),
      );
    });

    expect(screen.getByTestId("quotient-lead-form-iframe")).toHaveAttribute(
      "height",
      "920",
    );
  });

  it("should ignore height messages from other origins", () => {
    render(<QuotientLeadForm />);

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: {
            changeHeight: 920,
          },
          origin: "https://example.com",
        }),
      );
    });

    expect(screen.getByTestId("quotient-lead-form-iframe")).toHaveAttribute(
      "height",
      "600",
    );
  });
});

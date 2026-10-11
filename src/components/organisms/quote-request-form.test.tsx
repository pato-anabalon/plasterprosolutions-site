import { upload } from "@vercel/blob/client";
import { act } from "@testing-library/react";
import { QuoteRequestForm } from "./quote-request-form";
import {
  createTestFile,
  render,
  screen,
  setupUser,
  waitFor,
} from "@/test/test-utils";

// A GSAP stand-in that runs the animation hook and finishes every timeline
// right away, so the send flow can be followed end to end.
jest.mock("@gsap/react", () => {
  const { useLayoutEffect } = jest.requireActual<typeof import("react")>("react");

  return {
    useGSAP: (callback: () => void, config?: { dependencies?: unknown[] }) => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      useLayoutEffect(() => callback(), config?.dependencies ?? []);
      return { contextSafe: <T,>(fn: T) => fn };
    },
  };
});

jest.mock("gsap", () => {
  const createTimeline = () => {
    const timeline: Record<string, unknown> = {
      duration: () => 0,
      isActive: () => false,
      time: () => 0,
    };

    for (const method of ["add", "call", "fromTo", "kill", "progress", "set", "timeScale", "to"]) {
      timeline[method] = jest.fn(() => timeline);
    }

    return timeline;
  };

  return {
    __esModule: true,
    default: {
      fromTo: jest.fn(() => createTimeline()),
      registerPlugin: jest.fn(),
      set: jest.fn(() => createTimeline()),
      timeline: jest.fn((vars?: { onComplete?: () => void }) => {
        if (vars?.onComplete) {
          queueMicrotask(vars.onComplete);
        }

        return createTimeline();
      }),
      to: jest.fn(() => createTimeline()),
    },
  };
});

const mockedUpload = jest.mocked(upload);

function setup() {
  const user = setupUser();
  render(<QuoteRequestForm minFlightMs={0} />);

  return { user };
}

function setupWithEndpoint(submitEndpoint: string) {
  const user = setupUser();
  render(<QuoteRequestForm minFlightMs={0} submitEndpoint={submitEndpoint} />);

  return { user };
}

async function fillRequiredFields(user: ReturnType<typeof setupUser>) {
  await user.type(screen.getByLabelText(/subject/i), "Exterior quote");
  await user.type(screen.getByLabelText(/message/i), "Please quote this work.");
  await user.type(screen.getByLabelText(/first name/i), "Patricio");
  await user.type(screen.getByLabelText(/last name/i), "Anabalon");
  await user.type(screen.getByLabelText(/email/i), "pato@example.com");
  await user.type(screen.getByLabelText(/phone/i), "+64274160934");
  await user.type(screen.getByLabelText(/address/i), "5B Kegworth Place");
}

describe("QuoteRequestForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should render required fields and optional fields", () => {
    setup();

    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/add files/i)).toBeInTheDocument();
  });

  it("should accumulate files added in separate selections", async () => {
    const { user } = setup();
    const fileInput = screen.getByLabelText(/add files/i);

    await user.upload(fileInput, createTestFile("first.jpg"));
    await user.upload(fileInput, createTestFile("second.pdf", "application/pdf"));

    expect(screen.getByText("first.jpg")).toBeInTheDocument();
    expect(screen.getByText("second.pdf")).toBeInTheDocument();
  });

  it("should remove a selected file", async () => {
    const { user } = setup();
    const file = createTestFile("remove-me.jpg");

    await user.upload(screen.getByLabelText(/add files/i), file);
    await user.click(screen.getByRole("button", { name: /remove remove-me.jpg/i }));

    expect(screen.queryByText("remove-me.jpg")).not.toBeInTheDocument();
  });

  it("should reject invalid file selections before upload", async () => {
    const { user } = setup();

    await user.upload(
      screen.getByLabelText(/add files/i),
      createTestFile("photo.jpg", "image/png"),
    );

    expect(
      screen.getByText(/please upload jpg, png, webp, heic, heif, or pdf files only/i),
    ).toBeInTheDocument();
    expect(mockedUpload).not.toHaveBeenCalled();
  });

  it("should upload files with sequential names and submit the quote payload", async () => {
    const { user } = setup();
    const fetchMock = jest.mocked(global.fetch);
    mockedUpload
      .mockResolvedValueOnce({
        url: "https://store.public.blob.vercel-storage.com/quote-requests/2026-05-13/patricio-anabalon-address-a1b2c3d4/file-1.jpg",
      } as Awaited<ReturnType<typeof upload>>)
      .mockResolvedValueOnce({
        url: "https://store.public.blob.vercel-storage.com/quote-requests/2026-05-13/patricio-anabalon-address-a1b2c3d4/file-2.pdf",
      } as Awaited<ReturnType<typeof upload>>);
    fetchMock.mockResolvedValue({
      json: async () => ({ ok: true }),
      ok: true,
    } as Response);

    await fillRequiredFields(user);
    await user.type(screen.getByLabelText(/company/i), "Nodo");
    await user.upload(screen.getByLabelText(/add files/i), [
      createTestFile("long-original-name.jpg"),
      createTestFile("plans.pdf", "application/pdf"),
    ]);
    await user.click(screen.getByRole("button", { name: /send request/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/quote",
        expect.objectContaining({ method: "POST" }),
      );
    });

    expect(mockedUpload).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching(/\/file-1\.jpg$/),
      expect.any(File),
      expect.objectContaining({ handleUploadUrl: "/api/quote/upload" }),
    );
    expect(mockedUpload).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(/\/file-2\.pdf$/),
      expect.any(File),
      expect.objectContaining({ handleUploadUrl: "/api/quote/upload" }),
    );

    const [, requestInit] = fetchMock.mock.calls[0];
    const payload = JSON.parse(String(requestInit?.body));

    expect(payload).toEqual(
      expect.objectContaining({
        address: "5B Kegworth Place",
        company: "Nodo",
        files: [
          expect.objectContaining({ name: "file-1.jpg" }),
          expect.objectContaining({ name: "file-2.pdf" }),
        ],
        firstName: "Patricio",
        submissionId: expect.any(String),
        uploadFolder: expect.stringMatching(
          /^quote-requests\/\d{4}-\d{2}-\d{2}\/patricio-anabalon-5b-kegworth-place-[a-z0-9]{8}$/,
        ),
      }),
    );
    expect(await screen.findByRole("heading", { name: /request sent/i })).toBeInTheDocument();
    expect(screen.getByText(/we'll be in touch soon/i)).toBeInTheDocument();
  });

  it("should reset the form when the success message is closed", async () => {
    const { user } = setup();
    jest.mocked(global.fetch).mockResolvedValue({
      json: async () => ({ ok: true }),
      ok: true,
    } as Response);

    await fillRequiredFields(user);
    await user.upload(screen.getByLabelText(/add files/i), createTestFile("site.jpg"));
    mockedUpload.mockResolvedValue({
      url: "https://store.public.blob.vercel-storage.com/quote-requests/2026-05-13/folder/file-1.jpg",
    } as Awaited<ReturnType<typeof upload>>);
    await user.click(screen.getByRole("button", { name: /send request/i }));
    await user.click(await screen.findByRole("button", { name: /close/i }));

    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: /request sent/i })).not.toBeInTheDocument();
    });
    expect(screen.getByLabelText(/subject/i)).toHaveValue("");
    expect(screen.queryByText("site.jpg")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send request/i })).toBeEnabled();
  });

  it("should reuse the submission id on a retry and renew it after success", async () => {
    const { user } = setup();
    const fetchMock = jest.mocked(global.fetch);
    fetchMock
      .mockResolvedValueOnce({
        json: async () => ({ error: "The quote request could not be sent. Please try again." }),
        ok: false,
      } as Response)
      .mockResolvedValue({
        json: async () => ({ ok: true }),
        ok: true,
      } as Response);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /send request/i }));
    await user.click(await screen.findByRole("button", { name: /try again/i }));
    await user.click(await screen.findByRole("button", { name: /close/i }));
    await screen.findByRole("button", { name: /send request/i });
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /send request/i })).toBeEnabled();
    });

    await user.clear(screen.getByLabelText(/email/i));
    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /send request/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));

    const ids = fetchMock.mock.calls.map(
      ([, init]) => JSON.parse(String(init?.body)).submissionId as string,
    );

    expect(ids[0]).toBeTruthy();
    expect(ids[1]).toBe(ids[0]);
    expect(ids[2]).not.toBe(ids[0]);
  });

  it("should show upload errors with a retry option", async () => {
    const { user } = setup();
    mockedUpload.mockRejectedValue(new Error("Upload failed"));

    await fillRequiredFields(user);
    await user.upload(screen.getByLabelText(/add files/i), createTestFile());
    await user.click(screen.getByRole("button", { name: /send request/i }));

    expect(await screen.findByText(/upload failed/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("should not upload the same files again when retrying", async () => {
    const { user } = setup();
    const fetchMock = jest.mocked(global.fetch);
    mockedUpload.mockResolvedValue({
      url: "https://store.public.blob.vercel-storage.com/quote-requests/2026-05-13/folder/file-1.jpg",
    } as Awaited<ReturnType<typeof upload>>);
    fetchMock
      .mockResolvedValueOnce({
        json: async () => ({ error: "The quote request could not be sent. Please try again." }),
        ok: false,
      } as Response)
      .mockResolvedValue({
        json: async () => ({ ok: true }),
        ok: true,
      } as Response);

    await fillRequiredFields(user);
    await user.upload(screen.getByLabelText(/add files/i), createTestFile());
    await user.click(screen.getByRole("button", { name: /send request/i }));
    await user.click(await screen.findByRole("button", { name: /try again/i }));

    expect(await screen.findByRole("heading", { name: /request sent/i })).toBeInTheDocument();
    expect(mockedUpload).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("should go back to the form with its details and the error after a failure", async () => {
    const { user } = setup();
    jest.mocked(global.fetch).mockResolvedValue({
      json: async () => ({ error: "Please enter a valid phone number." }),
      ok: false,
    } as Response);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /send request/i }));
    await user.click(await screen.findByRole("button", { name: /back to form/i }));

    expect(await screen.findByTestId("quote-request-form-status")).toHaveTextContent(
      "Please enter a valid phone number.",
    );
    expect(screen.getByLabelText(/subject/i)).toHaveValue("Exterior quote");
    expect(screen.getByRole("button", { name: /send request/i })).toBeEnabled();
  });

  it("should show a timeout error when a file upload does not finish", async () => {
    jest.useFakeTimers();
    const user = setupUser({ advanceTimers: jest.advanceTimersByTime });

    render(<QuoteRequestForm minFlightMs={0} />);
    mockedUpload.mockReturnValue(
      new Promise(() => {}) as ReturnType<typeof upload>,
    );

    await fillRequiredFields(user);
    await user.upload(screen.getByLabelText(/add files/i), createTestFile("slow.jpg"));
    await user.click(screen.getByRole("button", { name: /send request/i }));

    act(() => {
      jest.advanceTimersByTime(45_000);
    });

    expect(await screen.findByText(/the upload timed out/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();

  });

  it("should show API errors in the send overlay", async () => {
    const { user } = setup();
    const fetchMock = jest.mocked(global.fetch);
    fetchMock.mockResolvedValue({
      json: async () => ({ error: "The quote request could not be sent." }),
      ok: false,
    } as Response);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /send request/i }));

    expect(
      await screen.findByText(/the quote request could not be sent/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /didn't make it/i })).toBeInTheDocument();
  });

  it("should submit to a custom endpoint when configured", async () => {
    const { user } = setupWithEndpoint("/api/quote/custom");
    const fetchMock = jest.mocked(global.fetch);
    fetchMock.mockResolvedValue({
      json: async () => ({ ok: true }),
      ok: true,
    } as Response);

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /send request/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/quote/custom",
        expect.objectContaining({ method: "POST" }),
      );
    });
  });
});

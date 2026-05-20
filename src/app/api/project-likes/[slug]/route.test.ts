/** @jest-environment node */

import { NextRequest } from "next/server";
import {
  getProjectLikeCount,
  getProjectPost,
  hasProjectPostsDatabase,
  likeProjectPost,
} from "@/lib/project-posts";

jest.mock("@/lib/project-posts", () => ({
  getProjectLikeCount: jest.fn(),
  getProjectPost: jest.fn(),
  hasProjectPostsDatabase: jest.fn(),
  likeProjectPost: jest.fn(),
}));

async function loadRoute() {
  return import("./route");
}

function createRequest(cookie?: string) {
  return new NextRequest("https://plasterprosolution.co.nz/api/project-likes/demo", {
    headers: cookie ? { cookie } : undefined,
  });
}

function createContext(slug = "demo") {
  return {
    params: Promise.resolve({ slug }),
  };
}

describe("/api/project-likes/[slug]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(getProjectPost).mockResolvedValue({
      slug: "demo",
    } as never);
    jest.mocked(getProjectLikeCount).mockResolvedValue(4);
    jest.mocked(hasProjectPostsDatabase).mockReturnValue(true);
    jest.mocked(likeProjectPost).mockResolvedValue({
      alreadyLiked: false,
      count: 5,
      enabled: true,
      found: true,
    });
  });

  it("should return the current like count", async () => {
    const { GET } = await loadRoute();
    const response = await GET(createRequest(), createContext());

    await expect(response.json()).resolves.toEqual({
      count: 4,
      enabled: true,
    });
  });

  it("should return 404 when the post does not exist", async () => {
    jest.mocked(getProjectPost).mockResolvedValue(null);

    const { GET } = await loadRoute();
    const response = await GET(createRequest(), createContext("missing"));

    expect(response.status).toBe(404);
  });

  it("should increment a like and set a visitor cookie", async () => {
    const { POST } = await loadRoute();
    const response = await POST(createRequest(), createContext());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      alreadyLiked: false,
      count: 5,
      ok: true,
    });
    expect(response.headers.get("set-cookie")).toContain("pps_project_like_id=");
  });

  it("should not set a new cookie when the visitor already has one", async () => {
    const { POST } = await loadRoute();
    const response = await POST(
      createRequest("pps_project_like_id=visitor-1"),
      createContext(),
    );

    expect(response.headers.get("set-cookie")).toBeNull();
    expect(likeProjectPost).toHaveBeenCalledWith("demo", "visitor-1");
  });

  it("should return 503 when likes are not configured", async () => {
    jest.mocked(hasProjectPostsDatabase).mockReturnValue(false);

    const { POST } = await loadRoute();
    const response = await POST(createRequest(), createContext());

    expect(response.status).toBe(503);
  });
});

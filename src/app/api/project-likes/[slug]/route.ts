import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  getProjectLikeCount,
  getProjectPost,
  hasProjectPostsDatabase,
  likeProjectPost,
} from "@/lib/project-posts";

type ProjectLikeRouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

const visitorCookieName = "pps_project_like_id";
const visitorCookieMaxAge = 60 * 60 * 24 * 365;

export async function GET(_request: NextRequest, { params }: ProjectLikeRouteContext) {
  const { slug } = await params;
  const post = await getProjectPost(slug);

  if (!post) {
    return NextResponse.json({ error: "Project post not found." }, { status: 404 });
  }

  return NextResponse.json({
    count: await getProjectLikeCount(slug),
    enabled: hasProjectPostsDatabase(),
  });
}

export async function POST(
  request: NextRequest,
  { params }: ProjectLikeRouteContext,
) {
  const { slug } = await params;

  if (!hasProjectPostsDatabase()) {
    return NextResponse.json(
      { error: "Project likes are not configured yet." },
      { status: 503 },
    );
  }

  const existingVisitorId = request.cookies.get(visitorCookieName)?.value;
  const visitorId = existingVisitorId || randomUUID();
  let result: Awaited<ReturnType<typeof likeProjectPost>>;

  try {
    result = await likeProjectPost(slug, visitorId);
  } catch {
    return NextResponse.json(
      { error: "Project likes could not be updated." },
      { status: 502 },
    );
  }

  if (!result.found) {
    return NextResponse.json({ error: "Project post not found." }, { status: 404 });
  }

  const response = NextResponse.json({
    alreadyLiked: result.alreadyLiked,
    count: result.count,
    ok: true,
  });

  if (!existingVisitorId) {
    response.cookies.set(visitorCookieName, visitorId, {
      httpOnly: true,
      maxAge: visitorCookieMaxAge,
      path: "/",
      sameSite: "lax",
      secure: true,
    });
  }

  return response;
}

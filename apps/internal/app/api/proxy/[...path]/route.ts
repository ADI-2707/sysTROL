import { NextRequest, NextResponse } from "next/server";
import { cleanSetCookieHeader } from "../proxy-helpers.js";

const TARGET_API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://systrol-api.onrender.com";

async function handleProxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const joinedPath = Array.isArray(path) ? path.join("/") : "";
  const search = req.nextUrl.search || "";
  const targetUrl = `${TARGET_API_URL}/api/${joinedPath}${search}`;

  const forwardHeaders = new Headers();
  req.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (lower !== "host" && lower !== "content-length") {
      forwardHeaders.set(key, value);
    }
  });

  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    forwardHeaders.set("cookie", cookieHeader);
  }

  let body: BodyInit | undefined = undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const text = await req.text();
      body = text && text.trim().length > 0 ? text : "{}";
      forwardHeaders.set("content-type", "application/json");
    } else {
      body = await req.arrayBuffer();
    }
  }

  try {
    const upstreamRes = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body,
      redirect: "manual",
    });

    const resHeaders = new Headers();
    upstreamRes.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (lower !== "set-cookie") {
        resHeaders.set(key, value);
      }
    });

    const response = new NextResponse(upstreamRes.body, {
      status: upstreamRes.status,
      statusText: upstreamRes.statusText,
      headers: resHeaders,
    });

    const rawSetCookies = typeof upstreamRes.headers.getSetCookie === "function"
      ? upstreamRes.headers.getSetCookie()
      : [upstreamRes.headers.get("set-cookie")].filter(Boolean);

    for (const cookieStr of rawSetCookies) {
      if (cookieStr) {
        response.headers.append("set-cookie", cleanSetCookieHeader(cookieStr));
      }
    }

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        statusCode: 502,
        error: "Bad Gateway",
        message: error?.message || "Upstream service unreachable",
      },
      { status: 502 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;

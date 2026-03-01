import { NextResponse } from "next/server";

const MAX_EMAIL_LENGTH = 254;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function isValidEmail(email: string): boolean {
  return email.length <= MAX_EMAIL_LENGTH && EMAIL_REGEX.test(email);
}

function getClientKey(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  return realIp || "unknown";
}

function isRateLimited(clientKey: string): boolean {
  const now = Date.now();

  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }

  const current = rateLimitStore.get(clientKey);
  if (!current || current.resetAt <= now) {
    rateLimitStore.set(clientKey, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  current.count += 1;
  rateLimitStore.set(clientKey, current);
  return false;
}

function unavailableResponse() {
  return NextResponse.json(
    { error: "Newsletter signup is not available right now." },
    {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

type SubscribePayload = {
  email?: unknown;
};

export async function POST(request: Request) {
  if (process.env.NEWSLETTER_SIGNUP_ENABLED !== "1") {
    return unavailableResponse();
  }

  if (isRateLimited(getClientKey(request))) {
    return NextResponse.json(
      { error: "Too many signup attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  let payload: SubscribePayload;

  try {
    payload = (await request.json()) as SubscribePayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const resendAudienceId = process.env.RESEND_AUDIENCE_ID;

  if (!resendApiKey || !resendAudienceId) {
    return unavailableResponse();
  }

  const response = await fetch(
    `https://api.resend.com/audiences/${resendAudienceId}/contacts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        unsubscribed: false,
      }),
    }
  );

  if (response.ok || response.status === 409) {
    return NextResponse.json(
      { status: "accepted" },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  let responseError = "";
  try {
    const body = (await response.json()) as { message?: string };
    responseError = body.message || "";
  } catch {
    // Ignore invalid upstream error bodies.
  }

  const alreadySubscribed =
    response.status === 422 && /already exists|already subscribed/i.test(responseError);

  if (alreadySubscribed) {
    return NextResponse.json(
      { status: "accepted" },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  return NextResponse.json(
    { error: "Subscription failed. Please try again later." },
    {
      status: 502,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

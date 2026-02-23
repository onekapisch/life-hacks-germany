import { NextResponse } from "next/server";

const MAX_EMAIL_LENGTH = 254;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  return email.length <= MAX_EMAIL_LENGTH && EMAIL_REGEX.test(email);
}

type SubscribePayload = {
  email?: unknown;
};

export async function POST(request: Request) {
  let payload: SubscribePayload;

  try {
    payload = (await request.json()) as SubscribePayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const resendAudienceId = process.env.RESEND_AUDIENCE_ID;

  if (!resendApiKey || !resendAudienceId) {
    return NextResponse.json(
      { error: "Newsletter is not configured yet." },
      { status: 503 }
    );
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

  if (response.ok) {
    return NextResponse.json(
      { status: "subscribed" },
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
    // no-op
  }

  const alreadySubscribed =
    response.status === 409 ||
    (response.status === 422 && /already exists|already subscribed/i.test(responseError));

  if (alreadySubscribed) {
    return NextResponse.json(
      { status: "already-subscribed" },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  return NextResponse.json(
    { error: "Subscription failed. Please try again later." },
    { status: 502 }
  );
}

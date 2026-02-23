import { ImageResponse } from "@vercel/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

const MAX_TITLE_LENGTH = 120;
const MAX_SUBTITLE_LENGTH = 200;
const MAX_BADGE_LENGTH = 40;

function normalizeText(value: string | null, fallback: string, maxLength: number): string {
  if (!value) return fallback;
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length === 0) return fallback;
  return normalized.slice(0, maxLength);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = normalizeText(
    searchParams.get("title"),
    "Life Hacks Germany",
    MAX_TITLE_LENGTH
  );
  const subtitle = normalizeText(
    searchParams.get("subtitle"),
    "Verified guides for living in Germany",
    MAX_SUBTITLE_LENGTH
  );
  const badge = normalizeText(searchParams.get("badge"), "", MAX_BADGE_LENGTH);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          background:
            "linear-gradient(135deg, #f6f1e7 0%, #efe6d6 50%, #e8dcc8 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(27,31,42,0.04) 0, rgba(27,31,42,0.04) 1px, transparent 1px, transparent 28px), repeating-linear-gradient(90deg, rgba(27,31,42,0.04) 0, rgba(27,31,42,0.04) 1px, transparent 1px, transparent 28px)",
          }}
        />

        {/* Top gradient border */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background:
              "linear-gradient(90deg, #e63946 0%, #f2c14e 50%, #1d4e89 100%)",
          }}
        />

        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "8px",
              background:
                "linear-gradient(180deg, #111 0%, #111 33%, #d62828 33%, #d62828 66%, #f9c74f 66%, #f9c74f 100%)",
              boxShadow: "0 0 0 2px #1b1f2a",
            }}
          />
          <span
            style={{
              fontSize: "20px",
              fontWeight: 900,
              letterSpacing: "0.04em",
              textTransform: "uppercase" as const,
              color: "#1b1f2a",
            }}
          >
            Life Hacks Germany
          </span>
        </div>

        {/* Badge */}
        {badge && (
          <div
            style={{
              display: "flex",
              marginBottom: "20px",
            }}
          >
            <span
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase" as const,
                background: "#1b1f2a",
                color: "white",
              }}
            >
              {badge}
            </span>
          </div>
        )}

        {/* Title */}
        <h1
          style={{
            fontSize: title.length > 40 ? "48px" : "56px",
            fontWeight: 900,
            lineHeight: 1.1,
            color: "#1b1f2a",
            textTransform: "uppercase" as const,
            letterSpacing: "0.02em",
            margin: 0,
            maxWidth: "900px",
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "22px",
            color: "#3b4254",
            marginTop: "16px",
            maxWidth: "800px",
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </p>

        {/* Bottom accent */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "60px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#2a9d8f",
            }}
          />
          <span
            style={{
              fontSize: "14px",
              color: "#5a6073",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
            }}
          >
            lifehacksgermany.com
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}

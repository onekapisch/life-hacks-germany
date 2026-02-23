import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="32" cy="32" r="30" fill="#0E1015" stroke="#D4B15F" strokeWidth="2" />
        <circle cx="32" cy="32" r="25" fill="#121824" stroke="#A78638" strokeWidth="1" />

        <g clipPath="url(#coreClip)">
          <rect x="0" y="48" width="64" height="4" fill="#0C0C0C" />
          <rect x="0" y="52" width="64" height="4" fill="#B22234" />
          <rect x="0" y="56" width="64" height="8" fill="#D4B15F" />
        </g>

        <path d="M32 14 L27 30 L37 30 Z" fill="#EBD49A" />
        <path d="M32 50 L27 34 L37 34 Z" fill="#D4B15F" />
        <path d="M50 32 L34 27 L34 37 Z" fill="#D4B15F" />
        <path d="M14 32 L30 27 L30 37 Z" fill="#EBD49A" />

        <path d="M32 19 L29.8 29.6 L34.2 29.6 Z" fill="#111317" />
        <circle cx="32" cy="32" r="3.4" fill="#111317" stroke="#EBD49A" strokeWidth="1.1" />
        <circle cx="32" cy="32" r="1.2" fill="#EBD49A" />

        <defs>
          <clipPath id="coreClip">
            <circle cx="32" cy="32" r="25" />
          </clipPath>
        </defs>
      </svg>
    ),
    { ...size }
  );
}

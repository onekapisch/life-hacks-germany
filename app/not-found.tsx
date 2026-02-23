import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const stored = localStorage.getItem("lhg-theme");
    const theme = stored === "dark" || stored === "light"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
  } catch (_) {}
})();`,
          }}
        />
      </head>
      <body className="min-h-screen flex items-center justify-center bg-paper text-ink font-sans">
        <div className="text-center px-6">
          <h1 className="text-6xl font-black uppercase tracking-tight mb-4">
            404
          </h1>
          <p className="text-xl text-ink-2 mb-8">
            This page doesn&apos;t exist. Let&apos;s get you back on track.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/en" className="btn btn-primary">
              English Home
            </Link>
            <Link href="/de" className="btn btn-secondary">
              Deutsche Startseite
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}

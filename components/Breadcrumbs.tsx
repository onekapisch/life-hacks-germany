import Link from "next/link";
import type { Lang } from "@/lib/i18n";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({
  lang,
  items,
}: {
  lang: Lang;
  items: Crumb[];
}) {
  const allItems: Crumb[] = [
    { label: lang === "en" ? "Home" : "Start", href: `/${lang}` },
    ...items,
  ];

  return (
    <nav aria-label="Breadcrumb" className="container-main pt-4 pb-2">
      <ol className="breadcrumbs-shell">
        {allItems.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            {index > 0 && <span className="text-ink-3 mx-1">/</span>}
            {item.href && index < allItems.length - 1 ? (
              <Link
                href={item.href}
                className="breadcrumbs-link"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-ink font-semibold">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

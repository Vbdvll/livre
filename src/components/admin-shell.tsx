"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminShell({ slug, children }: { slug: string; children: React.ReactNode }) {
  const path = usePathname();
  const items = [
    { href: `/${slug}/admin`, label: "Accueil" },
    { href: `/${slug}/admin/livres`, label: "Livres" },
    { href: `/${slug}/admin/reglages`, label: "Réglages" },
    { href: `/${slug}`, label: "Vitrine" },
  ];
  return (
    <div className="mx-auto min-h-screen max-w-2xl pb-28">
      {children}
      <nav className="fixed inset-x-0 bottom-0 border-t border-[#E7E4DA] bg-white">
        <div className="mx-auto flex h-[72px] max-w-2xl items-center justify-around text-xs">
          {items.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className={`flex min-h-11 items-center px-3 ${
                path === i.href ? "font-semibold text-[#0B6E4F]" : "text-[#5B6475]"
              }`}
            >
              {i.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
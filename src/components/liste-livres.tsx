"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { repo } from "@/lib/repository";
import { seedDemo, DEMO_SLUG } from "@/lib/seed";
import { fcfa } from "@/lib/format";
import { Couverture } from "@/components/couverture";
import type { Livre } from "@/lib/types";

const sora = "font-[family-name:var(--font-sora)]";

export function ListeLivres({ slug }: { slug: string }) {
  const [livres, setLivres] = useState<Livre[] | undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (slug === DEMO_SLUG) await seedDemo();
      setLivres(await repo.listLivres(slug));
    })();
  }, [slug]);

  if (!livres) return <p className="p-6 text-sm">Chargement…</p>;

  return (
    <div className="px-5 pt-6">
      <h1 className={`${sora} text-2xl font-semibold`}>Mes livres</h1>
      <p className="mt-1 text-[13px] text-[#5B6475]">{livres.length} titre(s) au catalogue</p>

      <div className="mt-5 flex flex-col gap-3">
        {livres.length === 0 && (
          <p className="text-sm text-[#5B6475]">Aucun livre. Ajoute le premier avec « + Livre ».</p>
        )}
        {livres.map((l) => (
          <Link
            key={l.id}
            href={`/${slug}/admin/livres/${l.id}`}
            className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm"
          >
            <Couverture titre={l.titre} url={l.couverture} className="h-[72px] w-[52px] shrink-0 !p-1 !text-[8px]" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">{l.titre}</div>
              <div className="truncate text-[13px] text-[#5B6475]">{l.auteur}</div>
              <div className="mt-0.5 text-sm font-semibold text-[#0B6E4F]">{fcfa(l.prix)}</div>
            </div>
            <span
              className={`shrink-0 rounded-xl px-2.5 py-1 text-xs font-semibold ${
                l.stock === 0
                  ? "bg-[#F6DDD7] text-[#B4452E]"
                  : l.stock <= 3
                  ? "bg-[#FBEFD5] text-[#9A6B1F]"
                  : "bg-[#DDF1E8] text-[#0B6E4F]"
              }`}
            >
              {l.stock === 0 ? "Épuisé" : `Stock ${l.stock}`}
            </span>
          </Link>
        ))}
      </div>

      <Link
        href={`/${slug}/admin/livres/nouveau`}
        className="fixed bottom-24 right-5 flex h-[52px] items-center rounded-full bg-[#0B6E4F] px-5 font-semibold text-white shadow-[0_8px_24px_rgba(11,110,79,.35)]"
      >
        + Livre
      </Link>
    </div>
  );
}
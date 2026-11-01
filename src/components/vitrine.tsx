"use client";
import { useEffect, useMemo, useState } from "react";
import { Apparition } from "@/components/apparition";
import Link from "next/link";
import { repo } from "@/lib/repository";
import { seedDemo, DEMO_SLUG } from "@/lib/seed";
import { fcfa } from "@/lib/format";
import { Couverture } from "@/components/couverture";
import type { Boutique, Livre } from "@/lib/types";

const sora = "font-[family-name:var(--font-sora)]";

export function Vitrine({ slug }: { slug: string }) {
  const [b, setB] = useState<Boutique | null | undefined>(undefined);
  const [livres, setLivres] = useState<Livre[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Tous");

  useEffect(() => {
    (async () => {
      if (slug === DEMO_SLUG) await seedDemo();
      setB(await repo.getBoutique(slug));
      setLivres(await repo.listLivres(slug));
    })();
  }, [slug]);

  const categories = useMemo(
    () => ["Tous", ...Array.from(new Set(livres.map((l) => l.categorie)))],
    [livres]
  );
  const filtres = livres.filter(
    (l) =>
      (cat === "Tous" || l.categorie === cat) &&
      `${l.titre} ${l.auteur}`.toLowerCase().includes(q.toLowerCase())
  );

  if (b === undefined) return <main className="p-6 text-sm">Chargement…</main>;
  if (b === null)
    return <main className="p-6">Boutique introuvable : <b>{slug}</b></main>;

  return (
    <main className="mx-auto max-w-5xl pb-16">
      <section className="rounded-b-[28px] bg-[#14213D] px-5 pb-8 pt-6 text-white md:px-10">
        <div className="flex items-center justify-between">
          <span className={`${sora} text-lg`}>{b.nom}</span>
          <a
            href={`https://wa.me/${b.whatsapp}`}
            className="flex h-11 items-center rounded-full border border-white/35 px-4 text-sm"
          >
            Contact
          </a>
        </div>
        <h1 className={`${sora} mt-8 max-w-xl text-3xl font-semibold leading-tight md:text-5xl`}>
          {b.accroche}
        </h1>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/80">
          Parcourez le catalogue et commandez en un message WhatsApp.
        </p>
        <a
          href="#catalogue"
          className="mt-5 flex h-[52px] items-center justify-center rounded-2xl bg-[#0B6E4F] font-semibold md:inline-flex md:px-8"
        >
          Parcourir le catalogue
        </a>
        <div className="mt-6 flex items-end gap-3">
          {livres.slice(0, 3).map((l) => (
            <Couverture key={l.id} titre={l.titre} className="h-[120px] w-[84px] !text-[10px]" />
          ))}
          <span className="text-[13px] text-white/80">{livres.length} titres en stock</span>
        </div>
      </section>

      <section id="catalogue" className="px-5 pt-6 md:px-10">
        <label htmlFor="q" className="text-[13px] text-[#5B6475]">Rechercher</label>
        <input
          id="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Titre, auteur…"
          className="mt-1 h-12 w-full rounded-xl border border-[#D9D6CC] bg-white px-4 md:max-w-md"
        />
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`h-11 shrink-0 rounded-full border px-4 text-sm font-medium ${
                cat === c ? "border-[#14213D] bg-[#14213D] text-white" : "border-[#D9D6CC] bg-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
                <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-4">
          {filtres.map((l, i) => (
            <Apparition key={l.id} delai={Math.min(i, 8) * 0.04}>
              <Link href={`/${slug}/livre/${l.id}`} className="block active:scale-[0.98] transition-transform">
                <Couverture titre={l.titre} className="h-48 w-full" />
                <div className="mt-2 text-sm font-semibold">{l.titre}</div>
                <div className="text-[13px] text-[#5B6475]">{l.auteur}</div>
                <div className="mt-0.5 font-semibold text-[#0B6E4F]">{fcfa(l.prix)}</div>
              </Link>
            </Apparition>
          ))}
        </div>
        {livres.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-[#D9D6CC] bg-white p-8 text-center">
            <p className="font-semibold">Le catalogue est vide pour l’instant</p>
            <p className="mt-1 text-sm text-[#5B6475]">Les premiers livres arrivent bientôt.</p>
          </div>
        ) : (
          filtres.length === 0 && (
            <p className="mt-8 text-sm text-[#5B6475]">Aucun livre ne correspond à ta recherche.</p>
          )
        )}
      </section>
    </main>
  );
}
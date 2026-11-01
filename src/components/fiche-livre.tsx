"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { repo } from "@/lib/repository";
import { seedDemo, DEMO_SLUG } from "@/lib/seed";
import { fcfa } from "@/lib/format";
import { lienCommande } from "@/lib/whatsapp";
import { Couverture } from "@/components/couverture";
import type { Boutique, Livre } from "@/lib/types";

const sora = "font-[family-name:var(--font-sora)]";

export function FicheLivre({ slug, id }: { slug: string; id: string }) {
  const [b, setB] = useState<Boutique | null>(null);
  const [livre, setLivre] = useState<Livre | null | undefined>(undefined);
  const [qte, setQte] = useState(1);

  useEffect(() => {
    (async () => {
      if (slug === DEMO_SLUG) await seedDemo();
      setB(await repo.getBoutique(slug));
      const livres = await repo.listLivres(slug);
      setLivre(livres.find((l) => l.id === id) ?? null);
    })();
  }, [slug, id]);

  if (livre === undefined) return <main className="p-6 text-sm">Chargement…</main>;
  if (livre === null || !b)
    return (
      <main className="p-6">
        Livre introuvable. <Link href={`/${slug}`} className="underline">Retour à la boutique</Link>
      </main>
    );

  const epuise = livre.stock === 0;

  return (
    <main className="mx-auto max-w-3xl pb-40 md:pb-16">
      <div className="bg-[#E9E6DC] px-5 pb-6 pt-4 md:rounded-b-[28px]">
        <Link href={`/${slug}`} className="flex h-11 items-center text-sm text-[#5B6475]">
          ← {b.nom}
        </Link>
        <div className="flex justify-center">
          <Couverture
            titre={livre.titre}
            className="h-[280px] w-[190px] !text-lg shadow-[0_16px_32px_rgba(20,33,61,.25)]"
          />
        </div>
      </div>

      <section className="px-5 pt-5 md:px-10">
        <h1 className={`${sora} text-2xl font-semibold`}>{livre.titre}</h1>
        <p className="mt-1 text-[13px] text-[#5B6475]">
          {livre.auteur} · {livre.categorie}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <span className={`${sora} text-[22px] font-semibold text-[#0B6E4F]`}>{fcfa(livre.prix)}</span>
          <span
            className={`rounded-xl px-2.5 py-1 text-xs font-semibold ${
              epuise ? "bg-[#F6DDD7] text-[#B4452E]" : "bg-[#DDF1E8] text-[#0B6E4F]"
            }`}
          >
            {epuise ? "Épuisé" : `En stock · ${livre.stock}`}
          </span>
        </div>
        {livre.description && (
          <p className="mt-4 text-sm leading-relaxed text-[#3C4658]">{livre.description}</p>
        )}
        {!epuise && (
          <div className="mt-5 flex items-center justify-between">
            <span className="font-semibold">Quantité</span>
            <div className="flex items-center gap-3">
              <button
                aria-label="Moins"
                onClick={() => setQte((q) => Math.max(1, q - 1))}
                className="h-11 w-11 rounded-full border border-[#D9D6CC] bg-white text-lg"
              >
                −
              </button>
              <span className="w-6 text-center font-semibold">{qte}</span>
              <button
                aria-label="Plus"
                onClick={() => setQte((q) => Math.min(livre.stock, q + 1))}
                className="h-11 w-11 rounded-full border border-[#D9D6CC] bg-white text-lg"
              >
                +
              </button>
            </div>
          </div>
        )}
      </section>

      <div className="fixed inset-x-0 bottom-0 border-t border-[#E7E4DA] bg-white px-5 pb-6 pt-4">
        <div className="mx-auto max-w-3xl">
          {epuise ? (
            <div className="flex h-[52px] items-center justify-center rounded-2xl bg-[#E7E4DA] font-semibold text-[#5B6475]">
              Indisponible
            </div>
          ) : (
            <a
              href={lienCommande(b.whatsapp, livre.titre, qte, livre.prix)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[52px] items-center justify-center rounded-2xl bg-[#0B6E4F] font-semibold text-white"
            >
              Commander sur WhatsApp · {fcfa(livre.prix * qte)}
            </a>
          )}
          <p className="mt-2 text-center text-[13px] text-[#5B6475]">
            Le message est prérempli avec le livre et la quantité
          </p>
        </div>
      </div>
    </main>
  );
}
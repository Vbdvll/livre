"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { repo } from "@/lib/repository";
import { seedDemo, DEMO_SLUG } from "@/lib/seed";
import { fcfa } from "@/lib/format";
import type { Boutique, Livre, Vente } from "@/lib/types";

const sora = "font-[family-name:var(--font-sora)]";
type Periode = "jour" | "semaine" | "mois";

function debutPeriode(p: Periode) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  if (p === "semaine") d.setDate(d.getDate() - 6);
  if (p === "mois") d.setDate(1);
  return d;
}

export function Dashboard({ slug }: { slug: string }) {
  const [b, setB] = useState<Boutique | null | undefined>(undefined);
  const [livres, setLivres] = useState<Livre[]>([]);
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [periode, setPeriode] = useState<Periode>("mois");

  useEffect(() => {
    (async () => {
      if (slug === DEMO_SLUG) await seedDemo();
      setB(await repo.getBoutique(slug));
      setLivres(await repo.listLivres(slug));
      setVentes(await repo.listVentes(slug));
    })();
  }, [slug]);

  const stats = useMemo(() => {
    const debut = debutPeriode(periode);
    const f = ventes.filter((v) => new Date(v.date) >= debut);
    const ca = f.reduce((s, v) => s + v.quantite * v.prixUnitaire, 0);
    const nbLivres = f.reduce((s, v) => s + v.quantite, 0);
    const parTitre = new Map<string, { q: number; ca: number }>();
    for (const v of f) {
      const e = parTitre.get(v.titre) ?? { q: 0, ca: 0 };
      parTitre.set(v.titre, { q: e.q + v.quantite, ca: e.ca + v.quantite * v.prixUnitaire });
    }
    const best = [...parTitre.entries()].sort((a, c) => c[1].q - a[1].q)[0];
    return { ca, nbVentes: f.length, nbLivres, best };
  }, [ventes, periode]);

  const stockBas = livres.filter((l) => l.stock <= 3).length;
  const libelle = { jour: "aujourd’hui", semaine: "7 derniers jours", mois: "ce mois" }[periode];

  if (b === undefined) return <p className="p-6 text-sm">Chargement…</p>;
  if (b === null) return <p className="p-6">Boutique introuvable : <b>{slug}</b></p>;

  return (
    <div>
      <header className="px-5 pb-2 pt-6">
        <p className="text-[13px] text-[#5B6475]">{b.nom}</p>
        <h1 className={`${sora} text-2xl font-semibold`}>Tableau de bord</h1>
      </header>

      <div className="flex gap-2 px-5 py-2">
        {(["jour", "semaine", "mois"] as Periode[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriode(p)}
            className={`h-11 rounded-full border px-4 text-sm font-medium capitalize ${
              periode === p ? "border-[#14213D] bg-[#14213D] text-white" : "border-[#D9D6CC] bg-white"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <section className="px-5 py-2">
        <div className="rounded-2xl bg-[#14213D] p-4 text-white">
          <p className="text-[13px] opacity-75">Chiffre d’affaires · {libelle}</p>
          <p className={`${sora} mt-1.5 text-3xl font-semibold`}>{fcfa(stats.ca)}</p>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-2.5 px-5 py-1">
        {[
          { v: stats.nbVentes, l: "Ventes", c: "" },
          { v: stats.nbLivres, l: "Livres", c: "" },
          { v: stockBas, l: "Stock bas", c: "text-[#B4452E]" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl bg-white p-3.5 shadow-sm">
            <div className={`${sora} text-xl font-semibold ${s.c}`}>{s.v}</div>
            <div className="text-[13px] text-[#5B6475]">{s.l}</div>
          </div>
        ))}
      </section>

      {stats.best && (
        <section className="px-5 py-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-[13px] text-[#5B6475]">Meilleure vente · {libelle}</p>
            <p className="mt-1 font-semibold">{stats.best[0]}</p>
            <p className="text-[13px] text-[#5B6475]">
              {stats.best[1].q} exemplaire(s) · {fcfa(stats.best[1].ca)}
            </p>
          </div>
        </section>
      )}

      <section className="px-5 pt-2">
        <h2 className="mb-2 font-semibold">Dernières ventes</h2>
        <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm">
          {ventes.length === 0 && (
            <p className="text-sm text-[#5B6475]">Aucune vente enregistrée pour l’instant.</p>
          )}
          {ventes.slice(0, 6).map((v) => (
            <div key={v.id} className="flex items-center justify-between gap-3 text-sm">
              <div>
                <div>{v.titre} ×{v.quantite}</div>
                <div className="text-xs text-[#5B6475]">
                  {new Date(v.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                  {v.client ? ` · ${v.client}` : ""}
                </div>
              </div>
              <b>{fcfa(v.quantite * v.prixUnitaire)}</b>
            </div>
          ))}
        </div>
      </section>

      <Link
        href={`/${slug}/admin/vente`}
        className="fixed bottom-24 right-5 flex h-[52px] items-center rounded-full bg-[#0B6E4F] px-5 font-semibold text-white shadow-[0_8px_24px_rgba(11,110,79,.35)]"
      >
        + Vente
      </Link>
    </div>
  );
}
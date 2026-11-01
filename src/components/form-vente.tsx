"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { repo } from "@/lib/repository";
import { seedDemo, DEMO_SLUG } from "@/lib/seed";
import { fcfa } from "@/lib/format";
import type { Livre, Paiement } from "@/lib/types";

const sora = "font-[family-name:var(--font-sora)]";
const champ = "mt-1 h-12 w-full rounded-xl border border-[#D9D6CC] bg-white px-3.5 text-[15px]";
const PAIEMENTS: { id: Paiement; label: string }[] = [
  { id: "especes", label: "Espèces" },
  { id: "wave", label: "Wave" },
  { id: "orange_money", label: "Orange Money" },
];

export function FormVente({ slug }: { slug: string }) {
  const router = useRouter();
  const [livres, setLivres] = useState<Livre[]>([]);
  const [livreId, setLivreId] = useState("");
  const [qte, setQte] = useState("1");
  const [prix, setPrix] = useState("");
  const [client, setClient] = useState("");
  const [paiement, setPaiement] = useState<Paiement>("especes");

  useEffect(() => {
    (async () => {
      if (slug === DEMO_SLUG) await seedDemo();
      setLivres(await repo.listLivres(slug));
    })();
  }, [slug]);

  const livre = livres.find((l) => l.id === livreId);
  const q = Number(qte) || 0;
  const p = Number(prix) || 0;
  const valide = !!livre && q >= 1 && p >= 0;

  function choisir(id: string) {
    setLivreId(id);
    const l = livres.find((x) => x.id === id);
    if (l) setPrix(String(l.prix));
  }

  async function enregistrer() {
    if (!livre || !valide) return;
    await repo.addVente({
      id: crypto.randomUUID(),
      boutique: slug,
      livreId: livre.id,
      titre: livre.titre,
      quantite: q,
      prixUnitaire: p,
      paiement,
      client: client.trim() || undefined,
      date: new Date().toISOString(),
    });
    router.push(`/${slug}/admin`);
  }

  return (
    <div className="px-5 pt-6">
      <h1 className={`${sora} text-2xl font-semibold`}>Enregistrer une vente</h1>
      <p className="mt-1 text-[13px] text-[#5B6475]">Une vente, tout simplement</p>

      <div className="mt-5 flex flex-col gap-4">
        <div>
          <label htmlFor="livre" className="text-[13px] text-[#5B6475]">Livre</label>
          <select id="livre" value={livreId} onChange={(e) => choisir(e.target.value)} className={champ}>
            <option value="">Choisir un livre…</option>
            {livres.map((l) => (
              <option key={l.id} value={l.id}>{l.titre} (stock {l.stock})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="qte" className="text-[13px] text-[#5B6475]">Quantité</label>
            <input id="qte" type="number" inputMode="numeric" min={1} value={qte}
              onChange={(e) => setQte(e.target.value)} className={champ} />
          </div>
          <div>
            <label htmlFor="prix" className="text-[13px] text-[#5B6475]">Prix unitaire (FCFA)</label>
            <input id="prix" type="number" inputMode="numeric" min={0} value={prix}
              onChange={(e) => setPrix(e.target.value)} className={champ} />
          </div>
        </div>

        <div>
          <label htmlFor="client" className="text-[13px] text-[#5B6475]">Client (optionnel)</label>
          <input id="client" value={client} onChange={(e) => setClient(e.target.value)}
            placeholder="Nom ou numéro" className={champ} />
        </div>

        <div>
          <p className="mb-1.5 text-[13px] text-[#5B6475]">Paiement</p>
          <div className="flex flex-wrap gap-2">
            {PAIEMENTS.map((x) => (
              <button key={x.id} type="button" onClick={() => setPaiement(x.id)}
                className={`h-11 rounded-full border px-4 text-sm font-medium ${
                  paiement === x.id ? "border-[#14213D] bg-[#14213D] text-white" : "border-[#D9D6CC] bg-white"
                }`}>
                {x.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
          <span className="text-[13px] text-[#5B6475]">Total</span>
          <span className={`${sora} text-[22px] font-semibold`}>{fcfa(q * p)}</span>
        </div>

        <button onClick={enregistrer} disabled={!valide}
          className="flex h-[52px] w-full items-center justify-center rounded-2xl bg-[#0B6E4F] font-semibold text-white disabled:bg-[#B9C9C2]">
          Enregistrer la vente
        </button>
      </div>
    </div>
  );
}
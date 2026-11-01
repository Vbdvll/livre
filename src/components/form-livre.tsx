"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { repo } from "@/lib/repository";
import { seedDemo, DEMO_SLUG } from "@/lib/seed";
import type { Livre } from "@/lib/types";

const sora = "font-[family-name:var(--font-sora)]";
const champ = "mt-1 h-12 w-full rounded-xl border border-[#D9D6CC] bg-white px-3.5 text-[15px]";

export function FormLivre({ slug, id }: { slug: string; id: string }) {
  const router = useRouter();
  const nouveau = id === "nouveau";
  const [pret, setPret] = useState(nouveau);
  const [introuvable, setIntrouvable] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [titre, setTitre] = useState("");
  const [auteur, setAuteur] = useState("");
  const [categorie, setCategorie] = useState("");
  const [prix, setPrix] = useState("");
  const [stock, setStock] = useState("1");
  const [description, setDescription] = useState("");

  useEffect(() => {
    (async () => {
      if (slug === DEMO_SLUG) await seedDemo();
      const livres = await repo.listLivres(slug);
      setCategories(Array.from(new Set(livres.map((l) => l.categorie))));
      if (nouveau) return;
      const l = livres.find((x) => x.id === id);
      if (!l) return setIntrouvable(true);
      setTitre(l.titre);
      setAuteur(l.auteur);
      setCategorie(l.categorie);
      setPrix(String(l.prix));
      setStock(String(l.stock));
      setDescription(l.description);
      setPret(true);
    })();
  }, [slug, id, nouveau]);

  const valide = titre.trim() !== "" && Number(prix) >= 0 && prix !== "" && Number(stock) >= 0;

  async function enregistrer() {
    if (!valide) return;
    const livre: Livre = {
      id: nouveau ? crypto.randomUUID() : id,
      boutique: slug,
      titre: titre.trim(),
      auteur: auteur.trim(),
      categorie: categorie.trim() || "Autres",
      prix: Number(prix),
      stock: Math.floor(Number(stock)),
      description: description.trim(),
    };
    await repo.saveLivre(livre);
    router.push(`/${slug}/admin/livres`);
  }

  async function supprimer() {
    if (!window.confirm("Supprimer ce livre ? Les ventes déjà enregistrées sont conservées.")) return;
    await repo.deleteLivre(slug, id);
    router.push(`/${slug}/admin/livres`);
  }

  if (introuvable) return <p className="p-6">Livre introuvable.</p>;
  if (!pret) return <p className="p-6 text-sm">Chargement…</p>;

  return (
    <div className="px-5 pt-6">
      <h1 className={`${sora} text-2xl font-semibold`}>{nouveau ? "Ajouter un livre" : "Modifier le livre"}</h1>

      <div className="mt-5 flex flex-col gap-4">
        <div>
          <label htmlFor="titre" className="text-[13px] text-[#5B6475]">Titre</label>
          <input id="titre" value={titre} onChange={(e) => setTitre(e.target.value)} className={champ} />
        </div>
        <div>
          <label htmlFor="auteur" className="text-[13px] text-[#5B6475]">Auteur</label>
          <input id="auteur" value={auteur} onChange={(e) => setAuteur(e.target.value)} className={champ} />
        </div>
        <div>
          <label htmlFor="cat" className="text-[13px] text-[#5B6475]">Catégorie</label>
          <input id="cat" list="cats" value={categorie} onChange={(e) => setCategorie(e.target.value)}
            placeholder="Romans, Scolaire…" className={champ} />
          <datalist id="cats">
            {categories.map((c) => <option key={c} value={c} />)}
          </datalist>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="prix" className="text-[13px] text-[#5B6475]">Prix (FCFA)</label>
            <input id="prix" type="number" inputMode="numeric" min={0} value={prix}
              onChange={(e) => setPrix(e.target.value)} className={champ} />
          </div>
          <div>
            <label htmlFor="stock" className="text-[13px] text-[#5B6475]">Stock</label>
            <input id="stock" type="number" inputMode="numeric" min={0} value={stock}
              onChange={(e) => setStock(e.target.value)} className={champ} />
          </div>
        </div>
        <div>
          <label htmlFor="desc" className="text-[13px] text-[#5B6475]">Description (optionnel)</label>
          <textarea id="desc" rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#D9D6CC] bg-white p-3.5 text-[15px]" />
        </div>

        <button onClick={enregistrer} disabled={!valide}
          className="flex h-[52px] w-full items-center justify-center rounded-2xl bg-[#0B6E4F] font-semibold text-white disabled:bg-[#B9C9C2]">
          {nouveau ? "Ajouter au catalogue" : "Enregistrer les modifications"}
        </button>
        {!nouveau && (
          <button onClick={supprimer}
            className="flex h-12 w-full items-center justify-center rounded-2xl border border-[#E8C4BB] bg-white font-semibold text-[#B4452E]">
            Supprimer ce livre
          </button>
        )}
      </div>
    </div>
  );
}
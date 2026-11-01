import { repo } from "./repository";

export const DEMO_SLUG = "teranga-livres";

export async function seedDemo() {
  if (await repo.getBoutique(DEMO_SLUG)) return;
  await repo.saveBoutique({
    slug: DEMO_SLUG,
    nom: "Teranga Livres",
    whatsapp: "221770000000",
    accroche: "Des livres qui vous ressemblent, livrés chez vous.",
  });
  const base = { boutique: DEMO_SLUG, description: "" };
  const livres = [
    { titre: "Les Soleils des indépendances", auteur: "A. Kourouma", prix: 6500, stock: 8, categorie: "Romans" },
    { titre: "Une si longue lettre", auteur: "M. Bâ", prix: 5000, stock: 12, categorie: "Romans" },
    { titre: "L’Aventure ambiguë", auteur: "C. H. Kane", prix: 5500, stock: 3, categorie: "Romans" },
    { titre: "Le Devoir de violence", auteur: "Y. Ouologuem", prix: 7000, stock: 5, categorie: "Romans" },
  ];
  for (const l of livres) {
    await repo.saveLivre({ ...base, ...l, id: crypto.randomUUID() });
  }
}
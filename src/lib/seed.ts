import { repo } from "./repository";
import type { Livre } from "./types";

export const DEMO_SLUG = "teranga-livres";
const NUMERO_WHATSAPP = "221703117113"; // remplace par ton numéro

type LivreDemo = Omit<Livre, "boutique" | "couverture">;

const LIVRES_DEMO: LivreDemo[] = [
  { id: "demo-atomic-habits", titre: "Atomic Habits", auteur: "James Clear", prix: 9500, stock: 14, categorie: "Développement personnel", description: "Une méthode concrète pour construire de bonnes habitudes et se défaire des mauvaises, par petits changements quotidiens." },
  { id: "demo-pere-riche", titre: "Père riche, père pauvre", auteur: "Robert Kiyosaki", prix: 8000, stock: 9, categorie: "Argent", description: "Deux visions de l’argent pour comprendre la différence entre travailler pour l’argent et le faire travailler pour soi." },
  { id: "demo-art-subtil", titre: "L’art subtil de s’en foutre", auteur: "Mark Manson", prix: 9000, stock: 6, categorie: "Développement personnel", description: "Un regard direct sur ce qui compte vraiment : choisir ses combats et accepter ses limites." },
  { id: "demo-7-habitudes", titre: "Les 7 habitudes de ceux qui réalisent tout ce qu’ils entreprennent", auteur: "Stephen R. Covey", prix: 10500, stock: 4, categorie: "Développement personnel", description: "Un classique sur l’efficacité personnelle et professionnelle, fondé sur sept principes simples." },
  { id: "demo-devenez-riche", titre: "Réfléchissez et devenez riche", auteur: "Napoleon Hill", prix: 7500, stock: 11, categorie: "Argent", description: "Les principes de la réussite financière et de l’état d’esprit, tirés de l’étude de grands entrepreneurs." },
  { id: "demo-moment-present", titre: "Le pouvoir du moment présent", auteur: "Eckhart Tolle", prix: 8500, stock: 2, categorie: "Développement personnel", description: "Un guide pour vivre l’instant présent et apaiser le flot des pensées." },
  { id: "demo-48-lois", titre: "Les 48 lois du pouvoir", auteur: "Robert Greene", prix: 12000, stock: 7, categorie: "Leadership", description: "Une étude des mécanismes du pouvoir à travers l’histoire, loi par loi." },
  { id: "demo-se-faire-des-amis", titre: "Comment se faire des amis", auteur: "Dale Carnegie", prix: 7000, stock: 10, categorie: "Leadership", description: "Les bases de la communication et de l’influence positive sur les autres." },
  { id: "demo-psychologie-argent", titre: "La psychologie de l’argent", auteur: "Morgan Housel", prix: 9500, stock: 5, categorie: "Argent", description: "Pourquoi nos comportements comptent plus que nos connaissances quand on parle d’argent." },
];

async function chercherCouverture(titre: string, auteur: string): Promise<string | undefined> {
  try {
    const res = await fetch(
      `/api/couvertures?titre=${encodeURIComponent(titre)}&auteur=${encodeURIComponent(auteur)}`
    );
    if (!res.ok) return undefined;
    const data = await res.json();
    return data.resultats?.[0]?.couverture;
  } catch {
    return undefined;
  }
}

let enCours: Promise<void> | null = null;

export function seedDemo(): Promise<void> {
  enCours ??= (async () => {
    if (await repo.getBoutique(DEMO_SLUG)) return;

    const couvertures = await Promise.all(
      LIVRES_DEMO.map((l) => chercherCouverture(l.titre, l.auteur))
    );
    for (let i = 0; i < LIVRES_DEMO.length; i++) {
      await repo.saveLivre({ ...LIVRES_DEMO[i], boutique: DEMO_SLUG, couverture: couvertures[i] });
    }
    await repo.saveBoutique({
      slug: DEMO_SLUG,
      nom: "Teranga Livres",
      whatsapp: NUMERO_WHATSAPP,
      accroche: "Des livres qui vous ressemblent, livrés chez vous.",
    });
  })();
  return enCours;
}
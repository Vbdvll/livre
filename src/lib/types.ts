export type Boutique = {
  slug: string;
  nom: string;
  whatsapp: string; // format international sans +, ex: 221770000000
  accroche: string;
};

export type Livre = {
  id: string;
  boutique: string;
  titre: string;
  auteur: string;
  prix: number; // FCFA
  stock: number;
  categorie: string;
  description: string;
};

export type Paiement = "especes" | "wave" | "orange_money";

export type Vente = {
  id: string;
  boutique: string;
  livreId: string;
  titre: string;
  quantite: number;
  prixUnitaire: number;
  paiement: Paiement;
  client?: string;
  date: string; // ISO
};
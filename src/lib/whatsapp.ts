import { fcfa } from "./format";

export function lienCommande(numero: string, titre: string, quantite: number, prix: number) {
  const texte =
    `Bonjour, je souhaite commander :\n` +
    `${quantite} × ${titre} (${fcfa(prix)} l'unité)\n` +
    `Total : ${fcfa(prix * quantite)}`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(texte)}`;
}
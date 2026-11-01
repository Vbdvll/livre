export const fcfa = (n: number) => `${n.toLocaleString("fr-FR")} FCFA`;
export const ADRESSES_RESERVEES = ["creer", "admin", "test", "api"];

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normaliserWhatsapp(s: string) {
  let d = s.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.length === 9 && d.startsWith("7")) d = "221" + d; // numéro sénégalais sans indicatif
  return d;
}
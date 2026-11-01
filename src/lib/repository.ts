import type { Boutique, Livre, Vente } from "./types";

export interface Repository {
  getBoutique(slug: string): Promise<Boutique | null>;
  saveBoutique(b: Boutique): Promise<void>;
  listLivres(slug: string): Promise<Livre[]>;
  saveLivre(l: Livre): Promise<void>;
  deleteLivre(slug: string, id: string): Promise<void>;
  listVentes(slug: string): Promise<Vente[]>;
  addVente(v: Vente): Promise<void>; // décrémente aussi le stock
}

const key = (slug: string, name: string) => `livre:${slug}:${name}`;

function read<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(k: string, value: T) {
  localStorage.setItem(k, JSON.stringify(value));
}

export const repo: Repository = {
  async getBoutique(slug) {
    return read<Boutique | null>(key(slug, "boutique"), null);
  },
  async saveBoutique(b) {
    write(key(b.slug, "boutique"), b);
  },
  async listLivres(slug) {
    return read<Livre[]>(key(slug, "livres"), []);
  },
  async saveLivre(l) {
    const all = await this.listLivres(l.boutique);
    const i = all.findIndex((x) => x.id === l.id);
    if (i >= 0) all[i] = l;
    else all.push(l);
    write(key(l.boutique, "livres"), all);
  },
  async deleteLivre(slug, id) {
    const all = await this.listLivres(slug);
    write(key(slug, "livres"), all.filter((x) => x.id !== id));
  },
  async listVentes(slug) {
    return read<Vente[]>(key(slug, "ventes"), []);
  },
  async addVente(v) {
    const ventes = await this.listVentes(v.boutique);
    write(key(v.boutique, "ventes"), [v, ...ventes]);
    const livres = await this.listLivres(v.boutique);
    const l = livres.find((x) => x.id === v.livreId);
    if (l) {
      l.stock = Math.max(0, l.stock - v.quantite);
      await this.saveLivre(l);
    }
  },
};
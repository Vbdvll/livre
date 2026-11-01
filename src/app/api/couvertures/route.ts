import { NextResponse } from "next/server";

type Item = {
  id: string;
  volumeInfo?: {
    title?: string;
    authors?: string[];
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const titre = searchParams.get("titre")?.trim() ?? "";
  const auteur = searchParams.get("auteur")?.trim() ?? "";
  if (!titre) return NextResponse.json({ resultats: [] });

  const params = new URLSearchParams({
    q: `intitle:${titre}${auteur ? ` inauthor:${auteur}` : ""}`,
    maxResults: "10",
    printType: "books",
  });
  if (process.env.GOOGLE_BOOKS_API_KEY) params.set("key", process.env.GOOGLE_BOOKS_API_KEY);

  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?${params}`);
  if (!res.ok) {
    return NextResponse.json({ resultats: [], erreur: `Google Books ${res.status}` }, { status: 502 });
  }

  const data = (await res.json()) as { items?: Item[] };
  const vus = new Set<string>();
  const resultats = (data.items ?? [])
    .map((it) => {
      const img = it.volumeInfo?.imageLinks?.thumbnail ?? it.volumeInfo?.imageLinks?.smallThumbnail;
      return {
        id: it.id,
        titre: it.volumeInfo?.title ?? "",
        auteurs: it.volumeInfo?.authors?.join(", ") ?? "",
        couverture: img?.replace("http://", "https://").replace("&edge=curl", ""),
      };
    })
    .filter((r) => r.couverture && !vus.has(r.couverture) && vus.add(r.couverture))
    .slice(0, 6);

  return NextResponse.json({ resultats });
}
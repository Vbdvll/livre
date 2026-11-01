import { Suspense } from "react";
import type { Metadata } from "next";
import { Vitrine } from "@/components/vitrine";

type Props = { params: Promise<{ boutique: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { boutique } = await params;
  const nom = boutique.replace(/-/g, " ");
  return { title: `${nom} · Livres`, description: `Catalogue de ${nom}, commande par WhatsApp.` };
}

async function Contenu({ params }: Props) {
  const { boutique } = await params;
  return <Vitrine slug={boutique} />;
}

export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<main className="p-6 text-sm">Chargement…</main>}>
      <Contenu params={params} />
    </Suspense>
  );
}
import { Suspense } from "react";
import type { Metadata } from "next";
import { FicheLivre } from "@/components/fiche-livre";

type Props = { params: Promise<{ boutique: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { boutique } = await params;
  return { title: `Fiche livre · ${boutique.replace(/-/g, " ")}` };
}

async function Contenu({ params }: Props) {
  const { boutique, id } = await params;
  return <FicheLivre slug={boutique} id={id} />;
}

export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<main className="p-6 text-sm">Chargement…</main>}>
      <Contenu params={params} />
    </Suspense>
  );
}
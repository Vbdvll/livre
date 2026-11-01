import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminShell } from "@/components/admin-shell";
import { ListeLivres } from "@/components/liste-livres";

type Props = { params: Promise<{ boutique: string }> };

export const metadata: Metadata = { title: "Mes livres", robots: { index: false } };

async function Contenu({ params }: Props) {
  const { boutique } = await params;
  return (
    <AdminShell slug={boutique}>
      <ListeLivres slug={boutique} />
    </AdminShell>
  );
}

export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<main className="p-6 text-sm">Chargement…</main>}>
      <Contenu params={params} />
    </Suspense>
  );
}
import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminShell } from "@/components/admin-shell";
import { FormBoutique } from "@/components/form-boutique";

type Props = { params: Promise<{ boutique: string }> };

export const metadata: Metadata = { title: "Réglages", robots: { index: false } };

async function Contenu({ params }: Props) {
  const { boutique } = await params;
  return (
    <AdminShell slug={boutique}>
      <FormBoutique slug={boutique} />
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
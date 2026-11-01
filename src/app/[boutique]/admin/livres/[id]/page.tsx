import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminShell } from "@/components/admin-shell";
import { FormLivre } from "@/components/form-livre";

type Props = { params: Promise<{ boutique: string; id: string }> };

export const metadata: Metadata = { title: "Livre", robots: { index: false } };

async function Contenu({ params }: Props) {
  const { boutique, id } = await params;
  return (
    <AdminShell slug={boutique}>
      <FormLivre slug={boutique} id={id} />
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
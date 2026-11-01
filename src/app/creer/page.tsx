import type { Metadata } from "next";
import { FormBoutique } from "@/components/form-boutique";

export const metadata: Metadata = { title: "Créer ma boutique" };

export default function Page() {
  return (
    <main className="mx-auto max-w-2xl pb-12">
      <FormBoutique />
    </main>
  );
}
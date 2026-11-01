import Link from "next/link";

const sora = "font-[family-name:var(--font-sora)]";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-12">
      <p className="text-sm text-[#5B6475]">Pour les vendeurs de livres</p>
      <h1 className={`${sora} mt-3 text-4xl font-semibold leading-tight md:text-5xl`}>
        Votre librairie en ligne, commandes directes sur WhatsApp.
      </h1>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#3C4658]">
        Affichez vos livres, recevez les commandes dans votre WhatsApp et suivez vos ventes,
        même celles faites ailleurs.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/creer"
          className="flex h-[52px] items-center justify-center rounded-2xl bg-[#0B6E4F] px-8 font-semibold text-white">
          Créer ma boutique
        </Link>
        <Link href="/teranga-livres"
          className="flex h-[52px] items-center justify-center rounded-2xl border border-[#D9D6CC] bg-white px-8 font-semibold">
          Voir la démo
        </Link>
      </div>
    </main>
  );
}
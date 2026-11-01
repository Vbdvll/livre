"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { repo } from "@/lib/repository";
import { seedDemo, DEMO_SLUG } from "@/lib/seed";
import { ADRESSES_RESERVEES, normaliserWhatsapp, slugify } from "@/lib/format";

const sora = "font-[family-name:var(--font-sora)]";
const champ = "mt-1 h-12 w-full rounded-xl border border-[#D9D6CC] bg-white px-3.5 text-[15px]";

export function FormBoutique({ slug: slugExistant }: { slug?: string }) {
  const router = useRouter();
  const edition = !!slugExistant;
  const [pret, setPret] = useState(!edition);
  const [nom, setNom] = useState("");
  const [slug, setSlug] = useState(slugExistant ?? "");
  const [slugModifie, setSlugModifie] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");
  const [accroche, setAccroche] = useState("Des livres qui vous ressemblent, livrés chez vous.");
  const [erreur, setErreur] = useState("");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!slugExistant) return;
    (async () => {
      if (slugExistant === DEMO_SLUG) await seedDemo();
      const b = await repo.getBoutique(slugExistant);
      if (b) {
        setNom(b.nom);
        setWhatsapp(b.whatsapp);
        setAccroche(b.accroche);
      }
      setPret(true);
    })();
  }, [slugExistant]);

  const numero = normaliserWhatsapp(whatsapp);
  const slugValide = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) && !ADRESSES_RESERVEES.includes(slug);
  const valide = nom.trim() !== "" && slugValide && numero.length >= 11 && numero.length <= 15;

  async function enregistrer() {
    if (!valide) return;
    setErreur("");
    if (!edition && (await repo.getBoutique(slug))) {
      setErreur("Cette adresse est déjà prise sur cet appareil. Choisis-en une autre.");
      return;
    }
    await repo.saveBoutique({ slug, nom: nom.trim(), whatsapp: numero, accroche: accroche.trim() });
    if (edition) {
      setOk(true);
      setWhatsapp(numero);
    } else {
      router.push(`/${slug}/admin`);
    }
  }

  if (!pret) return <p className="p-6 text-sm">Chargement…</p>;

  return (
    <div className="px-5 pt-6">
      <h1 className={`${sora} text-2xl font-semibold`}>{edition ? "Réglages de la boutique" : "Créer ma boutique"}</h1>

      <div className="mt-5 flex flex-col gap-4">
        <div>
          <label htmlFor="nom" className="text-[13px] text-[#5B6475]">Nom de la boutique</label>
          <input id="nom" value={nom}
            onChange={(e) => {
              setNom(e.target.value);
              if (!edition && !slugModifie) setSlug(slugify(e.target.value));
            }}
            className={champ} />
        </div>

        <div>
          <label htmlFor="slug" className="text-[13px] text-[#5B6475]">Adresse de la boutique</label>
          <div className="mt-1 flex items-center gap-1 text-sm text-[#5B6475]">
            <span>/</span>
            <input id="slug" value={slug} disabled={edition}
              onChange={(e) => { setSlug(slugify(e.target.value)); setSlugModifie(true); }}
              className="h-12 w-full rounded-xl border border-[#D9D6CC] bg-white px-3.5 text-[15px] text-[#14213D] disabled:bg-[#EFEDE6]" />
          </div>
          {!edition && slug !== "" && !slugValide && (
            <p className="mt-1 text-xs text-[#B4452E]">Adresse non disponible : lettres, chiffres et tirets uniquement.</p>
          )}
          {edition && <p className="mt-1 text-xs text-[#5B6475]">L’adresse ne peut pas être modifiée.</p>}
        </div>

        <div>
          <label htmlFor="wa" className="text-[13px] text-[#5B6475]">Numéro WhatsApp</label>
          <input id="wa" type="tel" inputMode="tel" value={whatsapp} placeholder="77 123 45 67"
            onChange={(e) => setWhatsapp(e.target.value)} className={champ} />
          <p className="mt-1 text-xs text-[#5B6475]">Les numéros sénégalais à 9 chiffres reçoivent l’indicatif 221 automatiquement.</p>
        </div>

        <div>
          <label htmlFor="acc" className="text-[13px] text-[#5B6475]">Phrase d’accroche</label>
          <textarea id="acc" rows={3} value={accroche} onChange={(e) => setAccroche(e.target.value)}
            className="mt-1 w-full rounded-xl border border-[#D9D6CC] bg-white p-3.5 text-[15px]" />
        </div>

        {erreur && <p className="text-sm text-[#B4452E]">{erreur}</p>}
        {ok && <p className="text-sm text-[#0B6E4F]">Réglages enregistrés.</p>}

        <button onClick={enregistrer} disabled={!valide}
          className="flex h-[52px] w-full items-center justify-center rounded-2xl bg-[#0B6E4F] font-semibold text-white disabled:bg-[#B9C9C2]">
          {edition ? "Enregistrer" : "Créer ma boutique"}
        </button>
      </div>
    </div>
  );
}
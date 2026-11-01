"use client";
import { useState } from "react";

const COULEURS = ["#14213D", "#8A4B2D", "#0B6E4F", "#5B3E7A", "#9A6B1F"];

export function Couverture({ titre, url, className = "" }: { titre: string; url?: string; className?: string }) {
  const [urlEnErreur, setUrlEnErreur] = useState<string | null>(null);
  const bg = COULEURS[titre.length % COULEURS.length];

  if (url && url !== urlEnErreur) {
    return (
      <img
        src={url}
        alt={`Couverture : ${titre}`}
        loading="lazy"
        onError={() => setUrlEnErreur(url)}
        className={`rounded-lg object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-end rounded-lg p-3 text-[13px] font-bold leading-tight text-white font-[family-name:var(--font-sora)] ${className}`}
      style={{ background: bg }}
    >
      {titre}
    </div>
  );
}
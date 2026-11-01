const COULEURS = ["#14213D", "#8A4B2D", "#0B6E4F", "#5B3E7A", "#9A6B1F"];

export function Couverture({ titre, className = "" }: { titre: string; className?: string }) {
  const bg = COULEURS[titre.length % COULEURS.length];
  return (
    <div
      className={`flex items-end rounded-lg p-3 text-[13px] font-bold leading-tight text-white font-[family-name:var(--font-sora)] ${className}`}
      style={{ background: bg }}
    >
      {titre}
    </div>
  );
}
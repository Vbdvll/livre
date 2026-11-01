import { ImageResponse } from "next/og";

export function iconeReponse(taille: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#14213D",
          color: "#ffffff",
          fontSize: taille * 0.55,
          fontWeight: 700,
        }}
      >
        L
      </div>
    ),
    { width: taille, height: taille }
  );
}
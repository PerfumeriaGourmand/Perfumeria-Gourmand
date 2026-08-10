import { ImageResponse } from "next/og";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };
export const OG_IMAGE_CONTENT_TYPE = "image/png";

export function renderSiteOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: 12,
            color: "#c9a34e",
          }}
        >
          GOURMAND
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            letterSpacing: 2,
            color: "#e8e3da",
          }}
        >
          Perfumería de nicho, árabe y diseñador
        </div>
      </div>
    ),
    { ...OG_IMAGE_SIZE }
  );
}

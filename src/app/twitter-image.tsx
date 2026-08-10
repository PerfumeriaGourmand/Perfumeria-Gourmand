import { OG_IMAGE_SIZE, OG_IMAGE_CONTENT_TYPE, renderSiteOgImage } from "@/lib/og-image";

export const size = OG_IMAGE_SIZE;
export const contentType = OG_IMAGE_CONTENT_TYPE;

export default function Image() {
  return renderSiteOgImage();
}

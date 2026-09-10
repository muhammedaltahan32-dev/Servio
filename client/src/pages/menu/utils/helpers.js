import { normalizeImageUrl } from "@utils";

export const normalizeImage = (value) => {
  const image = value || "";
  if (!image) return "";
  return normalizeImageUrl(image);
};

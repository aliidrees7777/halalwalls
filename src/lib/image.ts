/**
 * Browser-side image compression for profile avatar/banner uploads.
 *
 * Interim approach (Option A): resize + JPEG-compress the picked image in the
 * browser and return a small data URL, kept well under the backend's body limit.
 * When the Hostinger upload pipeline lands, this is swapped for a real file
 * upload that returns a hosted URL — the calling component shape stays the same.
 */
export async function compressImageToDataUrl(
  file: File,
  maxDim: number,
  quality = 0.82,
): Promise<string> {
  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read the image file."));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new window.Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("Could not load the image."));
    i.src = rawDataUrl;
  });

  let { width, height } = img;
  if (Math.max(width, height) > maxDim) {
    const scale = maxDim / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return rawDataUrl; // fall back to the raw read if canvas is unavailable

  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
}

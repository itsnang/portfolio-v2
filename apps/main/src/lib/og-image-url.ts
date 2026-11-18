export function toOgImageUrl(url: string): string {
  if (!url.includes("res.cloudinary.com")) return url;
  return url.replace(/\/upload\//, "/upload/w_1200,h_630,c_fill,g_face/");
}

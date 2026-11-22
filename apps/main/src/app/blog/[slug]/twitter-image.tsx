// X/Twitter cards reuse the same generated wireframe card as OpenGraph.
// Without this file the post would inherit the site-wide twitter:image
// (/cover.jpg) from the root metadata instead of its own card.
export { default, alt, size, contentType } from "./opengraph-image";

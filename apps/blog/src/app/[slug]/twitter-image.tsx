// X/Twitter cards reuse the same generated wireframe card as OpenGraph.
// Without this file the Post would inherit the Site's own twitter-image
// (the Post list's card) instead of its own.
export { default, alt, size, contentType } from "./opengraph-image";

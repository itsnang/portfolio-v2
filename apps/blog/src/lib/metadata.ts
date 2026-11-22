import "server-only";

import type { Metadata } from "next";
import { blogUrl, mainUrl } from "./site-urls";

export const AUTHOR = "Lorn Samnang";
export const SITE_NAME = `${AUTHOR}'s Blog`;
export const BLOG_DESCRIPTION =
  "Write-ups on things I build, break, and learn — mostly software, sometimes not.";

/** A page on this Site, as an absolute URL. */
export const blogPageUrl = (path = "/") => new URL(path, blogUrl).toString();

/** A Post's canonical URL: Posts live at the root of the Blog Site. */
export const postUrl = (slug: string) => blogPageUrl(`/${encodeURIComponent(slug)}`);

/** The author's home, which is the Main Site. */
export const authorUrl = mainUrl;

/** Defaults for every page; pages override title, description and URLs. */
export const siteMetadata: Metadata = {
  metadataBase: new URL(blogUrl),
  title: { default: `Blog | ${AUTHOR}`, template: `%s | ${AUTHOR}` },
  description: BLOG_DESCRIPTION,
  authors: [{ name: AUTHOR, url: authorUrl }],
  creator: AUTHOR,
  publisher: AUTHOR,
  // Kept out of search results until step 8 of the cutover, when the Blog
  // Site replaces the Main Site's /blog. robots.txt still allows crawling,
  // so crawlers can see this.
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@lornsamnang",
  },
  category: "technology",
};

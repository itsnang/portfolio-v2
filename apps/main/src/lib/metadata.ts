import { Metadata } from 'next';
import { mainUrl } from './site-urls';

interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string[];
  imageUrl?: string;
}

export const buildMetadata = ({
  title = 'Lorn Samnang | Software Developer',
  description = 'Discover the portfolio of Lorn Samnang, a passionate software developer creating innovative and meaningful digital experiences. Explore projects, skills, and professional journey.',
  keywords = [
    'Lorn Samnang',
    'Software Developer',
    'Web Development',
    'Frontend Developer',
    'React Developer',
    'Next.js Developer',
    'Portfolio',
    'Full Stack Developer',
    'Tech Portfolio',
    'Developer Portfolio',
    'Software Engineer',
  ],
  imageUrl = '/cover.jpg',
}: SeoProps): Metadata => {
  return {
    metadataBase: new URL(mainUrl),
    title: { default: title, template: `%s | Lorn Samnang` },
    description,
    keywords,
    authors: [{ name: 'Lorn Samnang', url: mainUrl }],
    creator: 'Lorn Samnang',
    publisher: 'Lorn Samnang',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      url: mainUrl,
      siteName: "Lorn Samnang's Portfolio",
      title,
      description,
      locale: 'en_US',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@lornsamnang',
      images: [imageUrl],
    },
    alternates: {
      canonical: mainUrl,
    },
    category: 'technology',
  };
};

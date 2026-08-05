/**
 * Structured data for the site root.
 *
 * Almost no competitor on any Moganshan search result ships structured data at
 * all, so rich results are unusually cheap here.
 *
 * `alternateName` carries both "Mount Mogan" and 莫干山 because three different
 * things share this name in the index: Moganshan Road (the M50 art district in
 * Putuo, Shanghai), Moganshan Veneer (a plywood brand in the head-term
 * autocomplete), and Moganshan Station (a high-speed rail station that does not
 * serve the mountain; Deqing is the correct one). The entity has to be pinned
 * to Deqing County explicitly or Google keeps conflating them.
 */
const SITE = 'https://www.visitmoganshan.com';

export const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Visit Moganshan',
  url: SITE,
  inLanguage: 'en',
  publisher: {
    '@type': 'Organization',
    name: 'BeyondBorder Group Ltd',
    address: { '@type': 'PostalAddress', addressCountry: 'HK' },
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export const placeLd = {
  '@context': 'https://schema.org',
  '@type': 'TouristDestination',
  name: 'Moganshan',
  alternateName: ['Mount Mogan', '莫干山'],
  url: SITE,
  description:
    'A mountain and former hill station in Deqing County, Huzhou, Zhejiang Province, China.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Deqing County',
    addressRegion: 'Zhejiang',
    addressCountry: 'CN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 30.594, longitude: 119.891 },
};

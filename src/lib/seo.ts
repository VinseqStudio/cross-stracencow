// Dane strukturalne (schema.org, JSON-LD) wspólne dla całej strony.
// Base.astro wstawia na każdej stronie jeden @graph: organizator, serwis, bieżąca strona i dane tej strony.
// Węzły łączą się przez @id (adres + #kotwica), więc Google i agenci AI widzą jedną spójną całość:
// kto organizuje, jak nazywa się serwis, o czym jest strona i które wydarzenie opisuje.
import { event } from '../data/event';

export const SITE_NAME = 'Cross Straceńców Głogów';
export const STUDIO = { name: 'Vinseq Studio', url: 'https://vinseqstudio.com' };

/** Identyfikatory węzłów grafu (stałe adresy z kotwicą). */
export const ids = (site: string) => ({
  organizer: `${site}/#organizer`,
  website: `${site}/#website`,
  event: `${site}/#event`,
  venue: `${site}/#venue`,
});

/** Miejsce startu: tor motocrossowy w Górkowie (dzielnica Głogowa). */
export const venueNode = (site: string) => ({
  '@type': 'Place',
  '@id': ids(site).venue,
  name: event.venue.name,
  address: {
    '@type': 'PostalAddress',
    addressLocality: event.venue.city,
    postalCode: '67-200',
    addressRegion: 'dolnośląskie',
    addressCountry: 'PL',
  },
});

/** Węzły obecne na każdej stronie: organizator i serwis. */
export function siteNodes(site: string) {
  const id = ids(site);
  const o = event.organizer;
  return [
    {
      '@type': 'Organization',
      '@id': id.organizer,
      name: o.name,
      url: `${site}/`,
      email: o.email,
      telephone: `+48 ${o.phone}`,
      taxID: o.nip,
      logo: { '@type': 'ImageObject', url: `${site}/logo.webp`, width: 228, height: 160 },
      address: { '@type': 'PostalAddress', streetAddress: o.address.split(',')[0], addressLocality: event.venue.city, postalCode: '67-200', addressCountry: 'PL' },
      contactPoint: { '@type': 'ContactPoint', contactType: 'biuro zawodów', email: o.email, telephone: `+48 ${o.phone}`, availableLanguage: 'pl', hoursAvailable: o.phoneHours },
      sameAs: [event.facebook],
    },
    {
      '@type': 'WebSite',
      '@id': id.website,
      url: `${site}/`,
      name: SITE_NAME,
      alternateName: [event.name, `${event.edition} ${event.name}`],
      inLanguage: 'pl-PL',
      publisher: { '@id': id.organizer },
      creator: { '@type': 'Organization', name: STUDIO.name, url: STUDIO.url },
    },
  ];
}

/** Węzeł bieżącej strony (WebPage albo podtyp, np. CollectionPage). */
export function pageNode(site: string, p: { url: string; title: string; description: string; type?: string; image?: string; about?: object }) {
  return {
    '@type': p.type ?? 'WebPage',
    '@id': `${p.url}#webpage`,
    url: p.url,
    name: p.title,
    description: p.description,
    inLanguage: 'pl-PL',
    isPartOf: { '@id': ids(site).website },
    ...(p.image ? { primaryImageOfPage: { '@type': 'ImageObject', url: p.image } } : {}),
    ...(p.about ? { about: p.about } : {}),
  };
}

/** Okruszki: [nazwa, ścieżka] od strony głównej w dół. */
export function breadcrumbs(site: string, items: [string, string][]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${site}${path}` })),
  };
}

/** Usuwa @context z węzłów strony: w @graph kontekst jest jeden, na górze. */
export const stripContext = (nodes: object[]) =>
  nodes.map((n) => {
    const { '@context': _c, ...rest } = n as Record<string, unknown>;
    return rest;
  });

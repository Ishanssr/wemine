export const SITE_URL = 'https://wemine.in';

// ─── Organization ────────────────────────────────────────────────────
export const ORGANIZATION_JSON_LD = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'WEMINE',
  alternateName: ['We Mine', 'WEMINE India', 'Wemine Clothing'],
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
    width: 600,
    height: 600,
  },
  image: `${SITE_URL}/hero-bg.png`,
  description:
    'WEMINE is an Indian premium apparel brand creating minimalist aesthetic t-shirts with thoughtful graphic prints. 240 GSM pre-shrunk cotton, fade-resistant, built to last. Founded in Himachal Pradesh, India.',
  slogan: 'Threads With Character',
  foundingDate: '2025',
  foundingLocation: {
    '@type': 'Place',
    name: 'Himachal Pradesh, India',
  },
  areaServed: {
    '@type': 'Country',
    name: 'India',
  },
  knowsAbout: [
    'Premium cotton t-shirts',
    'Minimalist fashion',
    'Aesthetic apparel',
    'Graphic tees',
    'Sustainable fashion',
    'Indian streetwear',
  ],
  sameAs: [
    'https://instagram.com/wemine.in',
    'https://twitter.com/wemine',
    'https://pinterest.com/wemine',
    'https://github.com/Ishanssr/wemine',
  ],
  email: 'hello@wemine.in',
  telephone: '+91-9828847782',
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Himachal Pradesh',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-9828847782',
    email: 'hello@wemine.in',
    contactType: 'customer service',
    availableLanguage: ['English', 'Hindi'],
    areaServed: 'IN',
  },
};

// ─── Brand ───────────────────────────────────────────────────────────
export const BRAND_JSON_LD = {
  '@type': 'Brand',
  '@id': `${SITE_URL}/#brand`,
  name: 'WEMINE',
  alternateName: 'We Mine',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    'WEMINE creates premium cotton t-shirts with minimalist aesthetic graphics. Every tee is made from 240 GSM pre-shrunk cotton, designed to be worn and built to last.',
  slogan: 'Threads With Character',
};

// ─── WebSite ─────────────────────────────────────────────────────────
export const WEBSITE_JSON_LD = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'WEMINE',
  alternateName: 'WEMINE India — Premium Minimalist T-Shirts',
  url: SITE_URL,
  description:
    'Shop premium minimalist t-shirts at WEMINE. 240 GSM cotton, aesthetic graphic prints, made in India. Free shipping above ₹999.',
  publisher: { '@id': `${SITE_URL}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: 'en-IN',
};

// ─── ClothingStore ───────────────────────────────────────────────────
export const CLOTHING_STORE_JSON_LD = {
  '@type': 'ClothingStore',
  '@id': `${SITE_URL}/#store`,
  name: 'WEMINE',
  url: SITE_URL,
  image: `${SITE_URL}/hero-bg.png`,
  description:
    'WEMINE online store — premium cotton t-shirts with minimalist aesthetic. Shop 240 GSM graphic tees, free shipping above ₹999 across India.',
  brand: { '@id': `${SITE_URL}/#brand` },
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Himachal Pradesh',
    addressCountry: 'IN',
  },
  telephone: '+91-9828847782',
  email: 'hello@wemine.in',
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'UPI, Credit Card, Debit Card, Net Banking, COD',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  },
  areaServed: {
    '@type': 'Country',
    name: 'India',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'WEMINE T-Shirt Collection',
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: 'Premium Cotton T-Shirts',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: 'Premium Graphic T-Shirts',
            },
          },
        ],
      },
    ],
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function productJsonLd(product: {
  name: string;
  description: string;
  image: string;
  images?: string[];
  sku: string;
  brand: string;
  price: number;
  currency?: string;
  availability?: string;
  ratingValue?: number;
  reviewCount?: number;
  url: string;
  category?: string;
  color?: string;
  size?: string;
}) {
  return {
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.length ? product.images : product.image,
    sku: product.sku,
    mpn: product.sku,
    brand: { '@type': 'Brand', name: product.brand },
    ...(product.category ? { category: product.category } : {}),
    ...(product.color ? { color: product.color } : {}),
    material: '240 GSM Premium Cotton',
    manufacturer: {
      '@type': 'Organization',
      name: 'WEMINE',
      url: SITE_URL,
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'INR',
      availability: product.availability || 'https://schema.org/InStock',
      url: product.url,
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': `${SITE_URL}/#organization` },
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: 0,
          currency: 'INR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 7,
            unitCode: 'DAY',
          },
        },
      },
    },
    ...(product.ratingValue
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.ratingValue,
            reviewCount: product.reviewCount || 0,
            bestRating: 10,
            worstRating: 1,
          },
        }
      : {}),
  };
}

export function itemListJsonLd(items: { name: string; url: string; image?: string; position?: number }[]) {
  return {
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: item.position ?? i + 1,
      name: item.name,
      url: item.url,
      ...(item.image ? { image: item.image } : {}),
    })),
  };
}

export function collectionPageJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  image?: string;
}) {
  return {
    '@type': 'CollectionPage',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    ...(opts.image ? { image: opts.image } : {}),
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#brand` },
    provider: { '@id': `${SITE_URL}/#organization` },
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function articleJsonLd(article: {
  headline: string;
  description?: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  image?: string;
  url?: string;
}) {
  return {
    '@type': 'Article',
    headline: article.headline,
    description: article.description || article.headline,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    ...(article.url ? { url: article.url, mainEntityOfPage: article.url } : {}),
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'WEMINE',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    ...(article.image ? { image: article.image } : {}),
  };
}

export function webPageJsonLd(opts: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@type': 'WebPage',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en-IN',
  };
}

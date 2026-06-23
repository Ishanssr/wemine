export const SITE_URL = 'https://wemine.in';

export const ORGANIZATION_JSON_LD = {
  '@type': 'Organization',
  name: 'WEMINE',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
    width: 600,
    height: 600,
  },
  sameAs: [
    'https://instagram.com/wemine',
    'https://twitter.com/wemine',
    'https://pinterest.com/wemine',
  ],
  email: 'hello@wemine.in',
  telephone: '+91 9828847782',
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Himachal Pradesh',
    addressCountry: 'IN',
  },
  foundingDate: '2025',
};

export const WEBSITE_JSON_LD = {
  '@type': 'WebSite',
  name: 'WEMINE',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

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
  sku: string;
  brand: string;
  price: number;
  currency?: string;
  availability?: string;
  ratingValue?: number;
  reviewCount?: number;
  url: string;
}) {
  return {
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    brand: { '@type': 'Brand', name: product.brand },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'INR',
      availability: product.availability || 'https://schema.org/InStock',
      url: product.url,
      itemCondition: 'https://schema.org/NewCondition',
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
      },
    },
    ...(product.ratingValue
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.ratingValue,
            reviewCount: product.reviewCount || 0,
            bestRating: 5,
          },
        }
      : {}),
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
}) {
  return {
    '@type': 'Article',
    headline: article.headline,
    description: article.description || article.headline,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'WEMINE',
      url: SITE_URL,
    },
    ...(article.image ? { image: article.image } : {}),
  };
}

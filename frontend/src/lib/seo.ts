// Centralized SEO constants, keyword strategy, and helpers for WEMINE
// Used across all pages for consistent metadata generation

export const BRAND = 'WEMINE';
export const SITE_URL = 'https://wemine.in';
export const TAGLINE = 'Threads With Character';
export const SLOGAN = 'Premium Minimal Wear — Thoughtful Prints, Built to Last';

// ─── Keyword Strategy ───────────────────────────────────────────────
// Grouped by search intent for targeted page usage

export const KEYWORDS = {
  // Brand queries (must rank #1)
  brand: [
    'wemine',
    'wemine india',
    'wemine t-shirts',
    'wemine clothing',
    'wemine brand',
    'wemine apparel',
    'wemine tshirts',
    'wemine premium tees',
    'we mine clothing',
    'wemine.in',
    'wemine online store',
    'wemine official',
  ],

  // Product / category queries
  product: [
    'premium t-shirts India',
    'premium cotton t-shirts',
    '240 GSM t-shirts',
    '240 GSM cotton tees',
    'pre-shrunk t-shirts India',
    'fade-resistant t-shirts',
    'graphic tees India',
    'oversized t-shirts India',
    'printed t-shirts online India',
    'cotton t-shirts for men',
    'cotton t-shirts for women',
    'unisex t-shirts India',
    'best quality t-shirts India',
    'buy t-shirts online India',
  ],

  // Style / aesthetic queries
  style: [
    'minimalist t-shirts',
    'minimalist aesthetic fashion',
    'aesthetic t-shirts India',
    'minimal wear',
    'minimalist fashion India',
    'aesthetic clothing India',
    'aesthetic apparel',
    'thoughtful print t-shirts',
    'meaningful graphic tees',
    'artistic t-shirts India',
    'unique graphic t-shirts',
    'designer t-shirts India',
    'streetwear India',
    'Indian streetwear brand',
    'minimal graphic tees',
    'clean design t-shirts',
  ],

  // Material / quality queries
  quality: [
    'premium cotton apparel',
    'heavy cotton t-shirts India',
    'durable t-shirts India',
    'long-lasting t-shirts',
    'organic cotton t-shirts India',
    'sustainable fashion India',
    'ethically made t-shirts',
    'eco-friendly t-shirts India',
  ],

  // Local / geographic
  local: [
    'Indian clothing brand',
    'Indian fashion brand',
    'made in India t-shirts',
    'Himachal Pradesh clothing brand',
    'Indian premium apparel',
    'homegrown fashion brand India',
    'new Indian fashion brand',
    'independent clothing brand India',
  ],
} as const;

// Flatten all keywords for the root layout
export const ALL_KEYWORDS: string[] = Object.values(KEYWORDS).flat();

// ─── Geo Data ────────────────────────────────────────────────────────
export const GEO = {
  region: 'IN-HP', // Himachal Pradesh, India
  placename: 'Himachal Pradesh, India',
  position: '31.1048;77.1734', // Shimla coordinates (ICBM format)
  latitude: '31.1048',
  longitude: '77.1734',
} as const;

// ─── Page Metadata Helpers ───────────────────────────────────────────

export function buildTitle(page: string): string {
  return `${page} | ${BRAND} — Premium Minimalist T-Shirts India`;
}

export function buildDescription(desc: string): string {
  // Ensure brand mention and call-to-action
  if (!desc.includes(BRAND)) {
    desc = `${desc} Shop ${BRAND} for premium minimalist apparel.`;
  }
  return desc.slice(0, 160);
}

export function buildOgImage(path = '/hero-bg.png') {
  return {
    url: `${SITE_URL}${path}`,
    width: 1200,
    height: 630,
    alt: `${BRAND} — Premium Minimalist T-Shirts & Aesthetic Apparel India`,
  };
}

const CLOUDINARY_BASE = 'https://res.cloudinary.com/';

export function optimizeImage(url: string, width = 800): string {
  if (!url || !url.startsWith(CLOUDINARY_BASE)) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
}

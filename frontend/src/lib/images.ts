export function optimizeImage(url: string, width?: number): string {
  if (!url) return '';
  if (url.includes('cloudinary.com') && width) {
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/f_auto,q_auto:best,c_limit,w_${width}/${parts[1]}`;
    }
  }
  return url;
}

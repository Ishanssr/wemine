export function optimizeImage(url: string, width?: number): string {
  if (!url) return '';
  if (url.includes('cloudinary.com')) {
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      // Strip any existing transformations from the path
      const rawPath = parts[1].replace(/^v\d+\//, (match) => match);
      const transforms = ['f_auto', 'q_auto:best'];
      if (width) {
        transforms.push(`c_limit,w_${width}`);
      }
      return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`;
    }
  }
  return url;
}

/** Returns the original unmodified Cloudinary URL (no transforms applied) */
export function cloudinaryOriginal(url: string): string {
  if (!url) return '';
  if (url.includes('cloudinary.com')) {
    // Ensure we're hitting the raw upload with no transformations
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/q_100/${parts[1]}`;
    }
  }
  return url;
}

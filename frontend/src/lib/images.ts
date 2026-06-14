export function optimizeImage(url: string, width?: number): string {
  if (!url) return '';
  if (url.includes('cloudinary.com')) {
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      const transforms = ['f_auto'];
      if (width) transforms.push(`w_${width}`);
      return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`;
    }
  }
  return url;
}

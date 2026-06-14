export function optimizeImage(url: string, width?: number): string {
  if (!url) return '';
  // If it's a Cloudinary URL, add auto format/quality and resize
  if (url.includes('cloudinary.com')) {
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      const transforms = ['f_auto', 'q_auto'];
      if (width) transforms.push(`w_${width}`);
      return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`;
    }
  }
  return url;
}

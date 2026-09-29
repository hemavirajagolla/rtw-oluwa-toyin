import type { ImgHTMLAttributes } from 'react';
import { responsiveImage } from '@/lib/responsive-image';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & { src: string; alt: string; portrait?: boolean };

export function ResponsiveImage({ src, alt, sizes, portrait, loading = 'lazy', decoding = 'async', ...props }: Props) {
  // Static srcset works on every export host, without an image server.
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...responsiveImage(src, sizes, portrait)} alt={alt} loading={loading} decoding={decoding} {...props} />;
}

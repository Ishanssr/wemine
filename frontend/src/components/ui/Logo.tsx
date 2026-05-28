import React from 'react';

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <img
      src="/logo-icon.svg"
      alt="Wemine Logo"
      className={className}
      style={{ display: 'inline-block', height: '100%', width: '100%', objectFit: 'contain' }}
      {...props}
    />
  );
}

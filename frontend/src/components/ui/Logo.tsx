import React from 'react';

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt="WEMINE Logo"
      className={`inline-block object-contain ${className || ''}`}
      {...props}
    />
  );
}

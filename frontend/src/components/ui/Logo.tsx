import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Dark Gray V-shape */}
      <path
        d="M 33 46.5 L 42.5 58 L 51.5 44"
        stroke="#3F4347"
        strokeWidth="6.5"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
      />

      {/* Dark Gray Right Peak */}
      <path
        d="M 56 41 L 63 30 L 85 64.5 L 65.5 64.5"
        stroke="#3F4347"
        strokeWidth="6.5"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
      />

      {/* Green Left Shape (Vertical and Peak Left) */}
      <path
        d="M 20 25 L 20 65 L 44 28 L 51 39"
        stroke="#4EB92D"
        strokeWidth="6.5"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
      />

      {/* Blue Diagonal */}
      <path
        d="M 51 39 L 66 62.5"
        stroke="#0060C0"
        strokeWidth="6.5"
        strokeLinecap="butt"
      />
    </svg>
  );
}

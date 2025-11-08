import * as React from 'react';

export const CreditCardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x={2.5} y={6.5} width={19} height={11} rx={2} />
    <path d="M2.5 10.5h19" />
    <circle cx={7.5} cy={15.5} r={1} />
    <rect x={11.5} y={14} width={6} height={2} rx={0.5} />
  </svg>
);

import type React from 'react';

export const UnpluggedIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M9.5 21v-3L6 14.5V9q0-.6.275-1.125t.8-.8L9 9H8v4.65l3.5 3.5V19h1v-1.85l.925-.925L1.4 4.2l1.4-1.4l18.4 18.4l-1.4 1.4l-4.95-4.95l-.35.35v3zm7.65-6.7L16 13.15V9h-4.15L8 5.15V3h2v4h4V3h2v5l-1-1h1q.825 0 1.413.588T18 9v4.45zm-6.45-.775"
      fill="currentColor"
    />
  </svg>
);

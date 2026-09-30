const base = (size, sw = 1.6) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true,
});

export const Logo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden="true">
    <path d="M4 2h11v5H9v22h6v5H4z M32 2H21v5h6v22h-6v5h11z" fill="currentColor" />
    <rect x="14.5" y="14.5" width="7" height="7" fill="currentColor" />
  </svg>
);
export const Corner = (p) => (<svg {...base(16, 1.3)} {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="1" /><path d="M10 14 17 7M12 7h5v5" /></svg>);
export const Check = ({ size = 12 }) => (<svg {...base(size, 2)}><path d="M4 12.5 9 17 20 6" /></svg>);
export const DoubleCheck = ({ size = 12 }) => (<svg {...base(size, 1.8)}><path d="M2 12.5 6.5 17 15 7M10 15.5l1.5 1.5L22 7" /></svg>);
export const Spinner = ({ size = 12 }) => (<svg {...base(size, 2)}><path d="M12 3a9 9 0 1 1-9 9" /></svg>);
export const Clock = ({ size = 12 }) => (<svg {...base(size, 1.8)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
export const Clip = ({ size = 14 }) => (<svg {...base(size, 1.7)}><path d="M20 11.5 12 19.5a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7L9.7 17.2a1.7 1.7 0 0 1-2.4-2.4L15 7" /></svg>);
export const Plus = ({ size = 18 }) => (<svg {...base(size, 1.4)}><path d="M12 3v18M3 12h18" /></svg>);
export const ChevronL = ({ size = 18 }) => (<svg {...base(size, 1.8)}><path d="m15 5-7 7 7 7" /></svg>);
export const ChevronR = ({ size = 18 }) => (<svg {...base(size, 1.8)}><path d="m9 5 7 7-7 7" /></svg>);
export const Alert = ({ size = 14 }) => (<svg {...base(size, 1.8)}><path d="M12 3 2 20h20L12 3z" /><path d="M12 10v4M12 17h.01" /></svg>);
export const Info = ({ size = 14 }) => (<svg {...base(size, 1.8)}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>);
export const Bolt = ({ size = 16 }) => (<svg {...base(size, 1.8)}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" /></svg>);
export const Arrow = ({ size = 14 }) => (<svg {...base(size, 1.8)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);

/* Feature / “what users see” icons */
export const Coins = ({ size = 28 }) => (<svg {...base(size, 2)}><ellipse cx="9" cy="7" rx="6" ry="3" /><path d="M3 7v5c0 1.7 2.7 3 6 3s6-1.3 6-3V7" /><path d="M9 15v2c0 1.7 2.7 3 6 3s6-1.3 6-3v-5c0-1.6-2.4-2.9-5.5-3" /></svg>);
export const Recipient = ({ size = 28 }) => (<svg {...base(size, 2)}><circle cx="9" cy="8" r="4" /><path d="M2 21c0-3.9 3.1-7 7-7 1.4 0 2.7.4 3.8 1.1" /><path d="M15 18h7M19 15l3 3-3 3" /></svg>);
export const Key = ({ size = 28 }) => (<svg {...base(size, 2)}><circle cx="7.5" cy="15.5" r="4.5" /><path d="m10.7 12.3 9.8-9.8M17 6l3 3M14.5 8.5l2 2" /></svg>);
export const Layers = ({ size = 28 }) => (<svg {...base(size, 2)}><path d="m12 3 9 5-9 5-9-5 9-5z" /><path d="m3 13 9 5 9-5" /></svg>);
export const Undo = ({ size = 28 }) => (<svg {...base(size, 2)}><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" /></svg>);
export const Radar = ({ size = 28 }) => (<svg {...base(size, 2)}><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /><circle cx="12" cy="12" r="6" /><path d="M12 12l3-3" /><circle cx="12" cy="12" r="1" /></svg>);

/* Small UI icons for feature cards */
export const Hex = ({ size = 14 }) => (<svg {...base(size, 1.8)}><path d="M8 4 4 12l4 8M16 4l4 8-4 8" /></svg>);
export const Doc = ({ size = 14 }) => (<svg {...base(size, 1.8)}><path d="M6 3h8l4 4v14H6z" /><path d="M9 12h6M9 16h6" /></svg>);
export const Search = ({ size = 14 }) => (<svg {...base(size, 1.8)}><circle cx="11" cy="11" r="6" /><path d="m20 20-4.5-4.5" /></svg>);
export const Route = ({ size = 14 }) => (<svg {...base(size, 1.8)}><circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" /><path d="M8 18h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7" /></svg>);
export const Wallet = ({ size = 14 }) => (<svg {...base(size, 1.8)}><rect x="3" y="6" width="18" height="14" rx="2" /><path d="M3 10h18M16 15h2" /></svg>);
export const Window = ({ size = 14 }) => (<svg {...base(size, 1.8)}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M7 6.5h.01" /></svg>);
export const Code = ({ size = 14 }) => (<svg {...base(size, 1.8)}><path d="m8 7-5 5 5 5M16 7l5 5-5 5" /></svg>);
export const Dots = ({ size = 14 }) => (<svg {...base(size, 1.8)}><rect x="3" y="7" width="18" height="10" rx="2" /><path d="M8 12h.01M12 12h.01M16 12h.01" /></svg>);
export const Flag = ({ size = 14 }) => (<svg {...base(size, 1.8)}><path d="M5 21V4h11l-2 4 2 4H5" /></svg>);
export const Shield = ({ size = 14 }) => (<svg {...base(size, 1.8)}><path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-3z" /></svg>);

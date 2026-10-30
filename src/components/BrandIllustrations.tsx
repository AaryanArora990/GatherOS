import React from 'react';

export const GatherLogoMark: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <rect x="2" y="2" width="28" height="28" rx="6" fill="#1B4332" />
    <path
      d="M16 7C11.0294 7 7 11.0294 7 16C7 20.9706 11.0294 25 16 25C19.6 25 22.7 22.88 24.14 19.8H16V16.2H24.98C25 16.13 25 16.07 25 16C25 11.0294 20.9706 7 16 7Z"
      stroke="#C5A059"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <circle cx="16" cy="16" r="3" fill="#FAF8F5" />
  </svg>
);

export const HeroCourtyardArtwork: React.FC = () => (
  <div className="relative w-full h-full min-h-[380px] bg-[#143326] text-[#FAF8F5] overflow-hidden rounded-xl border border-[#2D5A44] flex flex-col justify-between p-7">
    <svg
      viewBox="0 0 800 500"
      className="absolute inset-0 w-full h-full object-cover opacity-90"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="courtyardGlow" cx="50%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#C5A059" stopOpacity="0.42" />
          <stop offset="55%" stopColor="#1B4332" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#0E241B" stopOpacity="1" />
        </radialGradient>
        <linearGradient id="archStroke" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E6CFA0" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#C5A059" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#courtyardGlow)" />
      {/* Architectural Haveli Arches */}
      <path
        d="M80 480 V210 C80 120 190 90 220 65 C250 90 360 120 360 210 V480"
        fill="none"
        stroke="url(#archStroke)"
        strokeWidth="1.5"
      />
      <path
        d="M440 480 V210 C440 120 550 90 580 65 C610 90 720 120 720 210 V480"
        fill="none"
        stroke="url(#archStroke)"
        strokeWidth="1.5"
      />
      <path
        d="M210 480 V170 C210 70 360 35 400 12 C440 35 590 70 590 170 V480"
        fill="none"
        stroke="#E6CFA0"
        strokeWidth="2"
      />
      {/* Warm Catenary String Lights & Brass Lanterns */}
      <path
        d="M80 155 Q240 205 400 140 Q560 205 720 155"
        fill="none"
        stroke="#C5A059"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <circle cx="190" cy="176" r="5" fill="#FDE68A" />
      <circle cx="290" cy="174" r="6" fill="#FDE68A" />
      <circle cx="400" cy="142" r="7" fill="#FEF3C7" />
      <circle cx="510" cy="174" r="6" fill="#FDE68A" />
      <circle cx="610" cy="176" r="5" fill="#FDE68A" />
      {/* Long Linen Banquet Perspective Table */}
      <polygon
        points="270,480 355,285 445,285 530,480"
        fill="#FAF8F5"
        fillOpacity="0.12"
        stroke="#E6CFA0"
        strokeWidth="1.2"
      />
      {/* Candlelight Hurricanes on Table */}
      <circle cx="400" cy="325" r="4" fill="#FDE68A" />
      <circle cx="382" cy="365" r="4.5" fill="#FDE68A" />
      <circle cx="418" cy="365" r="4.5" fill="#FDE68A" />
      <circle cx="365" cy="415" r="5" fill="#FEF3C7" />
      <circle cx="435" cy="415" r="5" fill="#FEF3C7" />
    </svg>

    <div className="relative z-10 flex items-center justify-between gap-2 text-[11px] tracking-wide text-[#E6CFA0] border-b border-[#FAF8F5]/15 pb-3 whitespace-nowrap">
      <span>LIVE BLUEPRINT ARCHITECTURE</span>
      <span className="font-mono-num">JAIPUR · 180 GUESTS · ₹8,50,000</span>
    </div>

    <div className="relative z-10 my-auto py-8 max-w-md">
      <p className="text-xs text-[#E6CFA0] mb-2">Active Celebration Simulation</p>
      <h2 className="font-serif-display text-2xl sm:text-3xl font-medium text-[#FAF8F5] leading-snug mb-3">
        Aarav & Meera’s Heritage Courtyard Wedding
      </h2>
      <p className="text-sm text-[#FAF8F5]/80 leading-relaxed">
        Every floral arch, vegetarian thali station, shuttle wave, and 8-stage guest moment synchronized in one operating system.
      </p>
    </div>

    <div className="relative z-10 grid grid-cols-3 gap-4 pt-4 border-t border-[#FAF8F5]/15 text-left">
      <div>
        <div className="text-xs text-[#FAF8F5]/70">Allocated Budget</div>
        <div className="font-mono-num text-base font-semibold text-[#FAF8F5]">₹8,50,000</div>
      </div>
      <div>
        <div className="text-xs text-[#FAF8F5]/70">Moment Stages</div>
        <div className="font-mono-num text-base font-semibold text-[#E6CFA0]">8 / 8 Mapped</div>
      </div>
      <div>
        <div className="text-xs text-[#FAF8F5]/70">Confirmed RSVPs</div>
        <div className="font-mono-num text-base font-semibold text-[#FAF8F5]">98.8% On Track</div>
      </div>
    </div>
  </div>
);

export const CategoryEditorialArt: React.FC<{ variant: 'wedding' | 'birthday' | 'community' }> = ({
  variant,
}) => {
  if (variant === 'wedding') {
    return (
      <div className="w-full h-44 bg-[#143326] rounded-lg overflow-hidden relative flex items-end p-4 border border-[#1B4332]">
        <svg viewBox="0 0 400 180" className="absolute inset-0 w-full h-full" aria-hidden="true">
          <rect width="400" height="180" fill="#143326" />
          <path d="M110 180 V75 C110 35 180 20 200 8 C220 20 290 35 290 75 V180" fill="none" stroke="#C5A059" strokeWidth="1.8" />
          <circle cx="200" cy="52" r="14" fill="#C5A059" fillOpacity="0.25" stroke="#E6CFA0" strokeWidth="1.2" />
          <path d="M60 40 Q200 85 340 40" fill="none" stroke="#E6CFA0" strokeWidth="1" strokeDasharray="3 3" />
        </svg>
        <div className="relative z-10 text-xs text-[#E6CFA0] font-mono-num">
          01 · Multi-Function Heritage & Modern Weddings
        </div>
      </div>
    );
  }
  if (variant === 'birthday') {
    return (
      <div className="w-full h-44 bg-[#23392E] rounded-lg overflow-hidden relative flex items-end p-4 border border-[#2D4A3C]">
        <svg viewBox="0 0 400 180" className="absolute inset-0 w-full h-full" aria-hidden="true">
          <rect width="400" height="180" fill="#23392E" />
          <line x1="60" y1="135" x2="340" y2="135" stroke="#E6CFA0" strokeWidth="2" />
          <rect x="125" y="90" width="6" height="45" fill="#FAF8F5" />
          <circle cx="128" cy="82" r="5" fill="#FDE68A" />
          <rect x="197" y="75" width="6" height="60" fill="#FAF8F5" />
          <circle cx="200" cy="67" r="6" fill="#FEF3C7" />
          <rect x="269" y="95" width="6" height="40" fill="#FAF8F5" />
          <circle cx="272" cy="87" r="5" fill="#FDE68A" />
        </svg>
        <div className="relative z-10 text-xs text-[#E6CFA0] font-mono-num">
          02 · Milestone Dinners & Botanical Soirées
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-44 bg-[#1D352B] rounded-lg overflow-hidden relative flex items-end p-4 border border-[#2D4A3C]">
      <svg viewBox="0 0 400 180" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <rect width="400" height="180" fill="#1D352B" />
        <polygon points="90,145 145,75 200,145" fill="none" stroke="#C5A059" strokeWidth="1.6" />
        <polygon points="180,145 245,65 310,145" fill="none" stroke="#E6CFA0" strokeWidth="1.6" />
        <circle cx="200" cy="38" r="16" fill="#C5A059" fillOpacity="0.2" />
      </svg>
      <div className="relative z-10 text-xs text-[#E6CFA0] font-mono-num">
        03 · Neighbourhood Festivals & Cultural Gatherings
      </div>
    </div>
  );
};

export default function LandingCompass({ assemblyRef, lidRef, needleRef }) {
  return (
    <svg
      viewBox="0 0 240 240"
      className="h-auto w-full max-w-[16rem] drop-shadow-[0_18px_40px_rgba(0,0,0,0.35)] sm:max-w-[18rem] md:max-w-[22rem]"
      role="img"
      aria-label="Antique explorer compass"
    >
      <defs>
        <radialGradient id="cc-brass" cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#f0d48a" />
          <stop offset="42%" stopColor="#d4a017" />
          <stop offset="100%" stopColor="#7a5a12" />
        </radialGradient>
        <radialGradient id="cc-face" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#31466e" />
          <stop offset="100%" stopColor="#121a2e" />
        </radialGradient>
        <linearGradient id="cc-needle-n" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#f5ecd7" />
          <stop offset="100%" stopColor="#d4a017" />
        </linearGradient>
        <linearGradient id="cc-needle-s" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5ecd7" />
          <stop offset="100%" stopColor="#2dbfb8" />
        </linearGradient>
      </defs>

      <g ref={assemblyRef}>
        <circle cx="120" cy="120" r="108" fill="url(#cc-brass)" />
        <circle
          cx="120"
          cy="120"
          r="100"
          fill="none"
          stroke="#1b2a4a"
          strokeWidth="2.2"
          opacity="0.45"
        />
        <circle cx="120" cy="120" r="92" fill="url(#cc-face)" />
        <circle
          cx="120"
          cy="120"
          r="92"
          fill="none"
          stroke="#d4a017"
          strokeWidth="1.4"
          opacity="0.55"
        />

        <g fill="#d4a017" opacity="0.85">
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            // Fixed-precision strings keep server and client SVG attributes
            // identical during hydration.
            const x1 = (120 + Math.sin(a) * 78).toFixed(4);
            const y1 = (120 - Math.cos(a) * 78).toFixed(4);
            const x2 = (120 + Math.sin(a) * 86).toFixed(4);
            const y2 = (120 - Math.cos(a) * 86).toFixed(4);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#d4a017"
                strokeWidth={i % 3 === 0 ? 2.2 : 1}
                strokeLinecap="round"
              />
            );
          })}
        </g>

        <text
          x="120"
          y="52"
          textAnchor="middle"
          fill="#f5ecd7"
          fontSize="13"
          fontFamily="Georgia, serif"
          letterSpacing="2"
        >
          N
        </text>
        <text
          x="188"
          y="125"
          textAnchor="middle"
          fill="#f5ecd7"
          fontSize="11"
          fontFamily="Georgia, serif"
        >
          E
        </text>
        <text
          x="120"
          y="198"
          textAnchor="middle"
          fill="#f5ecd7"
          fontSize="11"
          fontFamily="Georgia, serif"
        >
          S
        </text>
        <text
          x="52"
          y="125"
          textAnchor="middle"
          fill="#f5ecd7"
          fontSize="11"
          fontFamily="Georgia, serif"
        >
          W
        </text>

        <polygon
          points="120,64 128,120 120,128 112,120"
          fill="#d4a017"
          opacity="0.35"
        />
        <polygon
          points="120,176 128,120 120,112 112,120"
          fill="#2dbfb8"
          opacity="0.28"
        />

        <g ref={needleRef}>
          <polygon points="120,58 126,122 120,116 114,122" fill="url(#cc-needle-n)" />
          <polygon points="120,182 126,118 120,124 114,118" fill="url(#cc-needle-s)" />
          <circle cx="120" cy="120" r="7" fill="#f5ecd7" />
          <circle cx="120" cy="120" r="3.6" fill="#d4a017" />
        </g>

        <g ref={lidRef}>
          <circle cx="120" cy="120" r="90" fill="url(#cc-brass)" />
          <circle
            cx="120"
            cy="120"
            r="78"
            fill="none"
            stroke="#1b2a4a"
            strokeWidth="1.6"
            opacity="0.35"
          />
          <circle
            cx="120"
            cy="120"
            r="54"
            fill="none"
            stroke="#7a5a12"
            strokeWidth="1.2"
            opacity="0.5"
          />
          <path
            d="M120 78 L132 112 L168 116 L140 140 L148 174 L120 156 L92 174 L100 140 L72 116 L108 112 Z"
            fill="#1b2a4a"
            opacity="0.18"
          />
          <circle cx="120" cy="34" r="8" fill="#1b2a4a" />
          <circle cx="120" cy="34" r="4.5" fill="#d4a017" />
          <ellipse
            cx="96"
            cy="88"
            rx="28"
            ry="14"
            fill="#f5ecd7"
            opacity="0.18"
          />
        </g>
      </g>
    </svg>
  );
}

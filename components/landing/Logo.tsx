interface LogoProps {
  size?: number;
  fontSize?: number;
  gap?: number;
}

export default function Logo({ size = 30, fontSize = 22, gap = 8 }: LogoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap }}>
      <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
        <rect x="4" y="4" width="92" height="92" rx="26" fill="#FF7DDD" />
        <path
          d="M50 18 C52 35, 65 48, 82 50 C65 52, 52 65, 50 82 C48 65, 35 52, 18 50 C35 48, 48 35, 50 18 Z"
          fill="#05030B"
        />
        <circle cx="74" cy="26" r="3.2" fill="#05030B" />
        <circle cx="24" cy="72" r="3" fill="#05030B" />
        <path
          d="M79 71 C79.8 76, 82 78.2, 87 79 C82 79.8, 79.8 82, 79 87 C78.2 82, 76 79.8, 71 79 C76 78.2, 78.2 76, 79 71 Z"
          fill="#05030B"
        />
      </svg>
      <span style={{ fontSize, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>
        <span style={{ WebkitTextStroke: '1.3px #FFFAFC', color: 'transparent' }}>FAN</span>
        <span style={{ color: '#FF7DDD' }}>UZ</span>
        <span style={{ WebkitTextStroke: '1.3px #FFFAFC', color: 'transparent' }}>U</span>
      </span>
    </div>
  );
}

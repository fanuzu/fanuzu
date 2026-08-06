import Image from 'next/image';

interface LogoProps {
  size?: number;
  spin?: boolean;
}

const WORDMARK_ASPECT = 598 / 100;
const WORDMARK_TO_ICON = 100 / 221;

export default function Logo({ size = 30, spin = false }: LogoProps) {
  const wordmarkHeight = Math.round(size * WORDMARK_TO_ICON);
  const wordmarkWidth = Math.round(wordmarkHeight * WORDMARK_ASPECT);
  const gap = Math.round(size * 0.19);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap }}>
      <div
        style={{
          width: size,
          height: size,
          animation: spin ? 'spinCCWPulse 2s cubic-bezier(.3,0,.2,1) infinite' : undefined,
        }}
      >
        <Image src="/images/fanuzu-icon.png" alt="" width={size} height={size} priority />
      </div>
      <Image src="/images/fanuzu-wordmark.png" alt="FANUZU" width={wordmarkWidth} height={wordmarkHeight} priority />
    </div>
  );
}

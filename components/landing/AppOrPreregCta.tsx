'use client';

import { isAppLaunched, openAppOrStore, type DeepLinkTarget } from '@/lib/deeplink';

// Shared by the artist and event landing pages (doc: "정식 출시 전에는
// 사전등록으로 연결하고, 출시 이후에는 앱 설치 및 실행으로 연결"). Before
// launch this is a plain <a> to the existing homepage/ranking flow with
// ?artist=/the usual UTM params — real link, works with JS off, crawlable
// — reusing the already-built pre-registration modal/flow rather than a
// second one on these lightweight landing pages. After launch it becomes
// a button that attempts the native deep link first, store page second.
export default function AppOrPreregCta({
  target,
  preregHref,
  preLaunchLabel,
  postLaunchLabel,
}: {
  target: DeepLinkTarget;
  preregHref: string;
  preLaunchLabel: string;
  postLaunchLabel: string;
}) {
  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '16px 28px',
    borderRadius: 999,
    background: 'linear-gradient(135deg,#FF7DDD,#9675F5)',
    color: '#080914',
    fontSize: 15.5,
    fontWeight: 700,
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  };

  if (!isAppLaunched()) {
    return (
      <a href={preregHref} style={style}>
        {preLaunchLabel}
      </a>
    );
  }

  return (
    <button onClick={() => openAppOrStore(target)} style={style}>
      {postLaunchLabel}
    </button>
  );
}

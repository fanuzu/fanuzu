export default function PlanetAtmosphere() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        background:
          'radial-gradient(circle at 78% 12%, rgba(var(--planet-g1,255,125,221),.26), transparent 46%),' +
          'radial-gradient(circle at 8% 60%, rgba(var(--planet-g2,155,124,255),.2), transparent 52%),' +
          'radial-gradient(circle at 50% 100%, rgba(124,232,255,.09), transparent 55%)',
        transition: 'background 1.1s cubic-bezier(.22,.61,.36,1)',
      }}
    />
  );
}

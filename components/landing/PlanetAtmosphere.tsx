export default function PlanetAtmosphere() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        background:
          'radial-gradient(circle at 78% 12%, rgba(var(--planet-g1,255,125,221),.16), transparent 42%),' +
          'radial-gradient(circle at 8% 60%, rgba(var(--planet-g2,155,124,255),.12), transparent 48%)',
        transition: 'background 1.1s cubic-bezier(.22,.61,.36,1)',
      }}
    />
  );
}

// Shared <head> font links — factored out so each route group's own root
// layout (doc section 20: multiple root layouts, one per group, is what
// lets each set a different <html lang>) doesn't have to repeat this
// markup four times. Next.js hoists <link> tags rendered anywhere in the
// tree into the real document <head> automatically.
export default function SiteFontLinks() {
  return (
    <>
      <link rel="preconnect" href="https://cdn.jsdelivr.net" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Gothic+A1:wght@700;800;900&display=swap"
        rel="stylesheet"
      />
    </>
  );
}

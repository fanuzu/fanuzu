// Server component — renders one <script type="application/ld+json">.
// JSON.stringify output never contains unescaped "</", so this is safe
// without the usual dangerouslySetInnerHTML script-injection concern.
export default function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <header className="section-heading">
      <div className="section-kicker"><p>{eyebrow}</p></div>
      <div><h2>{title}</h2>{description && <p>{description}</p>}</div>
    </header>
  );
}

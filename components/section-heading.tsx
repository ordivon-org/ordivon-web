export function SectionHeading({ index, eyebrow, title, description }: { index?: string; eyebrow: string; title: string; description?: string }) {
  return (
    <header className="section-heading">
      <div className="section-kicker">{index && <span>{index}</span>}<p>{eyebrow}</p></div>
      <div><h2>{title}</h2>{description && <p>{description}</p>}</div>
    </header>
  );
}

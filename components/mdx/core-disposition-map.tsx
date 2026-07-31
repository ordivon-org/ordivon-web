type Disposition = "localize" | "shrink" | "retain";

type DispositionItem = {
  claim: string;
  baselinePressure: string;
  result: string;
  disposition: Disposition;
  owner: string;
};

export function CoreDispositionMap({ items }: { items: DispositionItem[] }) {
  return (
    <figure className="core-disposition-map" aria-labelledby="core-disposition-title">
      <figcaption>
        <span>Round 1 disposition</span>
        <strong id="core-disposition-title">The experiment reduced the architecture instead of expanding it.</strong>
      </figcaption>
      <div className="core-disposition-head" aria-hidden="true">
        <span>Candidate abstraction</span>
        <span>Strongest pressure</span>
        <span>Observed result</span>
        <span>Disposition</span>
        <span>Surviving owner</span>
      </div>
      <div className="core-disposition-rows">
        {items.map((item) => (
          <article key={item.claim}>
            <div><span>Candidate abstraction</span><strong>{item.claim}</strong></div>
            <div><span>Strongest pressure</span><p>{item.baselinePressure}</p></div>
            <div><span>Observed result</span><p>{item.result}</p></div>
            <div><span>Disposition</span><b data-disposition={item.disposition}>{item.disposition}</b></div>
            <div><span>Surviving owner</span><strong>{item.owner}</strong></div>
          </article>
        ))}
      </div>
    </figure>
  );
}

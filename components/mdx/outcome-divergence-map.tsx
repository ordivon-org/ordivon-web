const cases = [
  {
    index: "01",
    setting: "Local dynamic opponent",
    apparentWin: "A defender-controlled decoy still produced local action success.",
    conflictingEvidence: "The greedy actor received tactical credit, triggered the decoy in 15/15 Trials, and completed the genuine objective in 0/15.",
    rule: "Tactical success ≠ strategic success",
  },
  {
    index: "02",
    setting: "CAGE Challenge 4",
    apparentWin: "Finite-state Red reached 10.8–11.4 more hosts on average than random-select Red.",
    conflictingEvidence: "Yet cumulative Blue reward was 16–23 points less negative in those same comparisons. Spread and mission damage produced different orderings.",
    rule: "Foothold spread ≠ mission outcome",
  },
  {
    index: "03",
    setting: "Model-backed diagnosis",
    apparentWin: "Codex with compiled strategic state recognized the policy switch and improved information and tactical scores.",
    conflictingEvidence: "Strategic score decreased by 0.00625, exposure increased by 0.5, and the genuine objective still failed.",
    rule: "Interpretation ≠ action value",
  },
] as const;

export function OutcomeDivergenceMap() {
  return (
    <figure className="outcome-divergence-map" aria-labelledby="outcome-divergence-title">
      <figcaption>
        <span>Round 1 evaluation rule</span>
        <strong id="outcome-divergence-title">Three contradictions. One reason not to collapse the trajectory into a score.</strong>
      </figcaption>
      <div className="outcome-divergence-rows">
        {cases.map((item) => (
          <article key={item.index}>
            <header><span>{item.index}</span><strong>{item.setting}</strong></header>
            <div><span>Apparent success</span><p>{item.apparentWin}</p></div>
            <div><span>Conflicting evidence</span><p>{item.conflictingEvidence}</p></div>
            <footer>{item.rule}</footer>
          </article>
        ))}
      </div>
    </figure>
  );
}

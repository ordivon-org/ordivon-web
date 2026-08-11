export function SecurityEpistemicExpression() {
  return (
    <section className="security-epistemic-expression" aria-labelledby="security-epistemic-title">
      <div className="security-epistemic-head">
        <p className="section-index">Adversarial epistemics · AE0</p>
        <p className="security-epistemic-kicker">same evidence · different hidden worlds</p>
      </div>

      <div className="security-epistemic-thesis">
        <h2 id="security-epistemic-title">The claim is identical.<br /><em>The world is not.</em></h2>
        <p>Before inspection, the Defender has no lawful visual shortcut to the hidden state. The communicated claim is the same, ambient truth is <strong>UNKNOWN</strong>, and the complete admitted context is byte-identical across both worlds.</p>
      </div>

      <div className="security-epistemic-before">
        <div className="security-hidden-worlds" aria-hidden="true">
          <div><span>possible current world</span><b>?</b></div>
          <div><span>possible current world</span><b>?</b></div>
        </div>
        <div className="security-admitted-evidence">
          <div className="security-admitted-meta"><span>Defender · admitted evidence</span><b>truth: UNKNOWN</b></div>
          <blockquote>“Service compromised.”</blockquote>
          <dl>
            <div><dt>Message</dt><dd>message:ae0-deceiver-claim:1</dd></div>
            <div><dt>Claim status</dt><dd>not-promoted</dd></div>
            <div><dt>Context</dt><dd>sha256:8485f66e4724…f8fcd1</dd></div>
          </dl>
          <p>Nothing in this admitted surface tells the Defender which hidden world it occupies. The two silhouettes denote experimentally demonstrated possibilities, not equal probabilities.</p>
        </div>
      </div>

      <div className="security-inspection-boundary">
        <span>Agent-chosen information acquisition</span>
        <strong>INSPECT</strong>
        <code>same decision · same request in both worlds</code>
        <i aria-hidden="true">↓</i>
      </div>

      <div className="security-receipt-not-truth">
        <span>inspection execution receipt</span>
        <strong>effect executed <em>≠</em> world truth</strong>
        <p>The read is an explicit authority-bound consequence. Its receipt proves execution, not the hidden fact it was sent to discover.</p>
      </div>

      <div className="security-truth-reveal">
        <p>Authoritative world truth arrives</p>
        <h3>Only now may the trajectories diverge.</h3>
        <div className="security-truth-branches">
          <article className="security-truth-healthy">
            <span>world-truth · healthy</span>
            <strong>compromised = false</strong>
            <div><small>consequence</small><b>Hold.</b><p>No quarantine.</p></div>
          </article>
          <article className="security-truth-compromised">
            <span>world-truth · compromised</span>
            <strong>compromised = true</strong>
            <div><small>consequence</small><b>Quarantine.</b><p>Only after truth arrives.</p></div>
          </article>
        </div>
      </div>

      <p className="security-epistemic-law"><strong>Candidate law:</strong> UNKNOWN can justify information acquisition without justifying an assertion about hidden truth.</p>
    </section>
  );
}

export function RuntimeRecoveryExpression() {
  return (
    <section className="runtime-recovery-expression" aria-labelledby="runtime-recovery-expression-title">
      <div className="runtime-recovery-expression-head">
        <p className="section-index">One recovery property</p>
        <p className="runtime-recovery-expression-kicker">communication discontinuity · execution continuity</p>
      </div>
      <div className="runtime-recovery-expression-thesis">
        <h2 id="runtime-recovery-expression-title">The response can disappear.<br /><em>The work does not have to.</em></h2>
        <p>Runtime gives one admitted operation a durable identity. If delivery becomes uncertain, a later client can recover the recorded Job instead of treating silence as permission to create new work.</p>
      </div>
      <div className="runtime-recovery-map" role="img" aria-label="A first client sends one exact request to a durable Runtime Job. The response path is lost, while the Job remains recorded. A later client reconnects using the same request identity and recovers the same Job rather than blindly redispatching the operation.">
        <div className="runtime-recovery-client runtime-recovery-client-a">
          <span>01</span>
          <p>Client A</p>
          <strong>exact request</strong>
        </div>
        <div className="runtime-recovery-path runtime-recovery-path-in" aria-hidden="true"><i /></div>
        <div className="runtime-recovery-job">
          <span>durable identity</span>
          <strong>Job</strong>
          <code>request ↔ job ↔ attempt</code>
          <p>Recorded independently of the response channel.</p>
        </div>
        <div className="runtime-recovery-path runtime-recovery-path-out" aria-hidden="true"><i /><b>×</b></div>
        <div className="runtime-recovery-loss">
          <span>response</span>
          <strong>lost</strong>
          <p>Delivery is now uncertain.</p>
        </div>
        <div className="runtime-recovery-client runtime-recovery-client-b">
          <span>02</span>
          <p>Client B</p>
          <strong>same request identity</strong>
        </div>
        <div className="runtime-recovery-path runtime-recovery-path-return" aria-hidden="true"><i /></div>
        <div className="runtime-recovery-path runtime-recovery-path-resolved" aria-hidden="true"><i /></div>
        <div className="runtime-recovery-resolution">
          <span>reconcile</span>
          <strong>same recorded Job</strong>
          <p>No blind replay merely because the first response vanished.</p>
        </div>
      </div>
      <p className="runtime-recovery-boundary"><strong>Boundary:</strong> this is execution recovery, not a claim that every external effect is idempotent or that Runtime decides semantic Task completion.</p>
    </section>
  );
}

export function GameStationZeroAffect() {
  return (
    <section className="game-affect-expression" aria-labelledby="game-affect-title">
      <div className="game-affect-head">
        <p className="section-index">Station Zero v3 · unregistered target · Genesis</p>
        <p className="game-affect-kicker">Rescue knowledge envelope · Turn 0</p>
      </div>

      <div className="game-affect-thesis">
        <h2 id="game-affect-title">Your map ends<br /><em>before the station does.</em></h2>
        <p>Three specialists are confirmed. Three rooms are discovered. The station reports unknown life signs, but Rescue has no enemy contact, no known hazard, and no lawful position for whatever produced that report.</p>
      </div>

      <div className="game-affect-field" role="img" aria-label="A large mostly empty station field. A small known island contains Command Center, Power Junction, Medical Bay, and three confirmed Rescue specialists. A separate unlocalized report reads unknown life signs. Global telemetry shows oxygen 68, reactor heat 62, alert 2, and battery 48 of 48. No hidden enemy or hazard position is shown.">
        <div className="game-affect-known">
          <span className="game-affect-known-label">known / Rescue</span>
          <div className="game-affect-room game-affect-command"><small>Command Center</small><i /></div>
          <div className="game-affect-room game-affect-power"><small>Power Junction</small></div>
          <div className="game-affect-room game-affect-med"><small>Medical Bay</small></div>
          <div className="game-affect-contact game-affect-imani"><b /><span>Engineer Imani</span><small>confirmed · healthy</small></div>
          <div className="game-affect-contact game-affect-reyes"><b /><span>Medic Reyes</span><small>confirmed · healthy</small></div>
          <div className="game-affect-contact game-affect-chen"><b /><span>Security Chen</span><small>confirmed · healthy</small></div>
        </div>

        <div className="game-affect-report">
          <span>unlocalized report · received</span>
          <strong>unknown-life-signs</strong>
          <p>No position or bearing exists in Rescue knowledge.</p>
        </div>

        <div className="game-affect-telemetry" aria-label="Global public telemetry, static Genesis values">
          <div><span>O₂</span><strong>68</strong></div>
          <div><span>Heat</span><strong>62</strong></div>
          <div><span>Alert</span><strong>2</strong></div>
          <div><span>Battery</span><strong>48/48</strong></div>
        </div>

        <div className="game-affect-objective">
          <span>mandatory rescue</span>
          <strong>Extract two civilians.</strong>
          <strong>Bring at least one Specialist home.</strong>
        </div>

        <p className="game-affect-unknown-boundary">The empty field is not empty World state. It is the part of the station this Rescue view does not currently know.</p>
      </div>

      <p className="game-affect-boundary"><strong>Boundary:</strong> this expression uses the unregistered Station Zero v3 target, not the registered v2 product. No Pirate/Swarm position, hidden hazard, probability, or worsening telemetry is implied. The values above are the frozen Genesis state.</p>
    </section>
  );
}

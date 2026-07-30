export function ContinuitySignal() {
  return (
    <div className="home-signal" aria-hidden="true">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="continuity-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--accent)" stopOpacity="0" />
            <stop offset=".12" stopColor="var(--accent)" stopOpacity=".7" />
            <stop offset=".72" stopColor="var(--accent-soft)" stopOpacity="1" />
            <stop offset="1" stopColor="var(--accent-soft)" stopOpacity="0" />
          </linearGradient>
          <filter id="continuity-glow" x="-30%" y="-60%" width="160%" height="220%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <g className="home-signal-field">
          <path d="M 40 175 H 1560" />
          <path d="M 40 450 H 1560" />
          <path d="M 40 725 H 1560" />
          <path d="M 260 55 V 845" />
          <path d="M 615 55 V 845" />
          <path d="M 1000 55 V 845" />
          <path d="M 1380 55 V 845" />
        </g>

        <path className="home-signal-shadow" d="M -80 575 C 150 575 160 285 390 285 C 540 285 520 630 720 630 C 920 630 870 360 1060 360 C 1210 360 1260 520 1680 520" />
        <path className="home-signal-trace" pathLength="1" d="M -80 575 C 150 575 160 285 390 285 C 540 285 520 630 720 630 C 920 630 870 360 1060 360 C 1210 360 1260 520 1680 520" />

        <g className="home-signal-node node-session" transform="translate(260 410)">
          <circle r="7" />
          <text x="18" y="5">SESSION ENDS</text>
        </g>
        <g className="home-signal-node node-task" transform="translate(615 630)">
          <circle r="9" />
          <text x="18" y="5">TASK REMAINS</text>
        </g>
        <g className="home-signal-node node-effect" transform="translate(1000 385)">
          <circle r="7" />
          <text x="18" y="5">EFFECT RECONCILES</text>
        </g>
        <g className="home-signal-node node-evidence" transform="translate(1380 520)">
          <circle r="9" />
          <text x="18" y="5">EVIDENCE PERSISTS</text>
        </g>
      </svg>
    </div>
  );
}

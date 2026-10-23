import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  FlaskConical,
  Goal,
  LayoutDashboard,
  RefreshCw,
  Shield,
  Sparkles,
  Users,
  UserRound,
} from "lucide-react";
import "./styles.css";
import {
  ARSENAL,
  CHELSEA,
  FALLBACK_PLAYERS,
  loadArsenalSquad,
  type FootballPlayer,
  type FootballTeam,
} from "./football";
type View = "today" | "autopilot" | "squad" | "lab";
const home = [
  ["1", 50, 91],
  ["2", 80, 74],
  ["3", 26, 82],
  ["4", 67, 84],
  ["5", 44, 84],
  ["6", 39, 67],
  ["7", 64, 65],
  ["8", 68, 55],
  ["9", 50, 48],
  ["10", 36, 56],
  ["11", 82, 59],
];
const away = [
  ["1", 50, 9],
  ["2", 77, 28],
  ["3", 23, 29],
  ["4", 42, 27],
  ["5", 59, 27],
  ["6", 50, 39],
  ["7", 73, 51],
  ["8", 30, 42],
  ["9", 50, 57],
  ["10", 66, 41],
  ["11", 84, 48],
];
const readiness = [91, 84, 78, 88, 81, 76, 93, 86, 72, 89, 83];
const statuses = [
  "Ready",
  "Ready",
  "Monitor",
  "Ready",
  "Ready",
  "Monitor",
  "Ready",
  "Ready",
  "Risk",
  "Ready",
  "Ready",
] as const;

function TeamBadge({ team, rival = false }: { team: FootballTeam; rival?: boolean }) {
  const [failed, setFailed] = useState(false);
  return failed || !team.badge ? (
    <span className={rival ? "team-fallback rival" : "team-fallback"}>
      {team.abbreviation}
    </span>
  ) : (
    <img src={team.badge} alt={`${team.name} crest`} onError={() => setFailed(true)} />
  );
}
function Pitch({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "pitch compact" : "pitch"}>
      <div className="half" />
      <div className="circle" />
      <div className="box top" />
      <div className="box bottom" />
      <div className="danger-zone" />
      {away.map(([n, x, y]) => (
        <span
          key={"a" + n}
          className="player away"
          style={{ left: String(x) + "%", top: String(y) + "%" }}
        >
          {n}
        </span>
      ))}
      {home.map(([n, x, y]) => (
        <span
          key={"h" + n}
          className="player home"
          style={{ left: String(x) + "%", top: String(y) + "%" }}
        >
          {n}
        </span>
      ))}
      <i className="ball" style={{ left: "77%", top: "72%" }}>
        ●
      </i>
    </div>
  );
}
function Today({ openLab }: { openLab: () => void }) {
  return (
    <div className="view">
      <header className="page-head">
        <div>
          <h1>Match day</h1>
          <p>23 October 2026 · Bangkok · Scenario workspace</p>
        </div>
        <CalendarDays />
      </header>
      <section className="next-match">
        <p>Premier League · Match intelligence preview</p>
        <div className="teams">
          <div>
            <TeamBadge team={ARSENAL} />
            <b>{ARSENAL.name}</b>
          </div>
          <strong>
            19:30<small>in 2h 14m</small>
          </strong>
          <div>
            <TeamBadge team={CHELSEA} rival />
            <b>{CHELSEA.name}</b>
          </div>
        </div>
        <button onClick={openLab}>
          <FlaskConical />
          Build match plan
        </button>
      </section>
      <h2>Team readiness</h2>
      <section className="readiness">
        <div className="ring">
          <b>86</b>
          <small>READY</small>
        </div>
        <div>
          <p>
            <span>Available</span>
            <b>21</b>
          </p>
          <p>
            <span>Monitor</span>
            <b>3</b>
          </p>
          <p>
            <span>Unavailable</span>
            <b>1</b>
          </p>
        </div>
      </section>
      <h2>Coach brief</h2>
      <section className="brief">
        <Shield />
        <div>
          <b>Protect the right channel</b>
          <p>
            Chelsea created 41% of xThreat down their left in the last five
            matches.
          </p>
        </div>
      </section>
      <section className="brief">
        <Activity />
        <div>
          <b>Press after backward passes</b>
          <p>
            Opponent retention falls to 62% under pressure in their first phase.
          </p>
        </div>
      </section>
    </div>
  );
}
function Squad({ players, source }: { players: FootballPlayer[]; source: string }) {
  const [filter, setFilter] = useState("All");
  return (
    <div className="view">
      <header className="page-head">
        <div>
          <h1>Squad readiness</h1>
          <p>{players.length} players · {source}</p>
        </div>
        <RefreshCw />
      </header>
      <div className="filters">
        {["All", "Ready", "Monitor", "Risk"].map((f) => (
          <button
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
            key={f}
          >
            {f}
          </button>
        ))}
      </div>
      <section className="squad-list">
        {players.slice(0, 18)
          .map((player, index) => ({
            ...player,
            readiness: readiness[index % readiness.length],
            status: statuses[index % statuses.length],
          }))
          .filter((player) => filter === "All" || player.status === filter)
          .map((player) => (
            <article key={player.id}>
              <span className="avatar">
                {player.image ? (
                  <img src={player.image} alt="" loading="lazy" />
                ) : player.name
                  .split(" ")
                  .map((x) => x[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <div>
                <b>{player.name}</b>
                <small>#{player.number} · {player.position}</small>
              </div>
              <strong>
                {player.readiness}
                <small>readiness</small>
              </strong>
              <i className={player.status.toLowerCase()}>{player.status}</i>
            </article>
          ))}
      </section>
    </div>
  );
}
function Lab() {
  const [shape, setShape] = useState("4-3-3");
  const [press, setPress] = useState(68);
  const delta = useMemo(
    () =>
      (
        (press - 68) * 0.006 +
        (shape === "3-4-2-1" ? 0.18 : shape === "4-2-3-1" ? 0.09 : 0)
      ).toFixed(2),
    [shape, press],
  );
  return (
    <div className="view">
      <header className="page-head">
        <div>
          <h1>Tactical Lab</h1>
          <p>Simulate the next 15 minutes</p>
        </div>
        <FlaskConical />
      </header>
      <div className="shape-tabs">
        {["4-3-3", "4-2-3-1", "3-4-2-1"].map((s) => (
          <button
            className={shape === s ? "active" : ""}
            onClick={() => setShape(s)}
            key={s}
          >
            {s}
          </button>
        ))}
      </div>
      <Pitch compact />
      <section className="slider">
        <label>
          Press intensity <b>{press}</b>
        </label>
        <input
          aria-label="Press intensity"
          type="range"
          min="40"
          max="95"
          value={press}
          onChange={(e) => setPress(+e.target.value)}
        />
        <div>
          <span>Controlled</span>
          <span>Aggressive</span>
        </div>
      </section>
      <section className="simulation">
        <small>PROJECTED IMPACT</small>
        <div>
          <span>
            <b>{"+" + delta}</b>xThreat
          </span>
          <span>
            <b>+7%</b>territory
          </span>
          <span>
            <b>-4%</b>stamina
          </span>
        </div>
        <p>
          {shape === "3-4-2-1"
            ? "Adds a spare player in midfield and protects the right half-space."
            : "Keeps width while increasing pressure on Chelsea build-up."}
        </p>
        <button>Save scenario</button>
      </section>
    </div>
  );
}
function Autopilot() {
  const [mode, setMode] = useState("Assist");
  const [stage, setStage] = useState<
    "idle" | "generating" | "ready" | "approved"
  >("idle");
  const generate = () => {
    setStage("generating");
    window.setTimeout(() => setStage("ready"), 650);
  };
  return (
    <div className="view autopilot-view">
      <header className="page-head">
        <div>
          <h1>Match Prep Autopilot</h1>
          <p>Build a coach-ready plan from squad and opponent signals</p>
        </div>
        <BrainCircuit />
      </header>
      <section className="autopilot-setup">
        <label>
          Assistance level
          <div className="mode-picker">
            {["Suggest", "Assist", "Autopilot"].map((item) => (
              <button
                key={item}
                className={mode === item ? "active" : ""}
                onClick={() => setMode(item)}
                aria-pressed={mode === item}
              >
                {item}
              </button>
            ))}
          </div>
        </label>
        <div className="setup-grid">
          <label>
            Opponent
            <select defaultValue="Chelsea">
              <option>Chelsea</option>
              <option>Manchester City</option>
            </select>
          </label>
          <label>
            Primary objective
            <select defaultValue="Control midfield">
              <option>Control midfield</option>
              <option>Protect a lead</option>
              <option>High press</option>
            </select>
          </label>
        </div>
        <button
          className="generate"
          onClick={generate}
          disabled={stage === "generating"}
        >
          <Sparkles />
          {stage === "generating"
            ? "Analyzing 24 signals…"
            : "Generate match plan"}
        </button>
      </section>
      <div aria-live="polite">
        {stage === "idle" && (
          <section className="autopilot-empty">
            <BrainCircuit />
            <b>Ready to prepare your match</b>
            <p>
              Autopilot will combine opponent tendencies, squad readiness and
              tactical scenarios. Nothing is published without approval.
            </p>
          </section>
        )}
        {stage === "generating" && (
          <section className="autopilot-loading">
            <i />
            <i />
            <i />
            <p>Comparing opponent patterns and player readiness…</p>
          </section>
        )}
        {(stage === "ready" || stage === "approved") && (
          <section className="plan-results">
            <div className="plan-heading">
              <div>
                <small>RECOMMENDED PLAN</small>
                <h2>Control then accelerate</h2>
              </div>
              <span>Confidence 84%</span>
            </div>
            <article>
              <h3>Starting XI · 4-2-3-1</h3>
              <div className="lineup">
                {[
                  "Cruz",
                  "Ito",
                  "Silva",
                  "Okafor",
                  "Vega",
                  "Kim",
                  "Malik",
                  "Park",
                  "Torres",
                  "Costa",
                  "Mensah",
                ].map((name, index) => (
                  <span key={name}>
                    <i>{index + 1}</i>
                    {name}
                  </span>
                ))}
              </div>
            </article>
            <article>
              <h3>Tactical priorities</h3>
              <ol>
                <li>
                  <b>Protect the right half-space</b>
                  <span>Delay the full-back press until support arrives.</span>
                </li>
                <li>
                  <b>Trigger on backward passes</b>
                  <span>
                    Chelsea retention drops to 62% under first-phase
                    pressure.
                  </span>
                </li>
                <li>
                  <b>Attack behind their left back</b>
                  <span>
                    Use Torres wide before releasing Ito on the overlap.
                  </span>
                </li>
              </ol>
            </article>
            <article className="risk-card">
              <AlertTriangle />
              <div>
                <h3>Player risk</h3>
                <p>
                  I. Torres readiness is 72. Limit repeated high-intensity runs
                  after 70 minutes.
                </p>
              </div>
            </article>
            <article>
              <h3>Alternative scenarios</h3>
              <div className="scenario-row">
                <button>
                  Protect lead <span>5-4-1 · press 48</span>
                </button>
                <button>
                  Chase goal <span>3-4-2-1 · press 82</span>
                </button>
              </div>
            </article>
            {stage === "ready" ? (
              <button className="approve" onClick={() => setStage("approved")}>
                <CheckCircle2 />
                Approve Match Brief
              </button>
            ) : (
              <div className="approved">
                <CheckCircle2 />
                <div>
                  <b>Match Brief approved</b>
                  <small>Saved locally · ready to share with staff</small>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
function App() {
  const [view, setView] = useState<View>("today");
  const [squad, setSquad] = useState<FootballPlayer[]>(FALLBACK_PLAYERS);
  const [dataSource, setDataSource] = useState("curated offline fallback");
  useEffect(() => {
    const controller = new AbortController();
    loadArsenalSquad(controller.signal)
      .then((players) => {
        setSquad(players);
        setDataSource("ESPN live API");
      })
      .catch(() => setDataSource("curated offline fallback"));
    return () => controller.abort();
  }, []);
  const items = [
    ["today", "Today", LayoutDashboard],
    ["autopilot", "Autopilot", BrainCircuit],
    ["squad", "Squad", Users],
    ["lab", "Tactical Lab", FlaskConical],
  ] as const;
  return (
    <div className="shell">
      <aside className="desktop-nav">
        <div className="brand">
          <Goal />
          EDGE ARENA
        </div>
        <p>FOOTBALL INTELLIGENCE</p>
        {items.map(([id, label, Icon]) => (
          <button
            className={view === id ? "active" : ""}
            onClick={() => setView(id)}
            key={id}
          >
            <Icon />
            {label}
          </button>
        ))}
        <div className="connection">
          <Shield />
          Match workspace<small>Ready for planning</small>
        </div>
      </aside>
      <main>
        <header className="top">
          <div className="mobile-brand">EDGE ARENA</div>
          <div className="match-status">MATCH DAY · 19:30</div>
          <button aria-label="Profile">
            <UserRound />
          </button>
        </header>
        {view === "today" && <Today openLab={() => setView("lab")} />}{" "}
        {view === "autopilot" && <Autopilot />} {view === "squad" && <Squad players={squad} source={dataSource} />}{" "}
        {view === "lab" && <Lab />}
        <nav className="bottom">
          {items.map(([id, label, Icon]) => (
            <button
              className={view === id ? "active" : ""}
              onClick={() => setView(id)}
              key={id}
            >
              <Icon />
              <span>{label === "Tactical Lab" ? "Lab" : label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
  });
}

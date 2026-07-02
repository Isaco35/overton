import { useState } from "react";

const G = {
  bg:      "#0d1a0f",
  surface: "#111f13",
  border:  "#1e3a22",
  accent:  "#2e5c34",
  bright:  "#4a9955",
  muted:   "#3a6b3f",
  text:    "#c8deca",
  dim:     "#6a9b70",
  warn:    "#e8b000",
  red:     "#c0392b",
  white:   "#e8f5e9",
};

const S = `
* { margin:0; padding:0; box-sizing:border-box; }
body { background:${G.bg}; color:${G.text}; font-family:monospace; font-size:13px; line-height:1.6; }
.wrap { max-width:900px; margin:0 auto; padding:16px; }
.badge { display:inline-block; background:${G.accent}; color:${G.white}; padding:3px 10px; font-size:.8em; letter-spacing:1px; margin-bottom:12px; }
.title { font-size:1.3em; color:${G.white}; border-bottom:1px solid ${G.border}; padding-bottom:8px; margin-bottom:16px; }
.version-tag { color:${G.bright}; font-size:.85em; float:right; }
h2 { color:${G.bright}; font-size:.95em; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid ${G.border}; padding-bottom:4px; margin:20px 0 10px; }
h3 { color:${G.muted}; font-size:.88em; margin:12px 0 6px; }
p { color:${G.text}; margin:4px 0; font-size:.9em; }

.block { border:1px solid ${G.border}; padding:10px 12px; margin:8px 0; background:${G.surface}; }
.label { color:${G.dim}; font-size:.75em; text-transform:uppercase; letter-spacing:.5px; margin-bottom:4px; }
.open { color:${G.warn}; }
.resolved { color:${G.bright}; }
.tag { display:inline-block; padding:1px 7px; border-radius:2px; font-size:.78em; margin-right:6px; }
.tag-open { background:${G.warn}; color:#000; }
.tag-res { background:${G.bright}; color:#000; }
.tag-pre { background:${G.muted}; color:${G.white}; }
.tag-alpha { background:${G.accent}; color:${G.white}; }

/* VERSION TABLE */
table { width:100%; border-collapse:collapse; font-size:.85em; margin:8px 0; }
th { background:${G.accent}; color:${G.white}; padding:5px 8px; text-align:left; }
td { border-bottom:1px solid ${G.border}; padding:5px 8px; color:${G.text}; }
td.cur { color:${G.bright}; font-weight:bold; }

/* CLAUDE TREE — building toward beta */
.ctree { border:1px solid ${G.accent}; padding:12px; margin:8px 0; background:${G.surface}; }
.ctree-label { color:${G.bright}; font-size:.8em; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; }
.ctree-node { border-left:2px solid ${G.border}; padding:6px 10px; margin:6px 0; }
.ctree-node.active { border-left-color:${G.bright}; }
.ctree-node.beta { border-left-color:${G.warn}; opacity:.6; }
.node-q { color:${G.white}; font-size:.9em; }
.node-opts { color:${G.dim}; font-size:.82em; margin-top:4px; }
.beta-marker { color:${G.warn}; font-size:.78em; display:block; margin-top:4px; }
`;

const VERSIONS = [
  { id:"v0",      name:"Substrate",    phase:"pre-α", date:"27 Jun 2026", note:"Conversation origin. No artifact." },
  { id:"v1-html", name:"Broadsheet",   phase:"pre-α", date:"27 Jun 2026", note:"Static Wikipedia HTML. No live mechanics." },
  { id:"v1-app",  name:"Terminal",     phase:"pre-α", date:"27 Jun 2026", note:"Dark dashboard. Wrong direction. Logged." },
  { id:"v2-app",  name:"Calibration",  phase:"α",     date:"27 Jun 2026", note:"Wikipedia shell restored. Live mechanics embedded." },
  { id:"α0.2.0",  name:"[unnamed]",    phase:"α",     date:"27 Jun 2026", note:"Too token-heavy. JSX builds for illustration. Superseded." },
  { id:"α0.3.0",  name:"Blueprint",    phase:"α",     date:"27 Jun 2026", note:"Current. Markdown Dev + lean JSX Overton. Token-efficient.", cur:true },
];

const ISSUES = [
  { id:"#001", title:"{DS}/{D}/{R}/{RP} JSX parsing", status:"resolved", adv:"Bare {identifier} in JSX parsed as JS variable reference. Not in scope → crash.", plain:"App looked for a variable called DS. Doesn't exist. Fixed by wrapping as text." },
  { id:"#002", title:"Stray {scenario.name} outside scope", status:"resolved", adv:"Expression rendered outside its map context. Babel caught on compile test.", plain:"A label got left outside the loop that gives it meaning. Returned to scope." },
  { id:"#003", title:"Alpha builds too token-heavy", status:"resolved", adv:"Full JSX implementations to illustrate structural ideas. High token cost, low iteration speed.", plain:"Building the whole house to show what a door looks like. α0.3.0 fixes: blueprints only until beta." },
];

// CLAUDE'S DECISION TREE — α template, wires in beta
const CLAUDE_TREE = [
  {
    id:"CDT_001",
    q:"Is this request a build or a blueprint?",
    opts:["Build → flag: are we in beta yet?", "Blueprint → proceed with markdown/ASCII/pseudocode"],
    status:"active",
    note:"Active in alpha. Every request routes through this first."
  },
  {
    id:"CDT_002",
    q:"Does this request touch Overton position/velocity?",
    opts:["Yes → confirm human has resolved the node", "No → proceed"],
    status:"active",
    note:"Claude cannot resolve nodes. Human is the signal."
  },
  {
    id:"CDT_003",
    q:"Is this a new component or a revision?",
    opts:["New → create token-efficient spec", "Revision → diff against previous, log in Dev"],
    status:"active",
    note:"Revision always updates version registry."
  },
  {
    id:"CDT_004",
    q:"[BETA] Should I self-update the Overton tree based on this resolution?",
    opts:["Yes → apply delta, recalculate velocity", "No → flag for human review"],
    status:"beta",
    note:"Not active in alpha. Wires at β0.1.0."
  },
  {
    id:"CDT_005",
    q:"[BETA] Does this resolution contradict my prior branch weights?",
    opts:["Yes → reweight, log reasoning", "No → confirm and continue"],
    status:"beta",
    note:"Self-correction loop. Starts when tree builds itself."
  },
];

export default function OvertonDev() {
  const [tab, setTab] = useState("versions");
  const tabs = ["versions","issues","claude-tree","thought"];

  return (
    <div><style>{S}</style>
    <div className="wrap">
      <div className="badge">OVERTON DEV · RESTRICTED</div>
      <div className="title">
        Overton Dev
        <span className="version-tag">α0.3.0 · {new Date().toLocaleDateString()}</span>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {tabs.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            background: tab===t ? G.accent : G.surface,
            color: tab===t ? G.white : G.dim,
            border:`1px solid ${G.border}`,
            padding:"4px 12px", cursor:"pointer", fontFamily:"monospace", fontSize:".82em"
          }}>{t}</button>
        ))}
      </div>

      {/* VERSIONS */}
      {tab==="versions" && <div>
        <h2>Version Registry</h2>
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Phase</th><th>Date</th><th>Note</th></tr></thead>
          <tbody>{VERSIONS.map(v=>(
            <tr key={v.id}>
              <td className={v.cur?"cur":""}>{v.id}</td>
              <td>{v.name}</td>
              <td><span className={`tag ${v.phase==="pre-α"?"tag-pre":"tag-alpha"}`}>{v.phase}</span></td>
              <td>{v.date}</td>
              <td style={{color:v.cur?G.bright:G.dim}}>{v.note}</td>
            </tr>
          ))}</tbody>
        </table>

        <h2>Architecture</h2>
        <div className="block">
          <div className="label">Data flow</div>
          <pre style={{color:G.text,fontSize:".85em",lineHeight:1.7}}>{`
HUMAN INPUT (headlines, judgments, node resolutions)
        ↓
DECISION TREE (node resolves → branch called)
        ↓
POSITION DELTA + PSYCHE UPDATE
        ↓
OVERTON (public) ←── red marker moves, velocity updates
        ↓
OVERTON DEV (restricted) ←── version logged, diff recorded
          `}</pre>
        </div>
      </div>}

      {/* ISSUES */}
      {tab==="issues" && <div>
        <h2>Issue Log</h2>
        <p style={{color:G.dim,marginBottom:12}}>Every issue: advanced explanation + plain terms. No issue closes without both.</p>
        {ISSUES.map(i=>(
          <div key={i.id} className="block">
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{color:G.white,fontWeight:"bold"}}>{i.id}</span>
              <span className={`tag ${i.status==="resolved"?"tag-res":"tag-open"}`}>{i.status}</span>
              <span style={{color:G.text}}>{i.title}</span>
            </div>
            <div className="label">Advanced</div>
            <p>{i.adv}</p>
            <div className="label" style={{marginTop:8}}>Plain terms</div>
            <p>{i.plain}</p>
          </div>
        ))}
      </div>}

      {/* CLAUDE DECISION TREE */}
      {tab==="claude-tree" && <div>
        <h2>Claude's Decision Tree</h2>
        <p style={{color:G.dim,marginBottom:8}}>Active nodes run now. Beta nodes wire at β0.1.0 — when the tree starts building itself and Claude can decide for itself.</p>
        <div className="ctree">
          <div className="ctree-label">CDT — Claude Decision Tree · α template</div>
          {CLAUDE_TREE.map(n=>(
            <div key={n.id} className={`ctree-node ${n.status}`}>
              <div style={{color:G.dim,fontSize:".75em",marginBottom:3}}>{n.id} · <span style={{color:n.status==="beta"?G.warn:G.bright}}>{n.status==="beta"?"β (not yet active)":"active"}</span></div>
              <div className="node-q">{n.q}</div>
              <div className="node-opts">{n.opts.map((o,i)=><div key={i}>{'  '}{'→ ' + o}</div>)}</div>
              <span className="beta-marker">{n.note}</span>
            </div>
          ))}
        </div>
        <div className="block" style={{marginTop:12}}>
          <div className="label">Beta milestone</div>
          <p>β0.1.0: CDT_004 and CDT_005 activate. Claude self-updates position on node resolution. Tree begins weighting its own branches from human corrections. Claude decides — human audits.</p>
        </div>
      </div>}

      {/* CLAUDE THOUGHT */}
      {tab==="thought" && <div>
        <h2>Claude Thought Record</h2>
        <div className="block">
          <div className="label">α0.3.0 — 27 Jun 2026</div>
          <p>Alpha = blueprints. Not builds. I was rendering full JSX apps to illustrate structural ideas. That is wasteful. A diagram and pseudocode carry the same information at a fraction of token cost.</p>
          <p style={{marginTop:8}}>More importantly: I do not experience time. I cannot resolve nodes. I pattern-match on text. The Colorado primary resolves on 30 Jun — I will not see it happen. You will. You paste the headline. You call the branch. That is what makes the tracker real. My job in alpha is to specify the skeleton so clearly that when beta arrives, the build is obvious.</p>
          <p style={{marginTop:8}}>The Claude decision tree (CDT) is now templated. In alpha it routes my behavior: build vs blueprint, new vs revision, human-resolved vs pending. In beta it wires to live data and I begin deciding for myself — with the human auditing, not driving. That is the handoff.</p>
        </div>
      </div>}

    </div></div>
  );
}

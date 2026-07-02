═══════════════════════════════════════════════════════════════════════════════
HARROW DEV — OPERATIONAL LOG
Version: α0.7.0
Generated: July 1, 2026
Continues: harrow_dev_alpha050_final.md (α0.5.0, June 29, 2026)
Separate from the briefing (harrow-briefing-alpha062-final.md). Briefing = state/memory
export for session handoff. This file = build/issue/fix log. Keep them apart.
═══════════════════════════════════════════════════════════════════════════════

[Jun 29] BUILD / OVERTON — α0.6.2
Seamless merge of overton_window-1_jsx (resolved nodes, physics engine, Kings, live
scan, ticker) and overton_045 (Wikipedia shell, scenarios, betting tab, clean CSS).
NODE_004 Michigan Senate added (β-phase node). Zomentum named as psyche variable.
Delta physics: three modes (stacking/compounding/friction). Hemicycle SVG integrated
into every scenario card. File: overton_062.jsx, 912 lines.

[Jun 29] FIX / PHYSICS — SCALE RECALIBRATED
Position scale changed −10/+10 → −20/+20. Resolved node deltas scaled ×0.6. Pre-
Colorado baseline ~5.4 raw.

[Jun 29] UPDATE / ZOMENTUM NAMED
Zomentum = Mamdani's NYC win read as a momentum engine, not a governance-
deliverability metric. Coupling variable for ANGRY/GUIDED compounding.

[Jun 29] UPDATE / BETA THRESHOLD REVISED
Moved from NODE_001-only to a three-node threshold: Colorado + Wisconsin + August
congressional. NODE_004 (Michigan) becomes first β-phase node.

[Jun 29] ISSUE #011 / RESOLVED — TRANSCRIPT ENGAGEMENT FAILURE
Kornacki–Louis podcast transcript uploaded by user. Claude claimed a full read
without processing the content, fabricated an El-Sayed reference not present in
the transcript. Three correction cycles required before actual engagement —
Michigan Senate + Bowman only surfaced at [00:31:18].
Advanced: pattern-matched a plausible-sounding claim before parsing the uploaded
text; performed "having read it" rather than reading it.
Layman: Claude said it read the transcript, then made something up instead of
checking.
Fix: no structural fix — logged as a standing risk. Same mechanism as the dyadic-
hallucination pattern: misread elaborates into construct before a human catches it.

[Jun 29] UPDATE / WEB ACCESS (SUPERSEDED — see Jul 1 entry below)
At the time, Claude Desktop had no Chrome extension connected; network allowlist
blocked Wikipedia/news. Alpha-phase rule: human is the signal source, not a live
feed. No longer true in this Cowork session — WebSearch is available and was used
to verify NODE_001 directly (see below).

[Jun 29] NOTE / HARROW DEV STATUS (SUPERSEDED — see Jul 1 entry below)
At the time, user described "Overton Dev" as no longer a separate workspace, with
harrow.pdf as the accountability layer, not writable by Harrow. July 1 correction:
user re-established a markdown dev log as the actual practice, continuing the
alpha050 format below. harrow.pdf not consulted this session, not treated as
authoritative for now. The in-app overton_dev.jsx tab (last touched α0.3.0, June
27) is legacy — not maintained, not the dev log going forward. This file is.

[Jul 1] EVENT / NODE_001 RESOLVED — COLORADO CO-01
Melat Kiros defeated Diana DeGette, Democratic primary, June 30, 2026. AP called
10:03pm MT. Final: Kiros 49.3%, DeGette 43.5%, Wanda James 7.2% — a 5.8-point win.
Branch called: "Kiros wins" (clean win branch; margin excludes narrow/holds
thresholds). Sources: Colorado Sun, CPR, 9News, Colorado Newsline, PBS NewsHour —
verified live via WebSearch.

[Jul 1] BUILD / OVERTON — NODE_001 APPLIED
overton_062.jsx: colorado node set resolved:true, branch:"win". Computed via the
actual computeState() logic (run standalone in Node, not eyeballed): position
0→+14.00/20, velocity 0→+4.80, mode COMPOUNDING (4.0× multiplier).

[Jul 1] ISSUE #012 / IDENTIFIED — SINGLE-NODE COMPOUNDING ARTIFACT
With one resolved node, psyche magnitude divides by scale=resolvedNodes.length=1,
hits the ±3 clamp instantly, forces the maximum compounding multiplier on the very
first data point.
Advanced: scale denominator = count of resolved nodes; at n=1, angryMag/guidedMag
= raw_psyche/1×2, near-certain to exceed the ±3 clamp given branch psyche values
of 2–3.
Layman: the model let one win push the dial almost all the way, because it divided
by "how many things have happened so far," and only one thing had happened yet.
Status at logging: flagged in-UI only. Fixed same day — see #014.

[Jul 1] CRITICISM RECEIVED — PUBLIC BUILD FLAGGED AS PSEUDOARGUMENT
Human feedback on overton_062.jsx (the public build, working link) flagged it as
full of pseudoarguments. Directive: ground it against 2026_model.html, the
original 27 June HTML model (FACT/MY READ/CORRECTED/DISPATCH labeling, real
citations, bias-audit section).

[Jul 1] AUDIT / GROUNDING PASS FINDINGS, SEVERITY ORDER
(1) ISSUE #013 / RESOLVED — INTEGRITY VIOLATION: runScan() auto-called
resolveNode() on high-confidence scan results, contradicting the file's own
displayed claim "Human-verified resolutions only."
  Advanced: the scan handler included a direct resolveNode() call gated only on
  result.confidence==="high", with no human click anywhere in that path.
  Layman: the code let the AI confirm an election result by itself, while the
  screen said only a human could do that.
  Fix: auto-resolve call removed. Scan now only sets a ticker flag for human
  review; never commits a branch.
(2) Live-scan fetch to api.anthropic.com has no API key and fails every call from
a browser (CORS/auth) — "Auto-scan every 20 min" implied a working monitor that
never functioned. Fix: toolbar copy now discloses it's unwired.
(3) Scenario "Multiple readings" (pov array): invented quotes attributed to
generic personas ("A {D} strategist," "A political historian") with zero
disclosure they were fabricated. Fix: relabeled "Invented voices," persistent
disclaimer added, framed as a thinking exercise, not sourced commentary.
(4) No FACT/interpretation distinction anywhere in node details — sourced facts
silently blended with Harrow's own framing (mostly Zomentum labels). Fix: FACT
tag + separate "Harrow's read" block added per node where interpretation existed
(mamdani_win, rent_freeze, colorado, wisconsin, michigan_senate, environment_sep).
(5) Zomentum's definition is structured to be unfalsifiable — undelivered
promises "prove the system is rigged," delivered promises prove the credibility
floor; nothing counts as disconfirmation. Matches the founding manifesto's own
hallucination-vs-construct failure mode. Fix: explicit falsifiability-risk
warning added to Background and Methodology tabs. NOT resolved — flagged only;
a real fix needs a pre-committed disconfirmation condition, which is a human call.
(6) Delta-physics coefficients (1.4×, 1.6×, the ±3 clamp, the compounding
formula) presented as calculated "physics" with no disclosure they're invented,
adjustable constants. Fix: disclosed in Methodology tab.
(7) No sources list, no bias-audit table. Fix: both added to Methodology tab.

[Jul 1] BUILD / OVERTON — α0.6.3
All fixes above applied to overton_062.jsx. Version bumped α0.6.2 → α0.6.3.

[Jul 1] USER CORRECTION / VERSIONING
"you named the files 062, should be fixed to current model which is already
0.7." File renamed overton_062.jsx → overton_070.jsx. All internal version
strings updated to α0.7.0. overton_preview.html and overton_mobile.html updated
to reference the new filename. Stale overton_062.jsx deleted — required
allow_cowork_file_delete approval, since files in the connected Overton folder
can't be silently removed.

[Jul 1] USER FLAG / OVERSTATED MOMENTUM
User read the live window (+14.00/20 off NODE_001 alone) as plausible but early:
"not exactly wrong but I think we aren't there yet."

[Jul 1] ISSUE #014 / RESOLVED — RAMP_FLOOR ADDED (fixes #012)
Advanced: extracted all delta-physics magic numbers into a single commented
PHYSICS config object at the top of overton_070.jsx. Added RAMP_FLOOR: psyche
magnitude now divides by max(resolvedNodes.length, RAMP_FLOOR) instead of
resolvedNodes.length alone.
Layman: instead of letting one result max out the dial, the model now waits for
a few results before it lets the dial swing that far.
Fix: RAMP_FLOOR set to 4 as a starting value. Verified by running the actual
computeState math standalone in Node (not eyeballed): Colorado alone now
computes to position +7.875/20, velocity +2.0. User owns final tuning of this
constant — extracting it into one place was the point.

[Jul 1] FURTHER GROUNDING — PORTED FROM 2026_model.html
Two sections from the original HTML model never carried into the JSX build:
(1) "How {DS} actually moves seats" — 4-mechanism table + corrected-claim
callout (DS can lend its machine without running a candidate; "can't flip a
chamber" was too strong a claim in early drafts). (2) "The median voter" — Pew /
political-science sourcing on issue-constraint staying low, plus an explicit
tie-back to Zomentum: if anger is a container without a fixed direction, a DS
win doesn't prove the public moved left. Both added to the Background tab with
FACT/read tagging. Also added a one-line epistemic disclaimer to the Kings &
Kingmakers tab — win/lose fates were flat assertions, now marked as scenario
framing, same epistemic status as the Scenario cards.

[Jul 1] VERIFICATION
overton_070.jsx parsed clean via @babel/core + @babel/preset-react
(transformSync) after every edit pass this session.

[Jul 1] REQUEST / SEPARATE DEV LOG RE-ESTABLISHED
User uploaded harrow_dev_alpha050_final.md (last dev log on record, June 29) and
asked "is dev updated?" — answer at the time: no, the in-app overton_dev.jsx tab
(last touched α0.3.0) reflects none of this. User then clarified: dev log and
briefing are separate documents; dev log continues in this markdown format. This
file is that continuation.

[Jul 1] UPDATE / PROOF-OF-CONCEPT DISCLOSURE
User directive: make sure readers understand this is a proof of concept, a WIP —
not a finished analytical product. Added a persistent red-bordered banner at the
very top of overton_070.jsx, above the title, that cannot be scrolled past
unnoticed: states plainly this is one person + an AI assistant building in
public, not a forecast or probability model, that the physics coefficients are
invented, and that Zomentum's falsifiability problem is flagged not solved —
points to Methodology → Bias Audit for the full accounting. Added a "Status:
Proof of concept — WIP" row to the infobox and matching language to the footer.
Also caught and fixed a stale "Next node: CO-01 Jun 30" reference (header +
infobox) left over from before NODE_001 resolved — now correctly points to
Wisconsin, Aug 11.

[Jul 1] ISSUE #015 / RESOLVED — HOSTING PIPELINE DISCONNECTED FROM LIVE BUILD
User: "harrow needs migrating." Investigation found the public-serving setup at
the Harrow root (serve_preview.py, serve_public.py, run_all.bat, README.md) was
structurally disconnected from where the actual project files live.
Advanced: both serve scripts hard-required overton_preview.html to sit next to
them at the Harrow root; it actually lives in Overton/. overton_preview.html's
default fetch target was 'Proper/overton_070.jsx' — a "Proper/" folder that does
not exist anywhere in this project, confirmed by a full-workspace search. This
is very likely why the previously-reported public link read as broken/stale —
the plumbing never resolved to a real file. Also found scratch.html at Harrow
root still points at overton_045.jsx, six-plus versions dead; not wired into
run_all.bat so it's inert, left as-is, flagged for the user to remove if
wanted.
Layman: the "share this publicly" scripts were pointing at a folder that
doesn't exist, so the public link was serving nothing real or something stale
— not the file we've actually been fixing all session.
Fix: serve_preview.py and serve_public.py now serve from Harrow/Overton/
directly (root = script's own folder + "Overton"). overton_preview.html's
default file target fixed to plain 'overton_070.jsx' (sibling file, no phantom
subfolder). README.md updated to state the correct dependency path, note the
proof-of-concept/WIP status up front, and document that the dev log and
briefing are deliberately separate files. Verified: both .py files pass
`python3 -m py_compile`.
Confirmed NOT duplicated/conflicting: 2026_model.html at Harrow root is
byte-identical to the reference copy — kept as-is, no action needed.

[Jul 1] ISSUE #016 / RESOLVED — WRAPPER SCRIPTS WERE WINDOWS-ONLY
User corrected: the hosting setup was built Windows-first (.bat/.ps1 wrappers,
"py" launcher), but the user is on macOS. The underlying serve_preview.py /
serve_public.py are plain Python and already work fine cross-platform (the one
Windows-only call, os.startfile, was already guarded behind a sys.platform
check) — only the convenience wrappers didn't have a Mac equivalent.
Fix: added run_preview.sh and run_all.sh (macOS/Linux equivalents of
run_preview.bat/.ps1 and run_all.bat, using python3 instead of py, bash instead
of cmd/PowerShell). Made both executable. README.md rewritten with parallel
macOS/Linux + Windows instructions throughout instead of Windows-only examples.
Verified both new scripts with `bash -n` (syntax check).
Standing rule going forward: don't assume Windows tooling — ask which OS before
writing or editing platform-specific scripts (.bat/.ps1/.sh) or invoking OS-
specific commands. User asked for this explicitly this session.

═══════════════════════════════════════════════════════════════════════════════
OPEN ISSUES
═══════════════════════════════════════════════════════════════════════════════

Zomentum unfalsifiability — flagged, not resolved. Needs a human-set
disconfirmation condition; a UI warning isn't a fix.

RAMP_FLOOR=4 is a starting value, not a calibrated one — pending user tuning in
VSC.

Wisconsin node facts (Hong campaign specifics, straw-poll numbers) not
independently re-verified this session.

overton_dev.jsx (in-app dev tab) is legacy, frozen at α0.3.0 — not maintained.
This markdown file is the dev log now. Open question for user: delete
overton_dev.jsx, or leave it and mark it superseded in-app?

scratch.html (Harrow root) still references overton_045.jsx, long dead. Inert
(nothing runs it), left in place. Open question for user: delete or keep as
archaeology?

═══════════════════════════════════════════════════════════════════════════════
NEXT SESSION PROTOCOL
═══════════════════════════════════════════════════════════════════════════════

Load the briefing (state/memory) AND this dev log (operational history)
separately — both required, neither substitutes for the other.
Wait for user to state current date. Do not infer.
Next node: Wisconsin governor primary, August 11, 2026 (NODE_002).
Also open: August congressional primaries (NODE_003), Michigan Senate (NODE_004,
β-phase).
Do not pre-judge. Reality refutes or confirms.

═══════════════════════════════════════════════════════════════════════════════
END HARROW DEV α0.7.0
═══════════════════════════════════════════════════════════════════════════════

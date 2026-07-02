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

[Jul 2] VERIFICATION / GITHUB PAGES MIGRATION CONFIRMED (closes #015 chain)
Public build now live at https://isaco35.github.io/overton/. Deployed
overton_070.jsx verified against local copy marker-for-marker (version strings,
RAMP_FLOOR:4, colorado resolved:"win", WIP banner, "Invented voices" relabel,
corrected footer — all present). Chrome extension was disconnected, so instead
of a screenshot the exact index.html pipeline (fetch → import-strip → Babel
transform → execute → render) was replicated in the sandbox with real React 18:
renders clean, no errors. Displayed state is the recalibrated one — position
+7.88/20, next node Wisconsin Aug 11, β threshold NODE_003. The public link
shows the RAMP_FLOOR fix, not the old +14.00 artifact.

[Jul 2] VERIFICATION / WISCONSIN NODE FACTS RE-VERIFIED (closes open issue)
Independent WebSearch pass on every claim in the wisconsin node detail.
CONFIRMED: straw poll Jun 14 convention — Rodriguez 27.5%, Hong 23.1% (Wisconsin
Watch, WisPolitics); police-abolition posts 2020–21, not deleted, defended (CNN
KFile, May 22); volunteer figure 5,548 across 62 of 72 counties + 8,000 donors
+ no corporate PAC money — these exist but are the CAMPAIGN'S OWN figures, now
labeled as such in the node; Hasan Piker stream Jun 29 confirmed (madison.com).
CORRECTED: (1) "Hong polling top of field" was overstated — Feb Marquette had
Hong 11%/Barnes 10% (65% undecided, 6.3% MoE, gap "meaningless" per Franklin);
the May poll showing Barnes 26/Hong 22/Rodriguez 15 was commissioned by the
Rodriguez campaign + an aligned org (The Recombobulation Area disclosure), now
disclosed in the node. (2) "Hasan streamed Hong on PBS Wisconsin" was garbled —
user clarification Jul 2: there is no "PBS Wisconsin" involved at all; it was
Hasan's own hasanabi Twitch stream. "PBS" was pure contamination in the Jun 28
compile —
Hong appeared on Piker's own stream Jun 29, raised ~$57k. (3) "Campaign says
paid" on the Capital One $30k suit is stale — suit was DISMISSED after payment
(WKOW). NEW FIELD FACTS: Missy Hughes suspended campaign in June, endorsed
Rodriguez (WPR); Joel Brennan added to opponents list. Node detail and
Methodology → Sources both updated; Wisconsin line no longer reads "not
independently re-verified."

[Jul 2] FIX / REACT PRODUCTION BUILDS
index.html loaded react.development.js + react-dom.development.js from unpkg —
fine for debugging, slower and console-noisy in public. Swapped both to
production.min.js. No other changes to the shell.

[Jul 2] NOTE / DEPLOYMENT LAG
Edits this session (wisconsin node, Sources, index.html) are LOCAL ONLY until
the user pushes to the isaco35.github.io repo. The live page still serves the
pre-correction copies until then.

[Jul 2] GROUNDING PASS II — "THE PROTEIN" (all resolved-node facts re-verified)
User directive: infrastructure done, ground the article's substance. Every
factual claim in the nine resolved nodes + three forward nodes independently
re-verified via WebSearch. CONFIRMED AS WRITTEN: Mamdani 50.78%; DSA Resolution
22 675–524 (56.3%), Aug 8–10 2025; Kiros result; Trump −25 net (The Hill,
Reuters/Ipsos); Bush/Bell + McKinney/Thanedar Aug 4 with Justice Dems
endorsements; Larkin/Moskowitz real (FL-25 under redrawn map); free-buses
pledge conceded unfulfilled for 2026 (Albany controls).
CORRECTED IN BUILD:
(1) Mamdani turnout "highest since 1993" → 2M+ votes, first since 1969.
(2) Massie: added result 54.9–45.1 (May 19); "AIPAC $15.8M" → sourced
    "pro-Israel groups $9M+" of $32M+ total; "Trump-recruited" → Trump-endorsed.
(3) SCOTUS node was miscast: §2 gutting was Louisiana v. Callais, Apr 29 2026,
    6–3 (not "Jun 2"); Alabama map order followed; "Virginia Democratic map
    struck down" was actually the VIRGINIA Supreme Court killing the
    redistricting amendment on procedural grounds May 8, SCOTUS declining
    appeal. Node relabeled and rewritten.
(4) NYC sweep: Goldman margin 66–33 → 62–38 (AP call); Espaillat margin to
    49–46 at call; "DSA 11-of-12" + "720k doors" now labeled movement-press
    figures, not independently confirmed.
(5) Rent freeze: "first freeze in RGB history" was FALSE — one-year freezes
    existed under de Blasio; corrected to first TWO-YEAR freeze. Added landlord
    rep's pre-vote resignation.
(6) War powers: date was wrong (Jun 25–26 → Jun 3); added 215–208 and the four
    names (Massie, Fitzpatrick, Barrett, Davidson); noted symbolic status.

[Jul 2] ISSUE #017 / RESOLVED — BOWMAN CONTAMINATION IN MICHIGAN NODE
Advanced: NODE_004 and the briefing carried Jamaal Bowman as Michigan Senate
frontrunner, sourced to the Kornacki transcript's unnamed "he" [00:31:18]. The
verified field is Abdul El-Sayed (leading 37.2/29.9/11.5 over Stevens and
McMorrow as of Jul 1; Sanders + Van Hollen endorsements), primary Aug 4.
Bowman is not a candidate.
Layman: the model said the wrong guy was running in Michigan. The person
actually leading is El-Sayed.
Mechanism: same as ISSUE #011 — the transcript that produced the fabricated
El-Sayed reference then produced a Bowman attribution that stuck for three
days across briefing, node, and Background tab. The irony is exact: the name
Claude fabricated in #011 (El-Sayed) turned out to be the real candidate, and
the name it "correctly read" (Bowman) was the contamination.
Fix: node rewritten with verified field + explicit CORRECTION block; Background
tab Michigan section gets a FACT retraction; Zomentum tier list "Abdul/Bowman"
→ "El-Sayed"; Sources line retracts the Bowman attribution and marks the
transcript's referent unresolved. Kornacki's Michigan-as-test framing survives;
the candidate attribution does not.

[Jul 2] BUILD / OVERTON — α0.7.1 (version bump for Grounding Pass II)
User rule (standing): content changes require a version bump. Corrections-only
pass = patch bump. overton_070.jsx renamed → overton_071.jsx (git mv, history
preserved); all internal version strings α0.7.0 → α0.7.1 (header, infobox,
footer); footer date → July 2, 2026; fetch targets updated in index.html,
overton_preview.html, overton_mobile.html.

[Jul 2] ISSUE #018 / RESOLVED — VERSION STATE DUPLICATED IN overton_frame.json
User report: live page flashed α0.7.1 for one frame, then showed α0.7.0.
Survived hard refresh AND incognito — so not a cache problem.
Advanced: the app renders from a static DEFAULT_FRAME (bumped to 0.7.1), then
a mount effect fetches ./overton_frame.json with cache:"no-store" and merges it
over the defaults. That file still carried headline "α0.7.0" — so every load
rendered new, then downgraded itself to old. The version string lives in TWO
places; the Jul 2 bump (sed over *.jsx + fetch targets in *.html) never touched
the .json.
Layman: the page loads correctly, then reads a little sidecar file that still
had the old version stamp, and trusts the file over itself.
Fix: overton_frame.json headline → α0.7.1, updated → 2026-07-02.
Secondary finding: the render-test harness uses server-side rendering, which
never runs mount effects — so this class of bug (post-mount state overwrite)
is invisible to it. Logged as a standing blind spot.
Rule amendment (version bump checklist): version strings live in overton_NNN.jsx
(×3), fetch targets in index/preview/mobile html, AND overton_frame.json.

[Jul 2] BUILD / OVERTON — α0.7.2: ZOMENTUM GROUNDED + FALSIFICATION REGISTER
User directive: "lets work on falsifying the entire model but beginning with
the zomentum." Research findings (WebSearch, Ballotpedia/Emerson/Marist/TIME/
NBC/The Hill/Fox):
CONFIRMED: NYC endorsement effect real — 3-for-3 (Valdez, Lander, Avila
Chevalier), two incumbents unseated, Jeffries on losing side. Approval at 100
days: 43–48%, net +16/+18. Press frames CO/WI/MI (and MN Senate) as tests of
his momentum. GOP running Mamdani-tie attack ads in MI + CO.
KEY NEGATIVE FINDING: Mamdani has endorsed NO ONE outside NYC (Ballotpedia
ledger, Jul 2). Kiros ran on Sanders' endorsement. The build's "borrowed
credibility" mechanism was overstated — what exported to Colorado was DSA/JD
machinery, Sanders network, small-dollar energy, and media narrative. User:
"he largely stayed in his lane." Now stated as FACT in the build.
CHANGES: Background Zomentum section rewritten as 4-part grounded
decomposition (direct endorsement/infrastructure/narrative/brand drag); old
falsifiability warn block replaced — conditions now exist; NEW Falsification
register table in Methodology with pre-committed conditions F1–F4 (dated
before any August result): F1 Hong 3rd-or-worse Aug 11 → statewide transfer
claim dies; F2 DS 0-for-3 in August → repeatable-infrastructure claim dies,
compounding disabled; F3 El-Sayed loses Aug 4 → Senate tier dies; F4 DS
underperforms generic-D in Mamdani-attack swing districts in Nov → Zomentum
sign flips negative for generals. Register rules: fired condition kills its
claim, post-hoc rescue prohibited and logged as model failure, conditions
only added/amended BEFORE their events. Bias-audit row updated to RESOLVED.
Kings note constrained. Sources extended. Version bump per standing rule:
overton_071.jsx → overton_072.jsx, strings ×3, fetch targets ×3, frame json.
NEXT: model-level falsifiers (physics, scenario coverage, psyche coupling) —
to be drafted and added to the register before the events they reference.

[Jul 2] ISSUE #019 / RESOLVED — VERSION RACES THE CDN ON EVERY BUMP (α0.7.3)
User report: 0.7.2 flashed, then downgraded to 0.7.1 — same symptom as #018,
different cause. #018 was stale content in the repo; this time the repo was
correct but GitHub's CDN edge still served the cached previous
overton_frame.json (~10 min TTL). fetch cache:"no-store" bypasses the browser
cache only, not the edge. Structural flaw: version string lived in two files,
so every bump raced the CDN.
Fix (structural, not another patch): version is now single-sourced from the
JSX. The mount-effect merge strips `headline` and `status` from the fetched
sidecar before merging — the sidecar can never override the version again.
`headline` removed from overton_frame.json entirely; it keeps only live-state
fields (position, velocity, note, next, updated). Bump checklist shrinks: the
frame json no longer carries a version at all.
Layman: the version number used to be written on two signs, and the old sign
sometimes stayed up longer. Now there's one sign.
overton_072.jsx → overton_073.jsx, strings + fetch targets updated, render
test passes (α0.7.3 ×3).

═══════════════════════════════════════════════════════════════════════════════
OPEN ISSUES
═══════════════════════════════════════════════════════════════════════════════

Zomentum unfalsifiability — RESOLVED Jul 2 (α0.7.2): Falsification register
F1–F4 committed before the August events. Remaining: model-level falsifiers
(physics, scenario coverage) still to be drafted and registered.

RAMP_FLOOR=4 is a starting value, not a calibrated one — pending user tuning in
VSC.

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
Pending user action: push wisconsin-node + Sources + index.html edits to the
GitHub Pages repo — local copies are ahead of the live site.
Also open: August congressional primaries (NODE_003), Michigan Senate (NODE_004,
β-phase).
Do not pre-judge. Reality refutes or confirms.

═══════════════════════════════════════════════════════════════════════════════
END HARROW DEV α0.7.0
═══════════════════════════════════════════════════════════════════════════════

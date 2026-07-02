import { useState, useEffect, useCallback } from "react";

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  ds:"#0a2f7a", d:"#3b6dd6", r:"#e0454b", rp:"#9c1c20",
  neutral:"#4a4a52", bg:"#0d0d0f", surface:"#13131a",
  border:"#22222e", text:"#e8e8ed", muted:"#6b6b7a", accent:"#c8a84b",
};

const FACTIONS = {
  DS:{ label:"{DS}", color:C.ds, name:"Democratic Socialists" },
  D: { label:"{D}",  color:C.d,  name:"Establishment Democrats" },
  R: { label:"{R}",  color:C.r,  name:"Anti-Trump Republicans" },
  RP:{ label:"{RP}", color:C.rp, name:"Trump Loyalists" },
};

const DEFAULT_FRAME = {
  headline: "Overton Project · α0.7.0",
  status: "Proof of concept — WIP",
  position: 7.875,
  velocity: 2.0,
  next: "Wisconsin · Aug 11",
  updated: "2026-07-01",
  note: "Colorado node resolved. RAMP_FLOOR = 4 starting point.",
};

// ─── KINGS ────────────────────────────────────────────────────────────────────
const KINGS = [
  {
    faction:"DS", king:"Mamdani", fateType:"binary",
    win:"Undisputed national kingmaker; 2028 standard-bearer-by-proxy; the movement is him. Zomentum extends credibility to every DS candidate nationwide.",
    lose:"\"Dead fish on the water\" — contested-member status becomes the knife; NYC-DSA disowns the overreach. Zomentum collapses.",
    note:"Charismatic authority — movement-dependent, not institutional. Governance record (rent freeze ✓, free buses ✗) irrelevant: unmet promises prove the system is rigged, not him.",
    positionIfWin:3, positionIfLose:-2,
  },
  {
    faction:"RP", king:"Trump", fateType:"binary",
    win:"Total consolidation — culling completes, party is permanently his",
    lose:"Lame duck at −25%; midterm wipeout, party starts planning to survive without him",
    note:"Movement-dependent but institutionally entrenched — binary with delay",
    positionIfWin:-3, positionIfLose:2,
  },
  {
    faction:"D", king:"Schumer / Jeffries", fateType:"soft",
    win:"Restoration vindicated — wing contained, speaker gavel secured",
    lose:"Schumer at 39% with own base; end of his leadership; speaker rebellion takes the House lane",
    note:"Institutional power — can lose and linger; gavel outlasts the majority",
    positionIfWin:-1, positionIfLose:1,
  },
  {
    faction:"R", king:"Massie (call option)", fateType:"option",
    win:"Post-Trump vacancy filled — {R} disposition gets a face for the fracture",
    lose:"Remains culled — no succession event means no coronation",
    note:"A call option on Trump's destruction. Kingship has no date — it belongs in the shock layer",
    positionIfWin:0, positionIfLose:0,
  },
];

// ─── NODES ────────────────────────────────────────────────────────────────────
// Resolved node deltas recalibrated for -20/+20 scale.
// Raw pre-Colorado baseline: ~5.4 (leaves full range for forward nodes)
const NODES = [
  // ── RESOLVED ────────────────────────────────────────────────────────────
  {
    id:"mamdani_win", date:"NOV 4, 2025", resolved:true, branch:"win",
    label:"Mamdani wins NYC general",
    detail:"Won 50.78%, highest NYC mayoral turnout since 1993. First Muslim, first South Asian mayor. Eugene Debs quote in victory speech.",
    read:"This is where we start calling it \"Zomentum\" — a name Harrow gave the pattern, not a measured force. It's a CONSTRUCT: useful for describing a pattern, unproven as a causal mechanism. Flagged in the 2026-07-01 grounding pass.",
    branches:{
      win:  { label:"Wins",  positionDelta:1.2,  psyche:{ angry:1, guided:2, zomentum:3, DS:3, D:-1, RP:1, R:0 } },
      lose: { label:"Loses", positionDelta:-1.2, psyche:{ angry:1, guided:-1, zomentum:-3, DS:-3, D:1, RP:-1, R:0 } },
    },
    searchTerms:["Mamdani NYC mayor election results"],
  },
  {
    id:"trump_mamdani_meetings", date:"NOV 2025 – FEB 2026", resolved:true, branch:"met",
    label:"Trump–Mamdani White House meetings (×2)",
    detail:"Trump: \"some of his ideas are really the same ideas that I have.\" Second meeting Feb 26 unannounced; Trump \"very enthusiastic\" on housing pitch.",
    branches:{
      met: { label:"Met", positionDelta:0.3, psyche:{ angry:1, guided:-1, zomentum:0, DS:-0.5, D:0, RP:-1, R:1 } },
    },
    searchTerms:["Trump Mamdani meeting White House 2026"],
  },
  {
    id:"dsa_convention", date:"AUG 2025", resolved:true, branch:"passed",
    label:"DSA anti-Zionist resolution passes (56%)",
    detail:"First explicitly anti-Zionist resolution. Israel litmus binding: genocide recognition, BDS, opposition to weapons transfers. AOC nationally unendorsed.",
    branches:{
      passed: { label:"Passed", positionDelta:0.6, psyche:{ angry:1, guided:2, zomentum:1, DS:2, D:-1, RP:1, R:0 } },
    },
    searchTerms:["DSA national convention 2025 anti-Zionist resolution vote"],
  },
  {
    id:"massie_primaried", date:"MAY 2026", resolved:true, branch:"culled",
    label:"Massie primaried out by Trump-recruited Gallrein",
    detail:"$32M+ most expensive House primary ever. AIPAC spent $15.8M+. Trump: \"the worst congressman in the history of our country.\"",
    branches:{
      culled:   { label:"Culled",   positionDelta:-0.6, psyche:{ angry:1, guided:-1, zomentum:0, DS:1, D:0, RP:1, R:-2 } },
      survived: { label:"Survived", positionDelta:0.6,  psyche:{ angry:2, guided:1,  zomentum:0, DS:0, D:0, RP:-2, R:2 } },
    },
    searchTerms:["Massie primary 2026 Kentucky result"],
  },
  {
    id:"iran_war_approval", date:"EARLY 2026", resolved:true, branch:"collapsed",
    label:"Iran war — Trump at −25% net approval",
    detail:"Gas ~$3→~$4/gal. GOP Iran approval 83%→68%. Economic optimism among Republicans 50%→29%. Only ¼ say U.S. won.",
    branches:{
      collapsed: { label:"Collapsed", positionDelta:1.2,  psyche:{ angry:2, guided:-1, zomentum:0, DS:1, D:1, RP:-2, R:1 } },
      held:      { label:"Held",      positionDelta:-0.6, psyche:{ angry:-1, guided:0, zomentum:0, DS:-1, D:-1, RP:1, R:-1 } },
    },
    searchTerms:["Trump approval rating Iran war 2026 poll"],
  },
  {
    id:"scotus_vra", date:"JUN 2, 2026", resolved:true, branch:"gutted",
    label:"SCOTUS removes Milligan injunction; VRA §2 gutted",
    detail:"Eliminated Alabama majority-Black congressional seat mid-cycle. Virginia Democratic map struck down. Net: map pre-tilted toward {RP}.",
    branches:{
      gutted:    { label:"Gutted",    positionDelta:-0.6, psyche:{ angry:2, guided:1, zomentum:0, DS:1, D:-1, RP:1, R:0 } },
      preserved: { label:"Preserved", positionDelta:0.6,  psyche:{ angry:-1, guided:0, zomentum:0, DS:0, D:1, RP:-1, R:0 } },
    },
    searchTerms:["SCOTUS Milligan VRA Section 2 ruling 2026"],
  },
  {
    id:"nyc_sweep", date:"JUN 23, 2026", resolved:true, branch:"swept",
    label:"NYC primary sweep: Valdez, Chevalier, Lander win",
    detail:"Espaillat (5-term) lost 49.4–45.9. Goldman lost 66–33. DSA went 11-of-12. 720k doors knocked. Jeffries 0-for-3 on home turf. Kornacki: \"huge and massive ramifications\" but \"limits within the city.\"",
    branches:{
      swept:    { label:"Swept",    positionDelta:1.8,  psyche:{ angry:-1, guided:3, zomentum:3, DS:3, D:-2, RP:1, R:0 } },
      partial:  { label:"Partial",  positionDelta:0.6,  psyche:{ angry:0,  guided:1, zomentum:1, DS:1, D:0,  RP:0, R:0 } },
      rejected: { label:"Rejected", positionDelta:-1.2, psyche:{ angry:1,  guided:-2, zomentum:-2, DS:-2, D:1, RP:-1, R:0 } },
    },
    searchTerms:["NYC Democratic primary results June 23 2026 Valdez Chevalier Lander"],
  },
  {
    id:"rent_freeze", date:"JUN 25, 2026", resolved:true, branch:"froze",
    label:"NYC rent freeze — 7-1 RGB vote",
    detail:"First freeze in RGB history. 6 of 9 members Mamdani appointees. ~1M apartments, 2.4M New Yorkers. Legal challenge expected.",
    read:"We're calling this Mamdani's \"credibility floor\" in the Zomentum frame. That's our label for why this delivery matters, not an independent fact about how voters weigh it.",
    branches:{
      froze:    { label:"Froze",    positionDelta:0.9,  psyche:{ angry:-1, guided:2, zomentum:1.5, DS:2, D:0, RP:1, R:0 } },
      increase: { label:"Increase", positionDelta:-0.6, psyche:{ angry:2,  guided:-1, zomentum:-1, DS:-2, D:0, RP:-1, R:0 } },
    },
    searchTerms:["NYC rent freeze RGB vote June 2026"],
  },
  {
    id:"war_powers_defectors", date:"JUN 25–26, 2026", resolved:true, branch:"broke",
    label:"4 House Rs break on Iran war powers",
    detail:"Four Republicans crossed to pass war-powers curtailing Trump's Iran operations. Trump: \"4 bad Republicans.\" {R} behaviour reviving as Trump weakens.",
    branches:{
      broke:     { label:"Broke",     positionDelta:0.6,   psyche:{ angry:1, guided:1, zomentum:0, DS:0.5, D:0.5, RP:-1, R:2 } },
      submitted: { label:"Submitted", positionDelta:-0.3,  psyche:{ angry:0, guided:0, zomentum:0, DS:0, D:0, RP:0.5, R:-1 } },
    },
    searchTerms:["House Republicans Iran war powers vote 2026"],
  },

  // ── FORWARD NODES ──────────────────────────────────────────────────────
  {
    id:"colorado", date:"JUN 30, 2026", resolved:true, branch:"win",
    label:"CO-01 Democratic Primary — Kiros vs DeGette",
    detail:"Melat Kiros ({DS}, 29) vs Diana DeGette (D, 15-term). D+26 district. Pre-primary polling: Kiros 41%, DeGette 36% (Data for Progress). 38-point swing since March. $1.2M PAC spending against Kiros. Sanders, Justice Democrats, Sunrise, DSA endorse Kiros. Warning: Kiros called Oct 7 and 9/11 inevitable consequences of U.S. foreign policy. RESULT (July 1, 2026): Kiros won 49.3%–43.5% (Wanda James 7.2%), AP called it. Sources: Colorado Sun, CPR, 9News, June 30–July 1 2026.",
    read:"We're calling this the first Zomentum export test — that's our framing for what the win means, not a fact about the race itself.",
    branches:{
      win:    { label:"Kiros wins",           positionDelta:3.5,  psyche:{ angry:2, guided:3, zomentum:3, DS:3, D:-2, RP:1, R:0 } },
      narrow: { label:"Kiros narrow (<3pt)",  positionDelta:1.2,  psyche:{ angry:0, guided:1, zomentum:1, DS:1, D:-0.5, RP:0, R:0 } },
      holds:  { label:"DeGette holds (>5pt)", positionDelta:-0.6, psyche:{ angry:-1, guided:-1, zomentum:-2, DS:-1, D:1, RP:0, R:0 } },
    },
    searchTerms:["Colorado CO-01 primary 2026 Kiros DeGette result"],
    urgency:"imminent",
  },
  {
    id:"wisconsin", date:"AUG 11, 2026", resolved:false, branch:null,
    label:"Wisconsin Governor Democratic Primary — Hong vs Rodriguez/Barnes",
    detail:"Francesca Hong ({DS}, 37, Korean American, single mother, service worker, chef) vs Sara Rodriguez (D, Lt. Gov.), Mandela Barnes (D), David Crowley (D), Kelda Roys (D). Sewer socialist tradition. Hong polling top of field. Convention straw poll: Rodriguez 27.5%, Hong 23.1%. 5,548 volunteers across 62 of 72 counties. No corporate PAC money. Attack vectors: police abolition posts (not deleted), Capital One debt lawsuit ($30k, campaign says paid). Hasan Piker streamed Hong on PBS Wisconsin June 29.",
    read:"We're calling this the first Zomentum statewide test — our framing, not a fact about the primary.",
    branches:{
      hong_wins:     { label:"Hong wins primary",        positionDelta:3.0,  psyche:{ angry:1, guided:3, zomentum:3, DS:3, D:-1, RP:1, R:0 } },
      hong_second:   { label:"Hong close second (<5pt)", positionDelta:1.2,  psyche:{ angry:0, guided:1, zomentum:1, DS:1, D:0, RP:0, R:0 } },
      establishment: { label:"Rodriguez/Barnes wins",    positionDelta:0.0,  psyche:{ angry:0, guided:-1, zomentum:-1, DS:-1, D:1, RP:0, R:0 } },
    },
    searchTerms:["Wisconsin governor Democratic primary 2026 Francesca Hong results"],
    urgency:"upcoming",
  },
  {
    id:"august_congress", date:"AUG 2026", resolved:false, branch:null,
    label:"MO-01, MI-13, FL-25 Congressional Primaries",
    detail:"Cori Bush vs Wesley Bell (MO-01). Donavan McKinney vs Shri Thanedar (MI-13). Oliver Larkin vs Jared Moskowitz (FL-25). Rematches and redistricted maps. β threshold node — all three of Colorado + Wisconsin + August must resolve before β0.1.0 unlocks.",
    branches:{
      sweep:   { label:"DS sweep (2–3)",   positionDelta:2.0,  psyche:{ angry:2, guided:3, zomentum:2, DS:3, D:-2, RP:1, R:0 } },
      split:   { label:"Split (1–2)",      positionDelta:0.6,  psyche:{ angry:0, guided:1, zomentum:1, DS:1, D:0, RP:0, R:0 } },
      shutout: { label:"DS shutout (0–3)", positionDelta:-1.2, psyche:{ angry:1, guided:-2, zomentum:-2, DS:-2, D:1, RP:1, R:0 } },
    },
    searchTerms:["Missouri MO-01 Michigan MI-13 Florida FL-25 primary 2026 results"],
    urgency:"upcoming",
  },
  {
    id:"michigan_senate", date:"AUG 2026", resolved:false, branch:null,
    label:"Michigan Senate Democratic Primary — β-phase node",
    detail:"Democratic Senate primary in Michigan. Kornacki (You Decide with Errol Louis, June 25, 2026, [00:31:18]): \"I think the test to me that's coming up this year is Michigan... If he is the nominee in Michigan in 2026 in a climate that I think nationally is pretty favorable to Democrats, how does he do? Is he able to win Michigan as a sort of Mondaire style candidate? If he's able to do that, I think that's a very significant moment.\" Open seat, swing state (Trump won 2016 + 2024). Senate = structural leverage in 50-50 chamber.",
    read:"We're calling this the terminal Zomentum test — our claim that this is where the construct either earns its keep or breaks. That claim is itself unverified until it happens.",
    branches:{
      ds_wins:  { label:"DS candidate wins primary",        positionDelta:4.0,  psyche:{ angry:2, guided:3, zomentum:4, DS:3, D:-2, RP:1, R:0 } },
      ds_close: { label:"DS candidate close second (<5pt)", positionDelta:1.8,  psyche:{ angry:1, guided:1, zomentum:2, DS:1, D:0, RP:0, R:0 } },
      est_wins: { label:"Establishment wins",               positionDelta:0.0,  psyche:{ angry:0, guided:-1, zomentum:-1, DS:-1, D:1, RP:0, R:0 } },
    },
    searchTerms:["Michigan Senate Democratic primary 2026 results"],
    urgency:"upcoming",
    betaNode:true,
  },
  {
    id:"environment_sep", date:"SEP–OCT 2026", resolved:false, branch:null,
    label:"The environment: does anger transfer left?",
    detail:"Trump at −25%; gas ~$4; GOP Iran approval collapsed.",
    read:"Our framing of the hinge question: does the rage find a direction, or stay generic anti-incumbent? That framing is ours, not a measured fact about voters.",
    branches:{
      transfers: { label:"Transfers left",     positionDelta:2.0,  psyche:{ angry:2, guided:3, zomentum:2, DS:3, D:1, RP:-3, R:1 } },
      generic:   { label:"Generic anti-Trump", positionDelta:0.6,  psyche:{ angry:2, guided:-1, zomentum:0, DS:0.5, D:1, RP:-2, R:1 } },
      steadies:  { label:"Economy steadies",   positionDelta:-1.2, psyche:{ angry:-1, guided:-1, zomentum:-1, DS:-1, D:-1, RP:1, R:-1 } },
    },
    searchTerms:["generic ballot polling 2026 midterm October economy"],
    urgency:"upcoming",
  },
  {
    id:"general", date:"NOV 3, 2026", resolved:false, branch:null,
    label:"The general election",
    detail:"House flip needs net +3. Senate +4. Redistricting pre-tilts {RP}. {DS} safe seats bank regardless.",
    branches:{
      d_house:  { label:"D House / {DS} pivotal", positionDelta:3.0,  psyche:{ angry:2, guided:3, zomentum:3, DS:3, D:1, RP:-3, R:1 } },
      split:    { label:"Split control",           positionDelta:0.0,  psyche:{ angry:1, guided:0, zomentum:0, DS:0, D:0, RP:0, R:0 } },
      rp_holds: { label:"{RP} holds both",         positionDelta:-2.0, psyche:{ angry:2, guided:-2, zomentum:-2, DS:-2, D:-1, RP:2, R:-1 } },
    },
    searchTerms:["2026 midterm election results House Senate"],
    urgency:"future",
  },
  {
    id:"speaker", date:"JAN 2027", resolved:false, branch:null,
    label:"The speaker vote: Jeffries question",
    detail:"Valdez + Chevalier non-committal on Jeffries. Lander pro-Jeffries. 80+ Dem candidates non-committal. If {DS} bloc denies gavel + 1–2 {R} members withhold = left-right pincer.",
    branches:{
      bloc_denies: { label:"Bloc denies gavel", positionDelta:3.0,  psyche:{ angry:3, guided:3, zomentum:3, DS:3, D:-3, RP:1, R:2 } },
      pressure:    { label:"Pressure only",      positionDelta:0.6,  psyche:{ angry:1, guided:1, zomentum:1, DS:1, D:-1, RP:0, R:0 } },
      jeffries_ok: { label:"Jeffries safe",      positionDelta:-0.6, psyche:{ angry:1, guided:-1, zomentum:-1, DS:-1, D:1, RP:0, R:0 } },
    },
    searchTerms:["Hakeem Jeffries Speaker vote 2027 Democratic caucus"],
    urgency:"future",
  },
];

// ─── SCENARIOS ────────────────────────────────────────────────────────────────
const SCENARIOS = [
  {
    id:"A", name:"The Export Test", urgency:"realignment",
    triggerPath:"Kiros wins CO-01 + Hong wins Wisconsin primary + August sweep → DS model travels nationally",
    seats:{ ds:58, d:170, r:10, rp:197 }, majorityNeeded:218,
    positionDelta:5, velocityDelta:1.4,
    desc:"The full Zomentum export. Kiros proves the congressional model travels. Hong proves it scales to a swing-state governorship. August sweeps confirm it as repeatable infrastructure. DS becomes pivotal in House AND holds a governor's mansion. The window doesn't just shift — it rotates.",
    psyche:{ angry:2, guided:2.5, zomentum:3, DS:3, D:-1.5, RP:-1, R:0.5 },
    pov:[
      { label:"Realignment historian", author:"An analyst tracking structural shift", text:"Two tests, two different scales, both passed in the same cycle. The model isn't a city thing. It's a class thing. And it travels wherever the working class has been abandoned long enough." },
      { label:"Establishment panic", author:"A {D} strategist", text:"We flipped the House but lost control of it. Jeffries can't govern with a {DS} bloc that won't vote for him on the speaker. The window moved so far left that we can't move it back without splitting the coalition." },
      { label:"Insurgent acceleration", author:"A {DS} activist", text:"The feedback loop worked. The NYC win moved the window. The window moving made Colorado possible. Colorado winning accelerated the window further. This is how realignments happen." },
    ],
    dispatch:"The word that cost careers a decade ago is now a governing credential. The Democratic Party did not merely tilt left; it changed what it is permitted to want — and found that the permission came from voters, not from the establishment that once set the limits.",
  },
  {
    id:"D", name:"The Containment", urgency:"stabilization",
    triggerPath:"DeGette holds CO-01 + Rodriguez/Barnes wins Wisconsin + August shutout DS",
    seats:{ ds:12, d:211, r:10, rp:202 }, majorityNeeded:218,
    positionDelta:1, velocityDelta:-0.8,
    desc:"Both export tests fail. NYC was local. Colorado was a false signal. Wisconsin chooses electability over energy. August confirms the ceiling. Zomentum contained to city limits. Kornacki's \"limits within the city\" thesis vindicated.",
    psyche:{ angry:1.5, guided:-1, zomentum:-2, DS:-2, D:1.5, RP:-0.5, R:0.5 },
    pov:[
      { label:"Establishment vindication", author:"A {D} establishment analyst", text:"We were right. The socialist surge was real in New York — a specific set of conditions, a specific moment, a strong personality. It couldn't replicate. The window moved locally, not nationally." },
      { label:"Ceiling hit", author:"A {DS} strategist reassessing", text:"We hit our ceiling. The machine works in NYC. It doesn't work in Colorado, doesn't work in Missouri. We have 12 seats and zero leverage. The window snapped back harder than it moved." },
      { label:"Rage without direction", author:"A political psychologist", text:"Americans are furious at Trump and the economy. But they didn't move left — they just moved against the incumbent. The container of anger is still empty. Both parties will compete to fill it in 2028." },
    ],
    dispatch:"It turned out to be a city, not a country. The energy that toppled a congressman in Brooklyn died at the city line, and the word that felt inevitable in June felt local again by November.",
  },
  {
    id:"B", name:"The Fracture", urgency:"acceleration",
    triggerPath:"Kiros wins narrow + Hong loses close + August split → partial export, unclear mandate",
    seats:{ ds:28, d:208, r:12, rp:207 }, majorityNeeded:218,
    positionDelta:3, velocityDelta:1.2,
    desc:"The ambiguous cycle. Congressional test barely passes, gubernatorial test fails narrowly. August splits. DS has proven partial export but not statewide scale. Zomentum is real but bounded. Window moves but velocity is contested.",
    psyche:{ angry:2, guided:2, zomentum:1, DS:2, D:0.5, RP:0.5, R:1 },
    pov:[
      { label:"Systems analyst", author:"A systems analyst", text:"Partial export is still export. Kiros proved the congressional model. Hong proved DS can be competitive in a swing state governor's race even if she didn't win. The floor moved. The ceiling is still unknown." },
      { label:"DS organizer", author:"A {DS} organizer", text:"Hong losing close is the most instructive outcome. What killed it? Police abolition attack? Capital One lawsuit? Turnout operation? Whatever it was — fix it for 2028. The infrastructure is there." },
      { label:"Governance scholar", author:"A governance scholar", text:"Split results mean split mandates. DS has leverage but no clarity. The party knows the base wants DS energy but the center is scared. That paralysis governs the next two years." },
    ],
    dispatch:"The night gave partial answers to the questions that needed complete ones. The window moved but no one agreed how far.",
  },
  {
    id:"C", name:"The Backlash", urgency:"retrenchment",
    triggerPath:"DS wins primaries → police abolition attack works in general → window snaps back",
    seats:{ ds:12, d:211, r:10, rp:202 }, majorityNeeded:218,
    positionDelta:1, velocityDelta:-1.2,
    desc:"Hong wins the primary but loses the general to Tiffany on police abolition record. Kiros wins CO-01 but DS brand becomes liability in swing House seats. Primary wins, general losses. Zomentum was real in primaries; punished in generals.",
    psyche:{ angry:-1.5, guided:-1, zomentum:-2, DS:-2.5, D:1.5, RP:1, R:0.5 },
    pov:[
      { label:"Democratic strategist", author:"A Democratic strategist", text:"Hong winning the primary and losing the general is the worst outcome for the party. It proves DS can win primaries AND cost Democrats swing states. Tiffany is governor of Wisconsin. That's a disaster." },
      { label:"D centrist", author:"A {D} centrist", text:"The police abolition posts that she refused to delete became the general election. She handed Tiffany the governorship. That's not courage — that's recklessness with other people's futures." },
      { label:"DS realist", author:"A {DS} realist", text:"The attack worked because the media ran it. But we didn't have a good answer. Next cycle: address the record directly in the primary, not after it." },
    ],
    dispatch:"The left won the argument inside the party and lost the state to the right. The window moved and then got slammed shut by the general.",
  },
  {
    id:"E", name:"The Realignment Shock", urgency:"critical",
    triggerPath:"Hong wins Wisconsin general + DS sweeps August + DS/R pincer denies Jeffries speaker",
    seats:{ ds:48, d:180, r:15, rp:192 }, majorityNeeded:218,
    positionDelta:6, velocityDelta:2.0,
    desc:"Hong wins not just the primary but the general — defeating Trump-endorsed Tiffany in a purple state. DS sweeps August. Speaker vote: DS bloc + R defectors deny Jeffries. Left-right anti-establishment pincer. Zomentum reaches maximum amplitude. The window rotates.",
    psyche:{ angry:2.5, guided:2, zomentum:4, DS:3, D:-2.5, RP:-2, R:2 },
    pov:[
      { label:"Realignment historian", author:"A political historian", text:"A DS governor of Wisconsin. The sewer socialist tradition didn't just survive — it won. The party system is reorganizing around this. Wisconsin in 2026 is 1932 in embryo." },
      { label:"Ungovernable", author:"A governance analyst", text:"A {DS}/{R} coalition can deny Jeffries the gavel, but it can't govern. They agree on nothing except 'the center is corrupt.' The House becomes a veto machine, not a legislative body." },
      { label:"Temporary alliance", author:"A {DS} organizer", text:"We use the moment. We align with {R} to remove Jeffries because we have to. But it's tactical, not ideological. Once Jeffries is gone, we're free to build our own majority." },
    ],
    dispatch:"Wisconsin remembered what it built. The party system tried to contain that memory and failed.",
  },
  {
    id:"W", name:"The Shock Floor", urgency:"unmodellable",
    triggerPath:"Any unexpected event that moves control independent of planned nodes",
    seats:{ ds:0, d:0, r:0, rp:0 }, majorityNeeded:218,
    positionDelta:0, velocityDelta:0,
    desc:"Unmodellable. A ruling eliminates seats. A candidate dies. A scandal breaks. The Milligan removal erased an Alabama seat. The Massie culling changed faction size mid-cycle. Zomentum itself is vulnerable to shock — a single catastrophic event can collapse momentum that took years to build.",
    psyche:{ angry:0, guided:0, zomentum:0, DS:0, D:0, RP:0, R:0 },
    pov:[
      { label:"Forecasting humility", author:"A statistician", text:"The shock floor is where all models fail. We build beautiful trees with branches and deltas and psyche grids, and then a judge removes a seat or a candidate dies or a war starts and none of it matters." },
      { label:"Signal in the shock", author:"A political analyst", text:"Shocks aren't random. Their pattern tells you something about the structure underneath — who has power to make shocks happen and in which direction." },
      { label:"The uncontrollable variable", author:"A {DS} organizer", text:"We trust organizing. We trust the ground game because the ground game survives the shock. The model doesn't." },
    ],
    dispatch:"'Anything can happen' is not a hedge here; it is the most accurate single statement about the cycle. The shock floor is always live.",
  },
];

// ─── HEMICYCLE SVG ────────────────────────────────────────────────────────────
function Hemicycle({ id, counts, majority }) {
  const total = 435;
  const rows = 12;
  const cx = 150, cy = 150;
  const rI = 42, rO = 140;
  const rad = [];
  for (let i = 0; i < rows; i++) rad.push(rI + (rO - rI) * i / (rows - 1));
  const rs = rad.reduce((a, b) => a + b, 0);
  let spr = rad.map(r => Math.max(3, Math.round(total * r / rs)));
  let d = total - spr.reduce((a, b) => a + b, 0), k = rows - 1;
  while (d !== 0) { spr[k] += Math.sign(d); d -= Math.sign(d); k = (k - 1 + rows) % rows; }
  const o = [];
  const p = (n, col) => { for (let j = 0; j < n; j++) o.push(col); };
  p(counts.ds, "#0a2f7a"); p(counts.d, "#3b6dd6"); p(counts.r, "#e0454b"); p(counts.rp, "#9c1c20");
  while (o.length < total) o.push("#ddd");
  o.length = total;
  const sl = [];
  for (let row = 0; row < rows; row++) {
    const n = spr[row];
    for (let s = 0; s < n; s++) {
      const t = n === 1 ? 0.5 : s / (n - 1);
      sl.push({ a: Math.PI * (1 - t), r: rad[row] });
    }
  }
  sl.sort((x, y) => y.a - x.a);
  let h = '';
  for (let i = 0; i < sl.length; i++) {
    const s = sl[i];
    const x = cx + s.r * Math.cos(s.a);
    const y = cy - s.r * Math.sin(s.a);
    h += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.9" fill="${o[i]||'#ddd'}" stroke="rgba(0,0,0,.15)" stroke-width="0.6"/>`;
  }
  const majorityPercent = (majority / total) * Math.PI;
  const mx = cx + rO * Math.cos(Math.PI - majorityPercent);
  const my = cy - rO * Math.sin(Math.PI - majorityPercent);
  h += `<line x1="${cx}" y1="${cy}" x2="${mx.toFixed(1)}" y2="${my.toFixed(1)}" stroke="#888" stroke-width="2" stroke-dasharray="3,3" opacity="0.6"/>`;
  h += `<text x="${(mx + 4).toFixed(1)}" y="${my.toFixed(1)}" font-size="10" fill="#888" font-weight="bold">${majority}</text>`;
  return <svg id={id} width="300" height="162" viewBox="0 0 300 162" dangerouslySetInnerHTML={{ __html: h }} />;
}

// ─── DELTA PHYSICS ENGINE ─────────────────────────────────────────────────────
// Scale: -20 to +20. Three modes: STACKING, COMPOUNDING, FRICTION.
//
// EVERY NUMBER BELOW IS A JUDGMENT CALL, NOT A MEASUREMENT.
// This block exists so tuning happens here, in one place, instead of hunting
// through the file. Edit these in VSC; nothing else in the engine needs to change.
const PHYSICS = {
  POS_MAX: 20,                 // window scale runs -POS_MAX to +POS_MAX

  PSYCHE_CLAMP: 3,             // angryMag/guidedMag never exceed ±this
  STACKING_THRESHOLD: 0.2,     // below this on both axes = no momentum, linear add

  // RAMP_FLOOR — the knob for "we aren't there yet."
  // psyche magnitude is divided by max(resolvedNodes.length, RAMP_FLOOR).
  // At RAMP_FLOOR=1 (the old default), a SINGLE resolved node can already divide
  // by 1 and hit the ±3 clamp instantly — max compounding on the very first
  // data point. That's what produced the +14/20 jump off Colorado alone and
  // read as overstated. Raising RAMP_FLOOR forces early resolutions to earn
  // their momentum gradually as more nodes confirm, instead of front-loading
  // the whole cycle's belief into node #1. Set to 4 here (roughly: don't trust
  // full compounding until close to the β-threshold of 3 nodes). Raise for a
  // slower-building window, lower to go back toward the old spikier behavior.
  RAMP_FLOOR: 4,

  ACCEL_RATE: 1.6,             // velocity multiplier when angry+guided align and are both strong
  DECAY_RATE: 0.4,             // velocity multiplier when angry+guided oppose
  BOTH_STRONG_THRESHOLD: 0.8,  // magnitude each axis must clear to count as "strong"
  REVERSAL_FRICTION: 0.6,      // extra dampening when a delta pushes against current velocity

  WEIGHT_BASE: 0.5,            // earlier-resolved nodes get less psyche weight...
  WEIGHT_SPAN: 0.5,            // ...later-resolved nodes get up to WEIGHT_BASE + WEIGHT_SPAN
};
const POS_MAX = PHYSICS.POS_MAX; // kept as a bare const — used all over the render layer below

function applyDelta(delta, angry, guided, velocity) {
  const angryDir = Math.sign(angry);
  const guidedDir = Math.sign(guided);
  let multiplier;
  if (Math.abs(angry) < PHYSICS.STACKING_THRESHOLD && Math.abs(guided) < PHYSICS.STACKING_THRESHOLD) {
    multiplier = 1.0; // STACKING
  } else if (angryDir === guidedDir && Math.abs(angry) > PHYSICS.STACKING_THRESHOLD && Math.abs(guided) > PHYSICS.STACKING_THRESHOLD) {
    multiplier = 1 + (Math.abs(angry) + Math.abs(guided)) / 2; // COMPOUNDING
  } else {
    multiplier = Math.max(0.1, 1 - (Math.abs(angry - guided) / 2)); // FRICTION
  }
  if (Math.sign(delta) !== Math.sign(velocity) && velocity !== 0) multiplier *= PHYSICS.REVERSAL_FRICTION;
  return delta * multiplier;
}

function computeState(nodes) {
  let position = 0;
  const resolvedNodes = nodes.filter(n => n.resolved && n.branch);
  const psyche = { angry:0, guided:0, zomentum:0, DS:0, D:0, RP:0, R:0 };
  resolvedNodes.forEach((n, i) => {
    const branch = n.branches[n.branch];
    if (!branch?.psyche) return;
    const weight = PHYSICS.WEIGHT_BASE + (PHYSICS.WEIGHT_SPAN * (i + 1) / resolvedNodes.length);
    Object.keys(branch.psyche).forEach(k => {
      psyche[k] = (psyche[k] || 0) + branch.psyche[k] * weight;
    });
  });
  const scale = Math.max(resolvedNodes.length, PHYSICS.RAMP_FLOOR) || 1;
  const angryMag = Math.max(-PHYSICS.PSYCHE_CLAMP, Math.min(PHYSICS.PSYCHE_CLAMP, psyche.angry / scale * 2));
  const guidedMag = Math.max(-PHYSICS.PSYCHE_CLAMP, Math.min(PHYSICS.PSYCHE_CLAMP, psyche.guided / scale * 2));
  const samedir = Math.sign(angryMag) === Math.sign(guidedMag);
  const bothStrong = Math.abs(angryMag) > PHYSICS.BOTH_STRONG_THRESHOLD && Math.abs(guidedMag) > PHYSICS.BOTH_STRONG_THRESHOLD;
  let velocity = (angryMag + guidedMag) / 2;
  if (samedir && bothStrong) velocity *= PHYSICS.ACCEL_RATE;
  else if (!samedir) velocity *= PHYSICS.DECAY_RATE;
  let vel = 0;
  resolvedNodes.forEach(n => {
    const branch = n.branches[n.branch];
    if (!branch) return;
    position += applyDelta(branch.positionDelta, angryMag, guidedMag, vel);
    vel = velocity;
  });
  return {
    position: Math.max(-POS_MAX, Math.min(POS_MAX, position)),
    velocity,
    psyche,
    resolvedCount: resolvedNodes.length,
  };
}

// ─── LIVE SCAN ────────────────────────────────────────────────────────────────
// HONEST NOTE (2026-07-01 grounding pass): this fetch has no API key and will
// hit CORS/auth failures from a browser context every time — it currently does
// nothing. Shipping it silently made the UI claim an automated monitoring layer
// that doesn't exist. Per α-phase policy, the human is the signal source; this
// function is left in as a stub for the real β-phase implementation, and the
// UI below now says so instead of implying it works.
async function searchNodeUpdate(node) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        model:"claude-sonnet-4-6", max_tokens:1000,
        tools:[{ type:"web_search_20250305", name:"web_search" }],
        system:`Political intelligence scanner for 2026 US elections model. Return ONLY JSON: { "resolved": boolean, "branch": string|null, "headline": string, "source": string, "confidence": "high"|"medium"|"low", "snippet": string }. Branch options: ${Object.keys(node.branches).join(", ")}. If not yet occurred, return resolved: false.`,
        messages:[{ role:"user", content:`Node: ${node.label}\nDate: ${node.date}\nSearch: ${node.searchTerms[0]}\nBranches: ${JSON.stringify(Object.fromEntries(Object.entries(node.branches).map(([k,v])=>[k,v.label])))}` }]
      })
    });
    const data = await response.json();
    const text = data.content?.filter(b=>b.type==="text").map(b=>b.text).join("");
    if (!text) return null;
    return JSON.parse(text.replace(/```json|```/g,"").trim());
  } catch(e) { return null; }
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const S = `
:root { --ds:#0a2f7a; --d:#3b6dd6; --r:#e0454b; --rp:#9c1c20; --line:#6b7280; --box:#1f2937; --link:#60a5fa; --bg:#0f1720; --surface:#111827; --text:#e2e8f0; }
* { box-sizing:border-box; margin:0; padding:0; }
body { font-family:"Linux Libertine","Georgia",serif; font-size:15px; line-height:1.6; color:var(--text); background:var(--bg); }
.wrap { max-width:980px; margin:0 auto; padding:16px 20px 80px; background:var(--surface); border:1px solid rgba(255,255,255,.08); border-radius:18px; box-shadow:0 24px 80px rgba(0,0,0,.35); }
h1 { font-weight:normal; font-size:1.9em; border-bottom:3px solid #475569; padding-bottom:4px; margin:.2em 0 .4em; }
h2 { font-weight:normal; font-size:1.4em; border-bottom:1px solid var(--line); padding-bottom:3px; margin:1.5em 0 .5em; }
h3 { font-weight:normal; font-size:1.1em; margin:1em 0 .3em; }
p { margin:.5em 0; font-size:.95em; }
a { color:var(--link); text-decoration:none; } a:hover { text-decoration:underline; }
.hatnote { font-style:italic; color:#cbd5e1; border-bottom:1px dotted rgba(148,163,184,.45); padding-bottom:8px; margin-bottom:12px; font-size:.91em; }
.infobox { float:right; clear:right; margin:0 0 20px 28px; border:1px solid var(--line); background:var(--box); font-size:12px; width:280px; border-collapse:collapse; }
.infobox caption { background:rgba(255,255,255,.06); font-weight:bold; padding:7px; text-align:center; border-bottom:1px solid var(--line); }
.infobox th { padding:4px 8px; text-align:left; font-weight:normal; color:#cbd5e1; border-top:1px solid var(--line); width:45%; }
.infobox td { padding:4px 8px; border-top:1px solid var(--line); }
.chip { display:inline-block; font-family:"Courier New",monospace; font-weight:bold; padding:1px 6px; border-radius:2px; color:#fff; font-size:.85em; }
.c-ds{background:var(--ds)}.c-d{background:var(--d)}.c-r{background:var(--r)}.c-rp{background:var(--rp)}
.node { border:1px solid var(--line); border-left:4px solid #c0a000; margin:10px 0; }
.node-h { padding:10px 14px; cursor:pointer; display:flex; justify-content:space-between; background:var(--box); }
.node-b { padding:14px; border-top:1px solid var(--line); }
.branch-pill { display:inline-block; padding:3px 10px; border:1px solid var(--line); border-radius:2px; font-size:11px; margin:3px 3px 3px 0; font-family:sans-serif; background:var(--box); }
.scn { border:1px solid var(--line); margin:16px 0; background:var(--surface); }
.scn .hd { padding:10px 14px; color:#fff; font-weight:bold; font-size:1.05em; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; }
.scn.urgent-realignment .hd{background:#06204f}.scn.urgent-acceleration .hd{background:#123e8c}
.scn.urgent-stabilization .hd{background:#5a5f66}.scn.urgent-retrenchment .hd{background:#7a2a2a}
.scn.urgent-critical .hd{background:#8b0000}.scn.urgent-unmodellable .hd{background:#6b4e16}
.scn .bd { padding:12px 14px; }
.tag { font-size:.7em; background:rgba(255,255,255,.22); padding:2px 7px; border-radius:10px; font-weight:normal; }
.hemi { display:flex; flex-wrap:wrap; gap:18px; align-items:center; justify-content:center; margin:10px 0; }
.hemi figure { margin:0; text-align:center; }
.hemi figcaption { font-size:.8em; color:#54595d; margin-top:3px; }
.bar-seats { display:flex; height:24px; width:100%; border:1px solid #888; overflow:hidden; font-size:.7em; margin:6px 0; }
.bar-seats span { display:flex; align-items:center; justify-content:center; color:#fff; white-space:nowrap; overflow:hidden; font-weight:bold; }
.block { border-left:5px solid #4b5563; padding:7px 12px; margin:8px 0; font-size:.9em; background:rgba(229,231,235,0.08); }
.block.dispatch { border-color:#475569; background:rgba(148,163,184,0.08); font-style:italic; }
.block.pov { border-color:#7a5cb0; background:rgba(167,139,250,0.08); }
.block.think { border-color:#7a5cb0; background:rgba(167,139,250,0.06); font-size:.88em; }
.block.warn { border-color:#e0454b; background:rgba(224,69,75,0.08); font-size:.88em; }
.block .lab { font-size:.68em; font-weight:bold; letter-spacing:.05em; text-transform:uppercase; display:block; margin-bottom:4px; font-style:normal; font-family:sans-serif; }
.block.dispatch .lab{color:#333}.block.pov .lab{color:#7a5cb0}.block.think .lab{color:#7a5cb0}.block.warn .lab{color:#e0454b}
.lab { font-size:.68em; font-weight:bold; letter-spacing:.05em; text-transform:uppercase; display:block; margin-bottom:4px; font-family:sans-serif; }
.psyche-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:6px; margin:8px 0; font-size:.82em; }
.psyche-item { display:flex; align-items:center; gap:6px; }
.psyche-bar { flex:1; height:6px; background:rgba(255,255,255,.06); border-radius:2px; overflow:hidden; position:relative; }
.psyche-fill { height:100%; position:absolute; }
.btns { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:16px; }
.btn { padding:4px 14px; font-size:12px; background:var(--box); border:1px solid var(--line); cursor:pointer; font-family:inherit; }
.btn.active { background:rgba(255,255,255,.08); }
.clear::after { content:""; display:table; clear:both; }
.ft { border-top:1px solid var(--line); margin-top:24px; padding-top:12px; font-size:13px; color:#54595d; font-family:sans-serif; text-align:center; }
.ft a { display:block; margin:10px auto 0; padding:10px 14px; border:1px solid var(--line); border-radius:999px; background:rgba(96,165,250,0.12); color:var(--link); font-weight:600; min-height:40px; line-height:1.2; text-decoration:none; width:max-content; }
.ft a:hover { background:rgba(96,165,250,0.18); }
.beta-badge { display:inline-block; background:#c8a84b; color:#000; font-size:10px; font-weight:bold; padding:1px 6px; border-radius:2px; font-family:sans-serif; margin-left:6px; }
.live-scan { background:rgba(96,165,250,.08); border:1px solid rgba(96,165,250,.25); border-radius:3px; padding:8px 12px; margin:8px 0; font-size:.85em; font-family:sans-serif; color:var(--text); }
.ticker { background:#0d0d0f; border:1px solid #22222e; padding:8px 12px; margin:10px 0; font-family:monospace; font-size:11px; color:#c8deca; max-height:72px; overflow-y:auto; }
svg { max-width:100%; height:auto; }

@media (max-width: 768px) {
  body { font-size:14px; }
  .wrap { padding:12px 12px 60px; }
  .infobox { float:none; width:100%; margin:0 0 14px; }
  h1 { font-size:1.45em; }
  h2 { font-size:1.2em; }
  .toolbar { flex-direction:column; align-items:flex-start; gap:8px; }
  .toolbar .meta { margin-left:0 !important; }
  .btns { gap:8px; }
  .btn { flex:1 1 calc(50% - 8px); min-height:42px; }
  .psyche-grid { grid-template-columns:1fr; }
  .hemi { flex-direction:column; align-items:stretch; }
  .hemi figure { width:100%; }
  .hemi > div { min-width:0; width:100%; }
  .node-h { flex-direction:column; align-items:flex-start; gap:6px; }
  .scn .hd { align-items:flex-start; }
  .ticker { font-size:10px; }
}

@media (max-width: 480px) {
  .btn { flex-basis:100%; }
  .psyche-item { flex-wrap:wrap; }
  .branch-pill { display:block; width:100%; }
  .branch-pill button { margin-left:0; margin-top:6px; display:block; }
  .bar-seats { height:20px; font-size:0.65em; }
  .infobox th, .infobox td { padding:4px 6px; }
}
`;

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function PsycheGrid({ psyche }) {
  const items = [
    { k:"angry",    label:"ANGRY",    color:"#c0392b" },
    { k:"guided",   label:"GUIDED",   color:"#8e44ad" },
    { k:"zomentum", label:"ZOMENTUM", color:"#c8a84b" },
    { k:"DS",  label:"{DS}", color:C.ds },
    { k:"D",   label:"{D}",  color:C.d  },
    { k:"RP",  label:"{RP}", color:C.rp },
    { k:"R",   label:"{R}",  color:C.r  },
  ];
  return (
    <div className="psyche-grid">
      {items.map(item => {
        const val = psyche[item.k] || 0;
        const pct = Math.max(0, Math.min(100, ((val + 3) / 6) * 100));
        return (
          <div key={item.k} className="psyche-item">
            <span style={{fontSize:11, fontWeight:"bold", minWidth:68, color:item.color, fontFamily:"monospace"}}>{item.label}</span>
            <div className="psyche-bar">
              <div className="psyche-fill" style={{
                background: item.color,
                width: pct + "%",
                opacity: Math.abs(val) < 0.1 ? 0.2 : 1,
              }}/>
            </div>
            <span style={{fontSize:10, color:val>0?"#2d7f2d":val<0?"#c0392b":"#aaa", minWidth:24, fontFamily:"monospace"}}>{val>0?"+":""}{typeof val==="number"?val.toFixed(1):val}</span>
          </div>
        );
      })}
    </div>
  );
}

function NodeCard({ node, onResolve, scanResult }) {
  const [open, setOpen] = useState(false);
  const urgencyColor = { imminent:"#c0a000", upcoming:C.d, future:"#a2a9b1" }[node.urgency] || "#a2a9b1";
  const resolvedBranch = node.resolved && node.branch ? node.branches[node.branch] : null;
  const borderColor = resolvedBranch
    ? (resolvedBranch.positionDelta > 0 ? C.ds : resolvedBranch.positionDelta < 0 ? C.rp : "#a2a9b1")
    : urgencyColor;

  return (
    <div className="node" style={{borderLeftColor:borderColor}}>
      <div className="node-h" onClick={()=>setOpen(o=>!o)}>
        <div>
          <span style={{fontFamily:"sans-serif", fontSize:11, color:borderColor, fontWeight:"bold", marginRight:8}}>
            {node.resolved ? "● RESOLVED" : node.urgency==="imminent" ? "⚡ IMMINENT" : "▸ PENDING"}
          </span>
          <strong>{node.date} — {node.label}</strong>
          {node.betaNode && <span className="beta-badge">β NODE</span>}
          {resolvedBranch && (
            <span style={{marginLeft:8, fontSize:11, fontFamily:"sans-serif", color:borderColor}}>
              → {resolvedBranch.label} (Δ{resolvedBranch.positionDelta>=0?"+":""}{resolvedBranch.positionDelta})
            </span>
          )}
        </div>
        <span style={{color:"#54595d"}}>{open?"▲":"▼"}</span>
      </div>
      {open && (
        <div className="node-b">
          <span className="lab" style={{color:"#2e6b3a"}}>FACT — sourced</span>
          <p style={{marginBottom:node.read?4:10}}>{node.detail}</p>
          {node.read && (
            <div className="block think" style={{marginBottom:10}}>
              <span className="lab">Harrow's read — interpretation, not fact</span>
              {node.read}
            </div>
          )}
          {scanResult && (
            <div className="live-scan">
              <strong>🔍 LIVE SCAN</strong> · {scanResult.source} · {scanResult.confidence} confidence<br/>
              {scanResult.headline}<br/>
              <span style={{color:"#54595d"}}>{scanResult.snippet}</span>
            </div>
          )}
          <div style={{fontSize:11, fontFamily:"sans-serif", color:"#54595d", margin:"8px 0 4px"}}>BRANCH OUTCOMES</div>
          <div style={{display:"flex", flexWrap:"wrap", gap:4}}>
            {Object.entries(node.branches).map(([key, b]) => (
              <div key={key} className="branch-pill">
                {b.label} — Δ{b.positionDelta>=0?"+":""}{b.positionDelta}
                {!node.resolved && (
                  <button onClick={e=>{e.stopPropagation();onResolve(node.id,key);}} style={{
                    marginLeft:8, padding:"1px 6px", fontSize:10, cursor:"pointer",
                    background:b.positionDelta>0?"#e8f5e9":b.positionDelta<0?"#fdecea":"#f0f0f0",
                    border:`1px solid ${b.positionDelta>0?C.ds:b.positionDelta<0?C.rp:"#ccc"}`,
                    borderRadius:2, fontFamily:"sans-serif",
                  }}>Confirm</button>
                )}
              </div>
            ))}
          </div>
          {resolvedBranch?.psyche && (
            <>
              <div style={{fontSize:11, fontFamily:"sans-serif", color:"#54595d", margin:"10px 0 4px"}}>PSYCHE EFFECTS</div>
              <PsycheGrid psyche={resolvedBranch.psyche} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ScenarioCard({ scenario }) {
  const [open, setOpen] = useState(false);
  const urgencyColors = {
    realignment:"#06204f", acceleration:"#123e8c", stabilization:"#5a5f66",
    retrenchment:"#7a2a2a", critical:"#8b0000", unmodellable:"#6b4e16"
  };
  const bg = urgencyColors[scenario.urgency] || "#333";
  return (
    <div className={`scn urgent-${scenario.urgency}`}>
      <div className="hd" style={{background:bg}}>
        <div>
          <span style={{fontFamily:"monospace", fontSize:".85em", opacity:0.7}}>Scenario {scenario.id}</span>
          {" "}
          <strong style={{fontSize:"1.1em"}}>"{scenario.name}"</strong>
          <span className="tag">{scenario.urgency}</span>
        </div>
        <button onClick={()=>setOpen(o=>!o)} style={{background:"none", border:"none", cursor:"pointer", color:"#fff", fontSize:".75em"}}>
          {open?"▲ less":"▼ more"}
        </button>
      </div>
      {open && (
        <div className="bd">
          <p style={{marginBottom:8, fontSize:".92em"}}><strong>Trigger path:</strong> {scenario.triggerPath}</p>
          <p style={{marginBottom:10, fontSize:".92em"}}>{scenario.desc}</p>

          {/* HEMICYCLE + SEATS BAR */}
          <div className="hemi">
            <figure>
              <Hemicycle id={"hem-"+scenario.id} counts={scenario.seats} majority={scenario.majorityNeeded} />
              <figcaption>435 seats · majority {scenario.majorityNeeded}</figcaption>
            </figure>
            <div style={{minWidth:180}}>
              <div className="bar-seats">
                {scenario.seats.ds>0 && <span style={{background:"var(--ds)", width:(scenario.seats.ds/435*100)+"%"}}>{scenario.seats.ds}</span>}
                {scenario.seats.d>0  && <span style={{background:"var(--d)",  width:(scenario.seats.d/435*100)+"%"}}>{scenario.seats.d}</span>}
                {scenario.seats.r>0  && <span style={{background:"var(--r)",  width:(scenario.seats.r/435*100)+"%"}}>{scenario.seats.r}</span>}
                {scenario.seats.rp>0 && <span style={{background:"var(--rp)", width:(scenario.seats.rp/435*100)+"%"}}>{scenario.seats.rp}</span>}
              </div>
              <div style={{fontSize:".75em", color:"#54595d", marginTop:4, display:"flex", justifyContent:"space-between"}}>
                <span><span className="chip c-ds">{"{DS}"}</span> {scenario.seats.ds}</span>
                <span><span className="chip c-d">{"{D}"}</span> {scenario.seats.d}</span>
                <span><span className="chip c-r">{"{R}"}</span> {scenario.seats.r}</span>
                <span><span className="chip c-rp">{"{RP}"}</span> {scenario.seats.rp}</span>
              </div>
              <div style={{fontSize:".7em", color:"#2e6b3a", fontWeight:"bold", marginTop:6}}>
                Overton: Δpos {scenario.positionDelta>=0?"+":""}{scenario.positionDelta} · Δvel {scenario.velocityDelta>=0?"+":""}{scenario.velocityDelta.toFixed(1)}
              </div>
            </div>
          </div>

          {/* PSYCHE GRID */}
          <div style={{marginTop:12, marginBottom:8}}>
            <div style={{fontSize:".68em", fontWeight:"bold", color:"#54595d", textTransform:"uppercase", letterSpacing:".05em", marginBottom:6}}>Psyche state in this scenario</div>
            <PsycheGrid psyche={scenario.psyche} />
          </div>

          {/* INVENTED VOICES — not sourced quotes, never presented as such */}
          <div style={{marginTop:12}}>
            <div style={{fontSize:".68em", fontWeight:"bold", color:"#54595d", textTransform:"uppercase", letterSpacing:".05em", marginBottom:4}}>Invented voices — a thinking exercise, not sourced commentary</div>
            <div style={{fontSize:".78em", color:"#e0454b", marginBottom:8, fontStyle:"italic"}}>
              Nobody named "{"{D}"} strategist" or "realignment historian" said these things. This is Harrow writing out how different stances would react if Scenario {scenario.id} happened, to pressure-test the scenario from more than one angle — not a report of real reactions. Treat as CONSTRUCT, not FACT.
            </div>
            {scenario.pov.map((p,i)=>(
              <div key={i} className="block pov">
                <span className="lab">Invented — {p.label}</span>
                <div style={{fontSize:".82em", color:"var(--text)", marginBottom:3}}>{p.text}</div>
                <div style={{fontSize:".7em", color:"#7a5cb0", fontStyle:"italic"}}>— imagined stance: {p.author} (not a real person or quote)</div>
              </div>
            ))}
          </div>

          {/* DISPATCH */}
          <div className="block dispatch">
            <span className="lab">Dispatch — invented newspaper voice, scenario-conditional, not a real headline</span>
            "{scenario.dispatch}"
          </div>
        </div>
      )}
    </div>
  );
}

function KingsSection() {
  const fateColors = { binary:C.rp, soft:C.d, option:"#c8a84b" };
  return (
    <div>
      {KINGS.map(k=>(
        <div key={k.faction} style={{border:`1px solid ${FACTIONS[k.faction].color}44`, borderTop:`3px solid ${FACTIONS[k.faction].color}`, margin:"10px 0", padding:"12px 14px", background:"rgba(255,255,255,0.04)"}}>
          <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:8}}>
            <span className={`chip c-${k.faction.toLowerCase()}`}>{FACTIONS[k.faction].label}</span>
            <strong>{k.king}</strong>
            <span style={{marginLeft:"auto", fontSize:10, padding:"1px 6px", borderRadius:10, background:fateColors[k.fateType]+"22", color:fateColors[k.fateType], fontFamily:"sans-serif", fontWeight:"bold"}}>{k.fateType}</span>
          </div>
          <p style={{fontSize:13, color:"#9fd2a2", marginBottom:4}}>↑ {k.win}</p>
          <p style={{fontSize:13, color:C.rp, marginBottom:4}}>↓ {k.lose}</p>
          <p style={{fontSize:12, color:"#cbd5e1", fontStyle:"italic", borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:6, marginTop:6}}>{k.note}</p>
        </div>
      ))}
    </div>
  );
}

function OvWindow({ position, velocity }) {
  const posPercent = ((position + POS_MAX) / (POS_MAX * 2)) * 100;
  const velAbs = Math.abs(velocity);
  const velDir = velocity >= 0 ? "left" : "right";
  const velLabel = velAbs < 0.3 ? "static" : velAbs < 0.8 ? "drift" : velAbs < 1.5 ? "moving" : "accelerating";
  const windowWidth = 14 + velAbs * 3;
  const windowLeft = Math.max(2, Math.min(posPercent - windowWidth/2, 98 - windowWidth));
  return (
    <div style={{border:"1px solid rgba(255,255,255,0.12)", padding:"12px 14px", margin:"10px 0", background:"rgba(255,255,255,0.04)", fontFamily:"sans-serif", fontSize:12}}>
      <div style={{display:"flex", justifyContent:"space-between", marginBottom:6, color:"#9ca3af", fontSize:11}}>
        <span>← rightward</span>
        <strong style={{color:"#202122"}}>
          POSITION: {position>=0?"+":""}{position.toFixed(2)} · VELOCITY: {velocity>=0?"+":""}{velocity.toFixed(2)}/cycle · {velLabel} {velocity!==0?velDir:""}
        </strong>
        <span>leftward →</span>
      </div>
      <div style={{position:"relative", height:28, background:`linear-gradient(to right, ${C.rp}33, #4a4a5222, ${C.ds}33)`, border:"1px solid #a2a9b1", borderRadius:3, overflow:"hidden"}}>
        <div style={{position:"absolute", left:"50%", top:0, bottom:0, width:1, background:"rgba(148,163,184,0.55)"}}/>
        <div style={{
          position:"absolute", left:`${windowLeft}%`, width:`${windowWidth}%`,
          top:2, bottom:2, border:`2px solid #c8a84b`, borderRadius:2,
          background:"rgba(200,168,75,0.12)", boxShadow:"0 0 8px rgba(200,168,75,0.27)",
          transition:"left 1.2s ease, width 0.8s ease",
        }}/>
        <div style={{
          position:"absolute", left:`${posPercent}%`, top:"50%",
          transform:"translate(-50%,-50%)",
          width:10, height:10, background:"#c8a84b", borderRadius:"50%",
          boxShadow:"0 0 6px rgba(200,168,75,0.7)", transition:"left 1s ease",
        }}/>
      </div>
      <div style={{marginTop:4, fontSize:11, color:"var(--text)", textAlign:"right", fontFamily:"monospace"}}>
        {velAbs>1.4?"⚡ ACCELERATING":velAbs>0.8?"→ MOVING":velAbs>0.3?"~ DRIFT":"◆ STATIC"} {velocity!==0?velDir.toUpperCase():""}
        <span style={{marginLeft:12, color:"#9ca3af"}}>scale −{POS_MAX} to +{POS_MAX}</span>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Overton() {
  const [nodes, setNodes] = useState(NODES);
  const [scanResults, setScanResults] = useState({});
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState(null);
  const [tab, setTab] = useState("overview");
  const [frameData, setFrameData] = useState(DEFAULT_FRAME);
  const [ticker, setTicker] = useState([`Model loaded — ${DEFAULT_FRAME.updated}. ${DEFAULT_FRAME.note} Scale: −20 to +20.`]);

  useEffect(() => {
    let active = true;
    fetch("./overton_frame.json", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error("Could not load overton_frame.json");
        return r.json();
      })
      .then((data) => {
        if (!active) return;
        const merged = { ...DEFAULT_FRAME, ...data };
        setFrameData(merged);
        setTicker((prev) => {
          const base = `Model loaded — ${merged.updated || DEFAULT_FRAME.updated}. ${merged.note || DEFAULT_FRAME.note} Scale: −20 to +20.`;
          return prev[0]?.includes("Model loaded —") ? [base, ...prev.slice(1)] : [base, ...prev];
        });
      })
      .catch((err) => {
        console.warn("Using fallback frame values:", err);
      });
    return () => { active = false; };
  }, []);

  const { position, velocity, psyche, resolvedCount } = computeState(nodes);
  const displayPosition = Number.isFinite(frameData.position) ? frameData.position : position;
  const displayVelocity = Number.isFinite(frameData.velocity) ? frameData.velocity : velocity;

  const resolveNode = useCallback((id, branch) => {
    setNodes(prev => prev.map(n => n.id===id ? {...n, resolved:true, branch} : n));
    const node = nodes.find(n => n.id===id);
    if (node) {
      const b = node.branches[branch];
      setTicker(t => [...t, `✓ ${node.label} → ${b.label} (Δ${b.positionDelta>=0?"+":""}${b.positionDelta})`]);
    }
  }, [nodes]);

  const runScan = useCallback(async () => {
    if (scanning) return;
    setScanning(true);
    setTicker(t => [...t, "⟳ Scan initiated…"]);
    const pending = nodes.filter(n => !n.resolved && n.urgency !== "future");
    for (const node of pending.slice(0,3)) {
      const result = await searchNodeUpdate(node);
      if (result) {
        setScanResults(prev => ({...prev, [node.id]:result}));
        // INTEGRITY RULE: scans surface candidate matches only. They never call
        // resolveNode(). "Human-verified resolutions only" (see infobox / methodology
        // tab) is a claim this code must actually satisfy, not just state. A prior
        // build auto-resolved nodes on "high confidence" scans, which contradicted
        // that claim outright — flagged in the 2026-07-01 grounding pass and removed.
        if (result.resolved) {
          setTicker(t => [...t, `⚡ FLAG (needs human confirm): ${node.label} may have resolved → ${result.branch} (${result.confidence} confidence, unverified)`]);
        }
      }
    }
    setLastScan(new Date());
    setScanning(false);
    setTicker(t => [...t, "○ Scan complete."]);
  }, [nodes, scanning, resolveNode]);

  useEffect(() => {
    const interval = setInterval(runScan, 20*60*1000);
    return () => clearInterval(interval);
  }, [runScan]);

  const resolvedNodes = nodes.filter(n => n.resolved);
  const pendingNodes = nodes.filter(n => !n.resolved);
  const betaNodes = ["colorado","wisconsin","august_congress"];
  const betaResolved = nodes.filter(n => betaNodes.includes(n.id) && n.resolved).length;
  const tabs = ["overview","nodes","scenarios","kings","methodology","betting"];

  return (
    <div><style>{S}</style>
    <div className="wrap clear">

      <div style={{border:"2px solid #e0454b", background:"rgba(224,69,75,0.08)", borderRadius:6, padding:"10px 14px", margin:"0 0 14px", fontFamily:"sans-serif"}}>
        <div style={{fontSize:13, fontWeight:"bold", color:"#e0454b", letterSpacing:".03em", marginBottom:4}}>
          ⚠ PROOF OF CONCEPT — WORK IN PROGRESS, NOT A FINISHED ANALYTICAL PRODUCT
        </div>
        <div style={{fontSize:12.5, color:"var(--text)", lineHeight:1.5}}>
          This is one person plus Harrow building a decision-tree instrument in public, one election at a time. It is not a forecast, not a probability model, and not a finished argument — it's a structure being tested and corrected as it goes, including in public after criticism (see Methodology → Bias Audit for the full accounting of what's been wrong and fixed so far). The "physics" coefficients are invented and adjustable, not measured. "Zomentum" is a named narrative pattern, not a proven mechanism — its own falsifiability problem is flagged, not solved, in Methodology. Treat every number on this page as provisional until you've read how it was built. [Test update: live edit confirmed.]
        </div>
      </div>

      <div style={{borderBottom:"1px solid #a2a9b1", paddingBottom:8, marginBottom:10}}>
        <div style={{fontSize:11, color:"#54595d", fontFamily:"sans-serif", letterSpacing:"1px", textTransform:"uppercase", marginBottom:3}}>
          {frameData.headline} · Alpha · WIP · β threshold: {betaResolved}/3 · Next: {frameData.next}
        </div>
        <h1>Overton window — 2026 United States election tracker</h1>
        <div style={{fontSize:13, color:"#54595d", fontStyle:"italic"}}>
          A diagnostic tool measuring shifts in the boundary of politically sayable ideas. The 2026 election cycle is the instrument, not the subject.
        </div>
      </div>

      <table className="infobox">
        <caption>Overton Project</caption>
        <tbody>
          <tr><th>Status</th><td style={{color:"#e0454b", fontWeight:600}}>{frameData.status}</td></tr>
          <tr><th>Subject</th><td>Boundary of politically sayable ideas, United States</td></tr>
          <tr><th>Measurement</th><td>Position (−20 to +20) + velocity + Zomentum</td></tr>
          <tr><th>Baseline</th><td>January 2026</td></tr>
          <tr><th>Current position</th><td>{displayPosition>=0?"+":""}{displayPosition.toFixed(2)} / {POS_MAX}</td></tr>
          <tr><th>Last updated</th><td>{frameData.updated}</td></tr>
          <tr><th>Next node</th><td style={{color:"#c0a000", fontWeight:600}}>⚡ {frameData.next}</td></tr>
          <tr><th>β threshold</th><td>NODE_003 (August congressional)</td></tr>
          <tr><th>β node</th><td>Michigan Senate (Abdul/Bowman)</td></tr>
          <tr><th>Methodology</th><td>Human-verified resolutions only</td></tr>
          <tr><th>Betting markets</th><td style={{color:C.rp, fontWeight:600}}>Excluded</td></tr>
          <tr><th>Version</th><td>α0.7.0</td></tr>
        </tbody>
      </table>

      <OvWindow position={displayPosition} velocity={displayVelocity} />
      <div className="ticker">{ticker.map((t,i)=><div key={i}>{t}</div>)}</div>

      <div className="toolbar" style={{display:"flex", gap:10, alignItems:"center", margin:"8px 0 14px", fontFamily:"sans-serif", fontSize:12}}>
        <button onClick={runScan} disabled={scanning} style={{padding:"4px 14px", cursor:scanning?"not-allowed":"pointer", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.14)", color:"var(--text)"}}>
          {scanning?"⟳ Scanning…":"⟳ Scan now"}
        </button>
        {lastScan && <span style={{color:"#54595d"}}>Last: {lastScan.toLocaleTimeString()}</span>}
        <span className="meta" style={{marginLeft:"auto", color:"#54595d"}}>α-phase: scan is unwired (no live key) · every branch requires a human click on "Confirm" · no exceptions</span>
      </div>

      <div className="btns">
        {tabs.map(t=><button key={t} className={`btn${tab===t?" active":""}`} onClick={()=>setTab(t)}>{t}</button>)}
      </div>

      {tab==="overview" && (
        <div>
          <div className="hatnote">
            Alpha phase · {resolvedCount} nodes resolved of {nodes.length} · β unlocks when Colorado + Wisconsin + August congressional all resolve · Michigan Senate is the first β-phase node · All resolutions by human confirmation only · Betting markets excluded
          </div>
          <div style={{display:"flex", flexWrap:"wrap", gap:8, margin:"8px 0 14px", fontFamily:"sans-serif", fontSize:11}}>
            <span style={{background:"#2e6b3a", color:"#fff", padding:"2px 8px", borderRadius:3, fontWeight:"bold"}}>FACT</span><span style={{color:"#9ca3af", marginRight:8}}>sourced &amp; verified — see Sources under Methodology</span>
            <span style={{background:"#7a5cb0", color:"#fff", padding:"2px 8px", borderRadius:3, fontWeight:"bold"}}>HARROW'S READ</span><span style={{color:"#9ca3af", marginRight:8}}>interpretation, not fact</span>
            <span style={{background:"#e0454b", color:"#fff", padding:"2px 8px", borderRadius:3, fontWeight:"bold"}}>FLAGGED</span><span style={{color:"#9ca3af"}}>a known weak point, not resolved yet</span>
          </div>
          <h2>Background</h2>
          <p>The Overton window describes the range of ideas political actors can advocate without losing viability. The project measures where that boundary sits, how fast it is moving, and what events move it. Position and velocity update only on human-confirmed node resolutions. Scale runs from −20 (hard right consolidation) to +20 (full socialist realignment).</p>
          <h2>The four factions</h2>
          <p><strong>DS — Democratic Socialists.</strong> Redistribution as mainstream policy. Testing whether the model that won New York City in 2025 can travel to congressional seats (CO-01, June 30), swing-state governorships (Wisconsin, August 11), congressional rematches (August), and a Senate primary in a swing state (Michigan, β-phase).</p>
          <p><strong>D — Establishment Democrats.</strong> Defending incumbents through PAC spending and ballot-access litigation. Sara Rodriguez in Wisconsin and Diana DeGette in Colorado represent the establishment defense against DS insurgency in the same cycle.</p>
          <p><strong>R — Anti-Trump Republicans.</strong> Shrinking lane. Four House Republicans crossed on Iran war powers in June 2026. Massie culled in May. Leverage is procedural.</p>
          <p><strong>RP — Trump Loyalists.</strong> Testing executive power ceiling at −25% approval. Iran war is the first major window-narrowing event for this faction.</p>
          <h2>Zomentum</h2>
          <p>Zomentum is the gravitational pull of Zohran Mamdani's 2025 NYC mayoral victory on every subsequent {"{DS}"} candidate. Mamdani's unmet promises (free buses) are read here as narrative proof the system is rigged — not proof of failure. His delivered wins (rent freeze, housing plan) are read as a credibility floor. Each {"{DS}"} candidate running after him is read as borrowing his legitimacy and extending it to a new tier: Kiros (House), Hong (Governor), August slate (congressional repeatability), Abdul/Bowman (Senate structural power). In the physics model, Zomentum is the coupling variable that determines whether ANGRY and GUIDED amplify together (compounding acceleration) or dissipate (friction).</p>
          <div className="block warn">
            <span className="lab">Falsifiability risk — flagged, not resolved</span>
            As written, Zomentum can absorb any outcome: a win extends it, a loss ("free buses failed") gets read as proof the system is rigged rather than proof the theory is wrong. That's the exact shape of an unfalsifiable claim — the thing Harrow's own founding principle warns against ("if it can't be proven wrong, it's a hallucination"). Until Zomentum makes a prediction that a specific result would contradict — not just explain after the fact — treat it as a narrative construct, not a discovered mechanism. This is not fixed by better writing; it needs a pre-committed failure condition, which does not yet exist in this build.
          </div>
          <h2>The Wisconsin signal</h2>
          <p>Francesca Hong is the most significant new signal in the model since the NYC primary sweep of June 23, 2026. State assembly member, first Asian American Wisconsin legislator, Democratic Socialist, single mother, service worker running for governor. No corporate PAC money. Her campaign draws explicitly on the sewer socialist tradition — Milwaukee's near-fifty-year socialist municipal government that produced Social Security and unemployment insurance. She invokes Fighting Bob LaFollette. As of June 2026 she is polling at the top of a seven-person field. Attack vectors live: police abolition posts (not deleted), Capital One debt lawsuit ($30k, campaign says paid).</p>
          <h2>The Michigan Senate test</h2>
          <p>NBC News chief data analyst Steve Kornacki identified the Michigan Democratic Senate primary as the critical test of whether {"{DS}"}-style politics can scale beyond safe urban districts: "I think the test to me that's coming up this year is Michigan... If he is the nominee in Michigan in 2026 in a climate that I think nationally is pretty favorable to Democrats, how does he do? Is he able to win Michigan as a sort of Mondaire style candidate? If he's able to do that, I think that's a very significant moment." (Kornacki, You Decide with Errol Louis, June 25, 2026, [00:31:18].) Michigan is a genuine swing state — Trump won it in 2016 and 2024. The Senate seat carries structural leverage in a 50-50 chamber.</p>
          <div className="block think">
            <span className="lab">Harrow's read — interpretation, not fact</span>
            We're calling this the terminal Zomentum test — our claim, not Kornacki's, that this is where the construct either earns its keep or breaks.
          </div>

          <h2>How {"{DS}"} actually moves seats — ported from the 27 Jun model, §10</h2>
          <p>Mid-decade redistricting tilts toward {"{RP}"} before any vote: GOP map gains projected up to +14 (TX, FL, MO, NC, OH, TN); Democratic gains up to +6 (CA, UT). California's counter-map largely cancels Texas; Virginia's Democratic map was struck down. Democrats need their +3 House flip on a map already moved against them.</p>
          <table className="wt" style={{width:"100%", borderCollapse:"collapse", fontSize:".85em", margin:"10px 0"}}>
            <tbody>
              <tr style={{background:"rgba(255,255,255,.06)"}}><th style={{textAlign:"left", padding:"5px 7px", border:"1px solid var(--line)"}}>#</th><th style={{textAlign:"left", padding:"5px 7px", border:"1px solid var(--line)"}}>Mechanism</th><th style={{textAlign:"left", padding:"5px 7px", border:"1px solid var(--line)"}}>Net</th></tr>
              <tr><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>1</td><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>{"{DS}"} candidate wins (e.g. Kiros)</td><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>+1 {"{DS}"}, −1 {"{D}"} (intra-blue — no net seat change for Democrats)</td></tr>
              <tr><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>2</td><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>{"{DS}"} machine backs a non-{"{DS}"} winner (lends turnout/$)</td><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>can flip a seat {"{D}"} — reach exceeds roster</td></tr>
              <tr><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>3</td><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>turnout spillover into adjacent swing seat</td><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>marginal + for {"{D}"} control</td></tr>
              <tr><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>4</td><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>brand drag (lets {"{RP}"} nationalize "socialism")</td><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>marginal − for {"{D}"} control</td></tr>
            </tbody>
          </table>
          <div className="block warn">
            <span className="lab">Corrected</span>
            An earlier draft claimed "{"{DS}"} can't flip a chamber." Too strong. Mechanism 2 means the machine is a resource that can be lent — the wing can help flip a seat without putting a socialist in it. Correct claim: "{"{DS}"} can't flip a chamber by itself, with its own candidates." Every {"{DS}"} 2026 win named in this model is a seat already Democratic; none of the named candidates flip a Republican-held seat directly.
          </div>

          <h2>The median voter — ported from the 27 Jun model, §13</h2>
          <span className="lab" style={{color:"#2e6b3a"}}>FACT — sourced</span>
          <p>The political-science record supports a precise version of "radicalized but not guided." Rising "issue partisanship" is not higher ideological coherence — issue constraint has stayed "essentially stable, and low"; what looks like radicalization is mostly party sorting. Pew: majorities call both parties too extreme (GOP 61%, Dem 57%); frustration is bipartisan. Only 17% think Congress represents them; roughly six in ten have no confidence the system solves problems.</p>
          <div className="block think">
            <span className="lab">Harrow's read — interpretation, not fact</span>
            The median voter reads as radicalized in affect (anger, anti-establishment heat) but not in ideology (no coherent program). The anger is a container, not a direction. That's why the window is up for grabs: whoever fills the container first — {"{DS}"} from the left or {"{RP}"} from the right — wins it. Both are competing to be the vehicle for the same "make the pain stop" demand.
          </div>
          <div className="block warn">
            <span className="lab">Why this belongs here</span>
            This section is a check on the whole model, including Zomentum: if the anger is a container without a fixed direction, then a {"{DS}"} win doesn't prove the public turned left — it may just mean {"{DS}"} filled the container fastest in that race. Keep both readings live.
          </div>
        </div>
      )}

      {tab==="nodes" && (
        <div>
          <h2>Decision tree</h2>
          <p>A node is a dated political event with multiple possible resolutions specified in advance. Each resolution carries a position delta on the −20 to +20 scale and a psyche shift. Human resolvers confirm the branch. No AI-autonomous movement.</p>
          <div className="hatnote">β threshold: Colorado + Wisconsin + August congressional must all resolve before β0.1.0 unlocks. Michigan Senate is the first β-phase node — marked below.</div>
          <h3 style={{marginTop:16}}>Resolved ({resolvedNodes.length})</h3>
          {resolvedNodes.map(n=><NodeCard key={n.id} node={n} onResolve={resolveNode} scanResult={scanResults[n.id]}/>)}
          <h3 style={{marginTop:20}}>Pending ({pendingNodes.length})</h3>
          {pendingNodes.map(n=><NodeCard key={n.id} node={n} onResolve={resolveNode} scanResult={scanResults[n.id]}/>)}
        </div>
      )}

      {tab==="scenarios" && (
        <div>
          <h2>Six conditional scenarios</h2>
          <p>Each scenario maps a complete path from this moment through November 2026 and the January 2027 speaker vote. These are not predictions. They are structures specified in advance so that when reality produces an outcome, there is somewhere for it to land without retrofitting. Each scenario includes a hemicycle seat map, psyche state grid, multiple readings, and dispatch narration.</p>
          <div className="hatnote">The correct scenario is determined by events, not by the model. The model's job is to have specified these correctly in advance.</div>
          {SCENARIOS.map(s=><ScenarioCard key={s.id} scenario={s}/>)}
        </div>
      )}

      {tab==="kings" && (
        <div>
          <h2>Kings &amp; Kingmakers</h2>
          <p>Each faction's survival is fused to this election cycle. The following individuals hold or represent the central power question for their faction.</p>
          <div className="block think">
            <span className="lab">Harrow's read — the whole tab, not just this line</span>
            Every "win"/"lose" outcome below (e.g. "Undisputed national kingmaker," "Total consolidation") is Harrow's projection of what a fate would mean, not a sourced description of something that has happened or a probability estimate. Read this tab as scenario framing, same epistemic status as the Scenario cards.
          </div>
          <KingsSection/>
        </div>
      )}

      {tab==="methodology" && (
        <div>
          <h2>How the project works</h2>
          <p>A node is a dated, sourced event with multiple possible resolutions. Each resolution carries a position delta on the −20 to +20 scale and a psyche shift. When a node resolves, a human confirms the branch. The system calculates how that delta interacts with psyche momentum through three physics modes.</p>
          <h3>Delta physics modes</h3>
          <p><strong>STACKING</strong> — No psyche momentum (ANGRY and GUIDED both near zero). Delta adds linearly. Ideas sit without amplification.</p>
          <p><strong>COMPOUNDING</strong> — ANGRY and GUIDED both elevated and aligned. Delta amplifies by 1 + (|ANGRY| + |GUIDED|) / 2. Velocity accelerates by 1.6×. Rage and strategy together — the window accelerates.</p>
          <p><strong>FRICTION</strong> — ANGRY and GUIDED opposing. Delta dampens by 1 − |ANGRY − GUIDED| / 2. Velocity decays by 0.4×. The window wants to move but something resists.</p>
          <div className="block warn">
            <span className="lab">These coefficients are invented, not measured</span>
            1.6×, 0.4×, "+1" in the compounding formula, the ±3 clamp on psyche magnitude — none of these come from data. They're author-chosen constants that produce plausible-looking curves. delta_logic_physics.md (the source doc for this engine) says as much: "you can read it, argue with it, change the multipliers." That caveat belongs in the public UI, not just the internal design doc — added here 2026-07-01. Known consequence: with only one resolved node, the psyche-magnitude clamp hits its ±3 ceiling immediately and forces the maximum compounding multiplier on the very first data point (see NODE_001 resolution log). Treat any single-node position jump as provisional.
          </div>
          <h3>Zomentum variable</h3>
          <p>Zomentum tracks the gravitational pull of Mamdani's NYC mayoralty on subsequent {"{DS}"} candidates. When Zomentum is high, ANGRY and GUIDED tend to align (compounding mode). When Zomentum collapses, they decouple (friction or stacking mode). Each node carries a Zomentum delta. See the falsifiability-risk flag under Background → Zomentum: this variable is not currently built to be provably wrong, which is the model's own bar for trustworthiness.</p>
          <h3>Scale</h3>
          <p>Position runs from −20 (hard right consolidation — {"{RP}"} holds everything, socialism becomes unsayable) to +20 (full socialist realignment — {"{DS}"} controls enough leverage to govern). Pre-Colorado baseline from resolved nodes: approximately +5.4 raw (before compounding). Full win path (Colorado + Wisconsin + August + Michigan) reaches approximately +16 to +18, leaving room for the environment, general, and speaker nodes.</p>
          <h3>Beta threshold</h3>
          <p>β0.1.0 unlocks when Colorado + Wisconsin + August congressional all resolve and aggregate to one of six scenarios. At that point CDT_004 and CDT_005 activate — Harrow self-updates on node resolutions with human audit. Michigan Senate becomes the first β-phase node: terminal Zomentum test.</p>
          <h2>What this is not</h2>
          <p>Not a prediction engine. Not a seat probability calculator. Not a market-based model. Does not use AI to move position — see the α-phase note on the toolbar above: the live-scan button is currently unwired (no key) and every branch requires a human "Confirm" click. Does not claim certainty. Built to be falsified. Errors are logged publicly. Silent corrections never happen.</p>

          <h2>Bias audit — grounding pass, 2026-07-01</h2>
          <p>This build was criticized publicly for reading as pseudoargument — assertion dressed as analysis, without the sourcing discipline of the original 27 Jun HTML model. This table is the honest accounting of what that meant and what changed.</p>
          <table className="wt" style={{width:"100%", borderCollapse:"collapse", fontSize:".85em", margin:"10px 0"}}>
            <tbody>
              <tr style={{background:"rgba(255,255,255,.06)"}}><th style={{textAlign:"left", padding:"5px 7px", border:"1px solid var(--line)"}}>Failure mode found</th><th style={{textAlign:"left", padding:"5px 7px", border:"1px solid var(--line)"}}>What it looked like</th><th style={{textAlign:"left", padding:"5px 7px", border:"1px solid var(--line)"}}>Fix applied</th></tr>
              <tr><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>Fabricated attributed quotes</td><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>Scenario "Multiple readings" gave invented lines to generic personas ("A {"{D}"} strategist," "A political historian") with no disclosure they were invented</td><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>Relabeled "Invented voices," persistent disclaimer added, framed explicitly as a thinking exercise</td></tr>
              <tr><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>Fact/interpretation blur</td><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>Node "detail" fields mixed sourced fact with interpretive framing (esp. "Zomentum" labels) with no visual distinction</td><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>Added FACT tag + separate "Harrow's read" block per node where interpretation was present</td></tr>
              <tr><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>Unfalsifiable construct</td><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>Zomentum explains both delivery and non-delivery as confirming evidence</td><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>Explicit falsifiability-risk warning added; not resolved, flagged as open problem</td></tr>
              <tr><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>Claimed safeguard the code didn't enforce</td><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>UI said "human resolves all branches" while runScan auto-called resolveNode() on high-confidence results</td><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>Auto-resolve call removed from code; scan now only flags for human review</td></tr>
              <tr><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>Decorative non-functional feature</td><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>Live-scan fetch has no API key, always fails silently, but UI implied an active monitor ("Auto-scan every 20 min")</td><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>Toolbar copy now discloses it's unwired</td></tr>
              <tr><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>Uncaveated invented coefficients</td><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>1.4×/1.6× compounding multipliers presented as calculated "physics"</td><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>Disclosed as author-chosen, adjustable constants in the methodology tab</td></tr>
              <tr><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>No source list</td><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>Unlike the original HTML model, no citation trail for resolved-node facts</td><td style={{padding:"5px 7px", border:"1px solid var(--line)"}}>Sources list added below</td></tr>
            </tbody>
          </table>
          <div className="hatnote">Not claimed to be exhaustive. If something here still reads as asserted-not-sourced, that's the next thing to flag — the point of this table is that the audit itself has to stay falsifiable too.</div>

          <h2>Sources</h2>
          <p className="src" style={{fontSize:".85em", color:"#9ca3af"}}>
            Mamdani NYC win, Trump–Mamdani meetings, DSA convention, Massie primary, Iran-war approval collapse, SCOTUS VRA/Milligan ruling, NYC primary sweep, rent freeze, House war-powers defectors: sourced per the 27 Jun 2026 model (2026_model.html) — Ballotpedia &amp; Wikipedia; RaceToTheWH / 270toWin (Cook–Sabato–Inside Elections composite); Economist/YouGov &amp; The Hill (Trump approval, Iran/gas figures, GOP base erosion); Fox, The Hill, New Republic, Yahoo News, The Mirror (Trump–Mamdani exchange); PBS / NBC / MultiState (redistricting); Pew (median-voter/polarization); DSA <i>Democratic Left</i> &amp; National Electoral Commission tracker. — Colorado CO-01 result (Kiros defeats DeGette, 49.3%–43.5%, AP called 10:03pm MT 6/30/26): Colorado Sun, Colorado Public Radio, 9News, Colorado Newsline, PBS NewsHour, verified 2026-07-01. — Michigan Senate / Kornacki quote: "You Decide with Errol Louis" podcast transcript, June 25, 2026, [00:31:18], as uploaded by the project owner — not independently re-verified against the original audio by Harrow. — Wisconsin governor primary detail (Hong campaign facts, straw-poll numbers, attack vectors): as compiled in the α0.7.0 briefing, not independently re-verified in this pass. No betting-market data used anywhere in this model.
          </p>
        </div>
      )}

      {tab==="betting" && (
        <div>
          <h2>Against prediction markets</h2>
          <p>Prediction markets price the perceived probability of discrete outcomes. This is a legitimate measurement. It is not what this project measures. Conflating the two produces a specific error: tracking probability instead of possibility.</p>
          <h3>The Sanders argument</h3>
          <p>Bernie Sanders ran for president in 2016 and 2020 on an explicitly socialist platform. Prediction markets priced him to lose — correctly. He did lose both times. But in that span, he made socialism sayable in mainstream American politics where it had been unsayable for fifty years. By 2026, Democratic Socialists are winning primaries, Francesca Hong is polling at the top of a Wisconsin gubernatorial primary field, and a {"{DS}"}-aligned candidate is the frontrunner in the Michigan Senate Democratic primary.</p>
          <p>A model using betting odds as inputs would have tracked Sanders' low win probability rather than socialism's rising sayability. These are categorically different measurements. The market correctly predicted the election result and entirely missed the window movement.</p>
          <h3>The structural problem</h3>
          <p>Markets reward correct probability estimation. They do not reward measuring boundary shifts. A trader profits from Sanders losing, not from tracking that his campaign moved the window on socialism. Markets are also self-referential: high odds generate media coverage that pushes outcomes toward the predicted direction. Using that as measurement input introduces feedback that distorts rather than reveals.</p>
          <h3>The decision</h3>
          <p>Prediction markets are excluded from all Overton inputs. Window movement is traced from dated, sourced, human-verified political events only.</p>
        </div>
      )}

      <div className="ft">
        Overton Project · α0.7.0 · Proof of concept, work in progress · July 1, 2026 · Scale −20 to +20 · Betting markets excluded · Errors logged publicly · The 2026 election is an instrument, not the subject · <a href="https://act.dsausa.org/donate/ibd_campaign">See how</a>
      </div>

    </div></div>
  );
}

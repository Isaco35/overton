# DELTA LOGIC — Physics Model

**Confirmed node resolution applies a delta. The delta's effect depends on the window's current momentum state.**

---

## Three Physics Modes

### 1. STACKING (Linear Addition)
```
When: ANGRY ▼ AND GUIDED ▼ (stasis — no momentum)
Rule: Δ_new simply adds to position
Equation: position_t+1 = position_t + delta

Example:
  position = 42
  NODE resolves with delta = +6
  → position = 42 + 6 = 48
```

**Why:** No emotional or strategic energy. The delta sits. Displacement is literal, not amplified.

---

### 2. COMPOUNDING (Acceleration / Momentum Multiplication)
```
When: ANGRY ▲ AND GUIDED ▲ (both rising — coherent force + direction)
Rule: Delta amplifies based on current momentum. Velocity increases.
Equation: position_t+1 = position_t + (delta × momentum_multiplier)
          velocity_t+1 = velocity_t × 1.4  (acceleration)

Momentum multiplier = 1 + (|ANGRY| + |GUIDED|) / 2
  Example: ANGRY=0.6, GUIDED=0.5 → multiplier = 1.55

Resolved delta: +6 × 1.55 = +9.3
→ position jumps higher
→ velocity itself accelerates
```

**Why:** Rage AND strategy together. The window doesn't just move — it accelerates. Ideas spread with both force and architecture.

---

### 3. FRICTION / DAMPING (Opposing Momenta Reduce Effect)
```
When: (ANGRY ▲ AND GUIDED ▼) OR (ANGRY ▼ AND GUIDED ▲)
      (forces pulling in opposite emotional directions)
Rule: Deltas are dampened. Opposite psyche states create resistance.
Equation: position_t+1 = position_t + (delta × friction_factor)
          velocity_t+1 = velocity_t × 0.7  (deceleration)

Friction factor = 1 − (|ANGRY − GUIDED| / 2)
  Example: ANGRY=0.6, GUIDED=−0.3 → divergence = 0.9 → factor = 0.55

Resolved delta: +6 × 0.55 = +3.3
→ position advances slower
→ velocity decays toward zero
→ next delta must overcome inertia to reverse direction
```

**Why:** Rage without direction, or order without energy. The window wants to move but something resists. Not stasis — friction. It takes more force to turn it.

---

## Confirmation Flow

```
Human resolves NODE_001 → calls Branch A
                         ↓
System calculates: delta = +6
                  psyche state: ANGRY ▲ GUIDED ▲
                  mode: COMPOUNDING
                  → multiplier = 1.55
                  → effective delta = +9.3
                         ↓
System displays: "NODE_001 Branch A resolved.
                  Delta +6 → +9.3 (compounded by momentum).
                  Position: 42 → 51.3
                  Velocity: −0.8 → −1.12 (accelerating)
                  
                  [CONFIRM?] [REJECT] [ADJUST]"
                         ↓
Human confirms
                         ↓
position = 51.3
velocity = −1.12
logged in Dev with timestamp and reasoning (optional)
```

---

## Special Case: Reversal Friction

If a delta pushes **opposite** the current velocity direction (e.g., positive delta when velocity is negative):

```
The friction factor increases.
The node is fighting the momentum, not riding it.
It must overcome inertia before reversing direction.

delta = +3 (rightward push)
current velocity = −0.8 (leftward)
friction factor = 0.4 (high — opposite direction)
→ effective delta = +3 × 0.4 = +1.2

Position moves right, but slowly.
Velocity stays negative until the cumulative effect builds.
```

---

## Pseudocode

```javascript
function apply_delta(delta, angry, guided) {
  // Determine mode
  const angry_dir = Math.sign(angry);
  const guided_dir = Math.sign(guided);
  
  if (angry_dir === 0 && guided_dir === 0) {
    mode = "STACKING";
    multiplier = 1.0;
  } else if (angry_dir === guided_dir && Math.abs(angry) > 0.2 && Math.abs(guided) > 0.2) {
    mode = "COMPOUNDING";
    multiplier = 1 + (Math.abs(angry) + Math.abs(guided)) / 2;
  } else {
    mode = "FRICTION";
    multiplier = 1 - (Math.abs(angry - guided) / 2);
  }
  
  // Apply multiplier
  effective_delta = delta * multiplier;
  
  // Check direction reversal friction
  if (Math.sign(effective_delta) !== Math.sign(velocity)) {
    multiplier *= 0.6;  // Extra friction against momentum
    effective_delta = delta * multiplier;
  }
  
  // Update
  position += effective_delta;
  velocity = (position_new - position_old) / time_elapsed;
  
  return {
    mode,
    delta_original: delta,
    multiplier,
    delta_effective: effective_delta,
    position_new: position,
    velocity_new: velocity
  };
}
```

---

## What This Model Does

- **Makes delta logic visible.** Not hidden math. You can read it, argue with it, change the multipliers.
- **Couples psyche to effect.** ANGRY and GUIDED don't just describe mood — they change the window's physics.
- **Preserves reversal difficulty.** Pushing against momentum costs more. The window has inertia.
- **Stays falsifiable.** On June 30, if the math is wrong, reality will show it.

---

## To Adjust

Before NODE_001 resolves, if the multipliers feel wrong:
- Change the compounding threshold (currently 0.2 per axis)
- Adjust the acceleration/deceleration rates (currently 1.4× and 0.7×)
- Reweight the friction divergence formula

Log every change in Overton Dev with reasoning.

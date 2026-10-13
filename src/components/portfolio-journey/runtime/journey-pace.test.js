import { describe, expect, it } from 'vitest';
import { descentPace, forestCurve, zoom } from './journey-pace.js';

const slope = (fn, x, h = 1e-4) => (fn(x + h) - fn(x - h)) / (2 * h);
// Desktop 1280×800: scene 800px, 380vh journey.
const layout = {
  height: 800,
  baseTravel: 2240,
  forestEnd: 0.35,
  worldTravel: 1.1,
  tailPace: 1.6,
  nearZoom: Math.log(8 / 1.65),
};

describe('Journey pacing', () => {
  it('keeps the approved forest framing at both ends', () => {
    expect(forestCurve(0, 0.7, 0.45)).toBe(0);
    expect(forestCurve(1, 0.7, 0.45)).toBeCloseTo(1, 12);
    expect(zoom([8, 1.65], 0)).toBe(8);
    expect(zoom([8, 1.65], 1)).toBeCloseTo(1.65, 12);
  });
  it('moves on the first scroll and arrives at the requested closing speed', () => {
    const curve = (t) => forestCurve(t, 0.7, 0.45);
    expect(slope(curve, 1e-3)).toBeCloseTo(0.7, 2);
    expect(slope(curve, 1 - 1e-3)).toBeCloseTo(0.45, 2);
    for (let t = 0.05; t < 1; t += 0.05)
      expect(curve(t + 0.01)).toBeGreaterThan(curve(t));
  });
  it('keeps the approved descent length and hands off at native speed', () => {
    const pace = descentPace(layout);
    // Length the descent had with its former 0.3-screen ease-in.
    const approved =
      0.3 * 800 + (880 - 0.396 * 120 - (1.396 * 520) / 2) / 0.396 + 520;
    expect(pace.distance).toBeCloseTo(approved, -1);
    expect(pace.at(pace.distance)).toBeCloseTo(pace.pixels, 6);
    expect(slope(pace.at, pace.distance - 0.01, 0.005)).toBeCloseTo(1, 2);
  });
  it('enters the descent at the forest closing speed instead of a standstill', () => {
    const pace = descentPace(layout);
    const entry = slope(pace.at, 0.01, 0.005);
    expect(entry).toBeCloseTo(pace.cruise, 6);
    expect(entry).toBeGreaterThan(0.3);
    // Visible forest motion at the seam (nearest frame, half a screen out).
    const forestPx = layout.baseTravel * layout.forestEnd;
    const closing =
      ((layout.height / 2) * layout.nearZoom * pace.forestEndPace) / forestPx;
    expect(closing).toBeCloseTo(entry, 6);
  });
});

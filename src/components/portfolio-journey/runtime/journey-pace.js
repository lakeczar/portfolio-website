// Scroll-to-motion pacing for the spring → forest → underground journey.
// Pure functions: no input capture, inertia, or motion after scrolling stops.

const clamp = (v) => Math.max(0, Math.min(1, v));
// Integral of smoothstep: changes speed smoothly over a fixed scroll distance.
const integratedEase = (t) => t * t * t * (1 - t / 2);

/** Log-space scale interpolation, so equal scrolling reads as equal zoom. */
export const zoom = ([from, to], t) => from * Math.pow(to / from, t);

/**
 * Forest zoom position from 0 to 1. Speed (relative to the forest's average)
 * begins at `start` so the first scroll responds, swells through the middle,
 * and settles at `end` so the descent takes over without a stall.
 */
export function forestCurve(v, start, end) {
  const t = clamp(v),
    swell = 1 - (start + end) / 2;
  return start * t + ((end - start) * t * t) / 2 + swell * t * t * (3 - 2 * t);
}

/**
 * Descent pacing for one layout. `nearZoom` is the forest's log zoom range,
 * used to express the forest's closing speed in the descent's units.
 */
export function descentPace({
  height,
  baseTravel,
  forestEnd,
  worldTravel,
  tailPace,
  nearZoom,
}) {
  const pixels = height * worldTravel;
  // The approved scroll length came from this pace with a 0.3-screen ease-in.
  // Keep that length, but enter at cruise speed instead of from a standstill.
  const approvedPace = Math.max(
    0.25,
    Math.min(0.75, pixels / (baseTravel * 0.62 * tailPace))
  );
  const rampIn = height * 0.3,
    rampOut = height * 0.65;
  const distance =
    rampIn +
    (pixels -
      (approvedPace * rampIn) / 2 -
      ((approvedPace + 1) * rampOut) / 2) /
      approvedPace +
    rampOut;
  // Finish at native 1:1 speed so releasing the sticky scene causes no jump.
  const cruise = (pixels - rampOut / 2) / (distance - rampOut / 2);
  const cruiseDistance = distance - rampOut;
  const forestSpeed = ((height / 2) * nearZoom) / (baseTravel * forestEnd);
  return {
    pixels,
    distance,
    cruise,
    forestEndPace: Math.max(0.3, Math.min(1, cruise / forestSpeed)),
    at(scrolled) {
      const x = Math.max(0, Math.min(distance, scrolled));
      if (x <= cruiseDistance) return cruise * x;
      return (
        cruise * x +
        (1 - cruise) * rampOut * integratedEase((x - cruiseDistance) / rampOut)
      );
    },
  };
}

import { describe, expect, it } from 'vitest';
import initialize from './style-profiles.js';
describe('Art-style choices', () => {
  it('puts the main cel artwork first without changing existing IDs or asset paths', () => {
    const state = {};
    initialize(state);
    expect(Object.keys(state.styleProfiles)).toEqual([
      'cel',
      'evening',
      'current',
      'book',
    ]);
    expect(
      Object.values(state.styleProfiles).map((profile) => profile.label)
    ).toEqual([
      'Daylight (cel)',
      'Evening (cel)',
      'Cinematic study',
      'Storybook study',
    ]);
    expect(state.styleProfiles.cel.spring).toBe(
      '/portfolio-assets/cel-spring.webp'
    );
  });
  it('preserves browser-local automatic day/evening boundaries', () => {
    const state = {};
    initialize(state);
    for (const [hour, minute, expected] of [
      [5, 59, 'evening'],
      [6, 0, 'cel'],
      [16, 59, 'cel'],
      [17, 0, 'evening'],
    ]) {
      expect(
        state.portfolioStyleForTime(new Date(2026, 8, 8, hour, minute))
      ).toBe(expected);
    }
  });
});

// Player progress lives in localStorage. The server still holds the answers and
// the next-door URLs, so this is a convenience record, not the gate itself.

export type Fragment = 'EVENING' | 'STAR' | 'ANSWERS';

export interface Progress {
  solved: number[];
  fragments: Fragment[];
}

const KEY = 'vesper.progress.v1';
const EMPTY: Progress = { solved: [], fragments: [] };

export function getProgress(): Progress {
  if (typeof window === 'undefined') return { ...EMPTY };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      solved: Array.isArray(parsed.solved) ? parsed.solved : [],
      fragments: Array.isArray(parsed.fragments) ? parsed.fragments : [],
    };
  } catch {
    return { ...EMPTY };
  }
}

export function saveSolved(stage: number, fragment?: Fragment): void {
  if (typeof window === 'undefined') return;
  const p = getProgress();
  if (!p.solved.includes(stage)) p.solved.push(stage);
  if (fragment && !p.fragments.includes(fragment)) p.fragments.push(fragment);
  window.localStorage.setItem(KEY, JSON.stringify(p));
}

export function hasSolved(stage: number): boolean {
  return getProgress().solved.includes(stage);
}

export function hasFragment(f: Fragment): boolean {
  return getProgress().fragments.includes(f);
}

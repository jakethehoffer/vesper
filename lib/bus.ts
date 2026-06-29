// A hairline-thin event bus so any page can change VESPER's "mood" and the
// carrier wave (rendered once, in the layout) reacts. Decouples the signature
// visual from page logic.

export type VesperMode = 'idle' | 'speak' | 'error' | 'success' | 'climax';

const EVENT = 'vesper:state';

export function setVesper(mode: VesperMode): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<VesperMode>(EVENT, { detail: mode }));
}

export function onVesper(cb: (mode: VesperMode) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: Event) => cb((e as CustomEvent<VesperMode>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}

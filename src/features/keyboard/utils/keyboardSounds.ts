let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctx =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  audioContext ??= new Ctx();
  return audioContext;
}

/**
 * Browsers only let an `AudioContext` actually produce sound once it has
 * been created/resumed inside a real user gesture, and `resume()` is
 * asynchronous. Previously the context was created and resumed lazily
 * inside `tone()` itself — the very first keystroke's oscillator was
 * scheduled against a context that was often still `"suspended"` at that
 * instant, so the first click (and, on stricter browsers, every click
 * until the async `resume()` happened to finish) was silently dropped.
 *
 * Attaching a one-time listener for the earliest possible user gesture
 * (pointerdown/keydown/touchstart, anywhere in the document) creates and
 * resumes the context ahead of time, so by the time a real typing sound
 * is requested the context is already running. This mirrors the standard
 * "unlock audio on first interaction" pattern and needs no UI of its own.
 */
function unlockAudioOnFirstGesture() {
  if (typeof document === "undefined") return;
  const events: Array<keyof DocumentEventMap> = ["pointerdown", "keydown", "touchstart"];
  const unlock = () => {
    const ctx = getContext();
    if (ctx && ctx.state === "suspended") void ctx.resume();
    events.forEach((event) => document.removeEventListener(event, unlock));
  };
  events.forEach((event) => document.addEventListener(event, unlock, { passive: true }));
}

unlockAudioOnFirstGesture();

function tone(
  frequency: number,
  duration: number,
  gainValue: number,
  type: OscillatorType = "sine",
  delay = 0,
) {
  const ctx = getContext();
  if (!ctx) return;
  // Defensive fallback: if the gesture-unlock listener above hasn't run
  // yet for some reason (e.g. a synthetic/programmatic call), still try
  // to resume here rather than silently dropping the sound.
  if (ctx.state === "suspended") void ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime + delay;

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.01);
}

/** Short, subtle feedback for a correct Urdu keystroke. */
export function playKeyClick() {
  tone(720, 0.035, 0.108, "sine");
}

/** Slightly lower click so a correction is distinguishable without being harsh. */
export function playBackspaceClick() {
  tone(460, 0.045, 0.084, "sine");
}

/** A soft error tick for an incorrect character. */
export function playErrorClick() {
  tone(190, 0.065, 0.132, "triangle");
}

/** Short positive cue when a lesson step is completed. */
export function playStepComplete() {
  tone(659.25, 0.08, 0.108, "sine");
  tone(783.99, 0.12, 0.12, "sine", 0.06);
}

/** Small achievement cue for completing the full guided lesson. */
export function playLessonComplete() {
  tone(523.25, 0.1, 0.12, "sine");
  tone(659.25, 0.1, 0.132, "sine", 0.08);
  tone(783.99, 0.14, 0.144, "sine", 0.16);
  tone(1046.5, 0.2, 0.156, "sine", 0.26);
}

/** Positive completion sound used when a typing session produces a result. */
export function playResultSuccess() {
  tone(523.25, 0.12, 0.132, "sine");
  tone(659.25, 0.16, 0.144, "sine", 0.075);
  tone(783.99, 0.22, 0.156, "sine", 0.15);
}

/** A gentler completion sound for a result that needs more practice. */
export function playResultNeutral() {
  tone(392, 0.12, 0.108, "sine");
  tone(329.63, 0.18, 0.108, "sine", 0.08);
}

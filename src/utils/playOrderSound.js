// Real-time Order Sound Notification Utility using Web Audio API
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Unlocks Web Audio API context on user interaction (e.g., button click)
 */
export function unlockAudioContext() {
  const ctx = getAudioContext();
  if (ctx && ctx.state === "suspended") {
    return ctx.resume();
  }
  return Promise.resolve();
}

/**
 * Plays a pleasant 3-tone notification chime for new customer orders
 */
export function playOrderSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    
    // Notes frequency sequence for order alert chime (D5, F#5, A5, D6)
    const notes = [587.33, 739.99, 880.00, 1174.66];
    const noteDuration = 0.12;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + index * noteDuration);

      // Smooth attack and exponential decay
      gain.gain.setValueAtTime(0.01, now + index * noteDuration);
      gain.gain.exponentialRampToValueAtTime(0.3, now + index * noteDuration + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (index + 1) * noteDuration + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * noteDuration);
      osc.stop(now + (index + 1) * noteDuration + 0.2);
    });

    return true;
  } catch (err) {
    console.warn("Could not play order notification sound:", err);
    return false;
  }
}

/**
 * Tests playing the order notification sound
 */
export function testOrderSound() {
  unlockAudioContext();
  return playOrderSound();
}

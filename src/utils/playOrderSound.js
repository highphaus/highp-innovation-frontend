// Real-time Storefront Order Announcement Chime Utility using Web Audio API
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
 * Unlocks Web Audio API context on user interaction
 */
export function unlockAudioContext() {
  const ctx = getAudioContext();
  if (ctx && ctx.state === "suspended") {
    return ctx.resume();
  }
  return Promise.resolve();
}

/**
 * Plays a warm, elegant two-tone storefront announcement chime ("Ding-Dong") for new orders
 */
export function playOrderSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Classic Store Announcement Chime Notes:
    // Note 1: High "Ding" (G5 - 783.99 Hz)
    // Note 2: Low "Dong" (E5 - 659.25 Hz)
    const tones = [
      { freq: 783.99, delay: 0, duration: 0.55, gainVal: 0.25 },
      { freq: 659.25, delay: 0.24, duration: 0.8, gainVal: 0.22 }
    ];

    tones.forEach(({ freq, delay, duration, gainVal }) => {
      const startTime = now + delay;
      
      // Fundamental Oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      // Warm 2nd Harmonic Overtone (soft bell sheen)
      const harmonicOsc = ctx.createOscillator();
      const harmonicGain = ctx.createGain();
      harmonicOsc.type = "sine";
      harmonicOsc.frequency.setValueAtTime(freq * 2, startTime);

      // Envelope: Instant soft attack, long natural bell decay
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(gainVal, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      harmonicGain.gain.setValueAtTime(0.001, startTime);
      harmonicGain.gain.linearRampToValueAtTime(gainVal * 0.12, startTime + 0.015);
      harmonicGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.6);

      osc.connect(gain);
      harmonicOsc.connect(harmonicGain);
      
      gain.connect(ctx.destination);
      harmonicGain.connect(ctx.destination);

      osc.start(startTime);
      harmonicOsc.start(startTime);

      osc.stop(startTime + duration + 0.05);
      harmonicOsc.stop(startTime + duration + 0.05);
    });

    return true;
  } catch (err) {
    console.warn("Could not play order announcement chime:", err);
    return false;
  }
}

/**
 * Tests playing the order announcement chime
 */
export function testOrderSound() {
  unlockAudioContext();
  return playOrderSound();
}

// Speech Synthesis Voice Order Announcement Utility (100% Volume Clear Female Voice)
let selectedFemaleVoice = null;

function loadFemaleVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    selectedFemaleVoice = voices.find(v => 
      (v.name.toLowerCase().includes("female") || 
       v.name.includes("Samantha") || 
       v.name.includes("Victoria") || 
       v.name.includes("Karen") || 
       v.name.includes("Zira") || 
       v.name.includes("Google UK English Female") ||
       v.name.includes("Google US English") ||
       v.name.includes("Microsoft Zira")) && v.lang.startsWith("en")
    ) || voices.find(v => v.lang.startsWith("en")) || null;
  }
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  loadFemaleVoice();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadFemaleVoice;
  }
}

/**
 * Unlocks audio / speech context on user interaction
 */
export function unlockAudioContext() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    loadFemaleVoice();
    try {
      const silent = new SpeechSynthesisUtterance("");
      silent.volume = 0;
      window.speechSynthesis.speak(silent);
    } catch {}
  }
  return Promise.resolve();
}

/**
 * Speaks "You have a new order!" in a clear female voice at 100% volume (No chime, no alarm).
 */
export function playOrderSound() {
  try {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.warn("Speech synthesis API is not available.");
      return false;
    }

    // Cancel any previous active speech to ensure immediate execution
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance("You have a new order!");
    utterance.volume = 1.0; // 100% Volume
    utterance.rate = 0.95;  // Clear, natural speaking speed
    utterance.pitch = 1.15; // Pleasant female voice pitch

    loadFemaleVoice();
    if (selectedFemaleVoice) {
      utterance.voice = selectedFemaleVoice;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn("Could not execute female voice order announcement:", err);
    return false;
  }
}

/**
 * Tests playing the female voice announcement
 */
export function testOrderSound() {
  unlockAudioContext();
  return playOrderSound();
}

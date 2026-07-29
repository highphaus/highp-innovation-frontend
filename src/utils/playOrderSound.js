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
 * Requests desktop notification permissions so alerts work even when tab is minimized or user is on another app
 */
export function requestNotificationPermission() {
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }
}

/**
 * Unlocks audio / speech context on user interaction
 */
export function unlockAudioContext() {
  if (typeof window !== "undefined") {
    requestNotificationPermission();
    if ("speechSynthesis" in window) {
      loadFemaleVoice();
      try {
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        const silent = new SpeechSynthesisUtterance("");
        silent.volume = 0;
        window.speechSynthesis.speak(silent);
      } catch {}
    }
  }
  return Promise.resolve();
}

/**
 * Speaks "You have a new order!" in a clear female voice at 100% volume and displays system desktop notifications.
 */
export function playOrderSound(orderDetails = null) {
  try {
    // 1. Trigger Desktop System Notification (Works when user is on another tab/app or screen minimized)
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        try {
          const title = "🎉 New Order Received!";
          const body = orderDetails?.customerName 
            ? `Customer: ${orderDetails.customerName} (₹${orderDetails.totalAmount || ''})` 
            : "You have a new order! Tap to open manager workspace.";
          const notif = new Notification(title, {
            body,
            tag: `order-alert-${Date.now()}`,
            renotify: true,
            requireInteraction: true
          });
          notif.onclick = () => {
            window.focus();
            notif.close();
          };
        } catch (e) {
          console.warn("Desktop notification trigger notice:", e);
        }
      } else if (Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }
    }

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.warn("Speech synthesis API is not available.");
      return false;
    }

    // 2. Resume speech engine if suspended by browser tab background throttling
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
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

    setTimeout(() => {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }, 150);

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
  return playOrderSound({ customerName: "Test Order", totalAmount: 450 });
}

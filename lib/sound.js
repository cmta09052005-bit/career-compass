import { browserStorage } from "@/lib/browserStorage";
const KEY = "careerCompassSound";
let enabled = false;
let activated = false;
const playing = new Set();
export function initializeSound() {
  try { enabled = browserStorage.getItem(KEY) === "on"; } catch { enabled = false; }
}
export function activateSound() { activated = true; }
export function soundEnabled() { return enabled; }
export function setSoundEnabled(value) {
  enabled = value;
  try { browserStorage.setItem(KEY, value ? "on" : "off"); } catch { /* In-memory state still works. */ }
  if (!value) stopSounds();
  else playSound("confirm");
}
export function stopSounds() { playing.forEach((audio) => audio.pause()); playing.clear(); }
export function playSound(name, { volume } = {}) {
  if (!enabled || !activated || typeof document === "undefined" || document.hidden) return;
  if (!["tap", "open", "close", "unlock", "badge", "settings", "confirm"].includes(name)) return;
  const audio = new Audio(`/sounds/${name}.wav`);
  audio.volume = volume === undefined ? (name === "settings" ? .25 : .55) : Math.max(0, Math.min(1, volume));
  playing.add(audio);
  audio.onended = () => playing.delete(audio);
  audio.onerror = () => playing.delete(audio);
  audio.play().catch(() => playing.delete(audio));
}

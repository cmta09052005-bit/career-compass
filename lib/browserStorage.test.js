import assert from "node:assert/strict";
import test from "node:test";

class Storage {
  values = new Map();
  blocked = false;
  full = false;
  getItem(key) { if (this.blocked) throw new Error("blocked"); return this.values.get(key) ?? null; }
  setItem(key, value) { if (this.blocked || this.full) throw new Error("full"); this.values.set(key, String(value)); }
  removeItem(key) { if (this.blocked) throw new Error("blocked"); this.values.delete(key); }
}
let instance = 0;
async function setup(local = new Storage(), legacy = new Storage()) {
  globalThis.window = Object.assign(new EventTarget(), { localStorage: local, sessionStorage: legacy });
  return { local, legacy, ...await import(`./browserStorage.js?test=${instance++}`) };
}

test("legacy progress, preferences and journey notices migrate together", async () => {
  const legacy = new Storage();
  const answer = JSON.stringify({ strand: "Academic-STEM", interests: { "INT-01": "A" } });
  for (const [key, value] of Object.entries({ careerCompassSession: answer, careerCompassLanguage: "fil", careerCompassSound: "on", careerCompassValleyStep: "2", careerCompassBadgeNotices: '["interests"]' })) legacy.setItem(key, value);
  const store = await setup(new Storage(), legacy);
  assert.equal(store.browserStorage.getItem(store.PROGRESS_KEY), answer);
  assert.equal(store.local.getItem("careerCompassLanguage"), "fil");
  assert.equal(store.local.getItem("careerCompassValleyStep"), "2");
  assert.equal(legacy.getItem(store.PROGRESS_KEY), null);
});

test("existing local journey wins without mixing old tab notices", async () => {
  const local = new Storage(), legacy = new Storage();
  local.setItem("careerCompassSession", '{"nickname":"Current"}');
  legacy.setItem("careerCompassSession", '{"nickname":"Old"}');
  legacy.setItem("careerCompassExpeditionSeen", "true");
  const store = await setup(local, legacy);
  assert.equal(store.browserStorage.getItem(store.PROGRESS_KEY), '{"nickname":"Current"}');
  assert.equal(store.browserStorage.getItem("careerCompassExpeditionSeen"), null);
});

test("an interrupted migration resumes its remaining journey keys", async () => {
  const local = new Storage(), legacy = new Storage();
  local.setItem("careerCompassLocalMigrationV1", "journey");
  local.setItem("careerCompassSession", '{"nickname":"Migrating"}');
  legacy.setItem("careerCompassSession", '{"nickname":"Migrating"}');
  legacy.setItem("careerCompassValleyStep", "2");
  const store = await setup(local, legacy);
  assert.equal(store.browserStorage.getItem("careerCompassValleyStep"), "2");
  assert.equal(local.getItem("careerCompassLocalMigrationV1"), "true");
  assert.equal(legacy.getItem(store.PROGRESS_KEY), null);
});

test("reset removes journey records, preserves preferences and unrelated storage, and prevents legacy resurrection", async () => {
  const store = await setup();
  for (const key of store.JOURNEY_KEYS) store.browserStorage.setItem(key, "saved");
  store.browserStorage.setItem("careerCompassSound", "on");
  store.local.setItem("unrelated", "keep");
  store.resetStoredJourney();
  for (const key of store.JOURNEY_KEYS) assert.equal(store.local.getItem(key), null);
  assert.equal(store.local.getItem("careerCompassSound"), "on");
  assert.equal(store.local.getItem("unrelated"), "keep");
  const oldTab = new Storage();
  oldTab.setItem(store.PROGRESS_KEY, '{"nickname":"Old"}');
  const reopened = await setup(store.local, oldTab);
  assert.equal(reopened.browserStorage.getItem(store.PROGRESS_KEY), null);
});

test("closing and reopening with fresh session storage retains local data", async () => {
  const store = await setup();
  store.browserStorage.setItem(store.PROGRESS_KEY, '{"nickname":"Returning"}');
  const reopened = await setup(store.local);
  assert.equal(reopened.browserStorage.getItem(store.PROGRESS_KEY), '{"nickname":"Returning"}');
});

test("failed writes keep the newest in-memory answer and retry successfully", async () => {
  const store = await setup();
  store.browserStorage.setItem(store.PROGRESS_KEY, "old");
  store.local.blocked = true;
  assert.equal(store.browserStorage.setItem(store.PROGRESS_KEY, "new"), false);
  assert.equal(store.browserStorage.getItem(store.PROGRESS_KEY), "new");
  assert.equal(store.hasUnsavedChanges(), true);
  store.local.blocked = false;
  store.retryPendingChanges();
  assert.equal(store.local.getItem(store.PROGRESS_KEY), "new");
  assert.equal(store.hasUnsavedChanges(), false);
});

test("failed deletion stays cleared in memory and can be retried", async () => {
  const store = await setup();
  store.browserStorage.setItem(store.PROGRESS_KEY, "old");
  store.local.blocked = true;
  store.resetStoredJourney();
  assert.equal(store.browserStorage.getItem(store.PROGRESS_KEY), null);
  assert.equal(store.hasUnsavedChanges(), true);
  store.local.blocked = false;
  store.retryPendingChanges();
  assert.equal(store.local.getItem(store.PROGRESS_KEY), null);
  assert.equal(store.hasUnsavedChanges(), false);
});

test("storage subscribers see same-page updates and cross-tab resets", async () => {
  const store = await setup();
  const keys = [];
  const stop = store.subscribeToStorage(key => keys.push(key));
  store.browserStorage.setItem(store.PROGRESS_KEY, "new");
  const event = new Event("storage");
  Object.assign(event, { key: store.PROGRESS_KEY, storageArea: store.local });
  store.local.removeItem(store.PROGRESS_KEY);
  window.dispatchEvent(event);
  assert.deepEqual(keys, [store.PROGRESS_KEY, store.PROGRESS_KEY]);
  stop();
  store.browserStorage.setItem(store.PROGRESS_KEY, "later");
  assert.equal(keys.length, 2);
});

test("blocked storage retains legacy answers without deleting them", async () => {
  const local = new Storage(), legacy = new Storage();
  local.blocked = true;
  legacy.setItem("careerCompassSession", "legacy");
  const store = await setup(local, legacy);
  assert.equal(store.browserStorage.getItem(store.PROGRESS_KEY), "legacy");
  assert.equal(legacy.getItem(store.PROGRESS_KEY), "legacy");
  store.browserStorage.setItem(store.PROGRESS_KEY, "edited");
  assert.equal(store.browserStorage.getItem(store.PROGRESS_KEY), "edited");
  local.blocked = false;
  store.retryPendingChanges();
  assert.equal(local.getItem(store.PROGRESS_KEY), "edited");
});

test("quota failure during migration retains legacy answers even when reads still work", async () => {
  const local = new Storage(), legacy = new Storage();
  local.full = true;
  legacy.setItem("careerCompassSession", "legacy");
  const store = await setup(local, legacy);
  assert.equal(store.browserStorage.getItem(store.PROGRESS_KEY), "legacy");
  store.browserStorage.setItem(store.PROGRESS_KEY, "edited");
  assert.equal(store.browserStorage.getItem(store.PROGRESS_KEY), "edited");
  assert.equal(legacy.getItem(store.PROGRESS_KEY), "legacy");
  local.full = false;
  store.retryPendingChanges();
  assert.equal(local.getItem(store.PROGRESS_KEY), "edited");
});

/* The generated root /sw.js supplies only public build resources, never answers. */
const manifest = self.OFFLINE_MANIFEST;
const CACHE_PREFIX = "career-compass-offline-";
const CACHE = CACHE_PREFIX + manifest.version;
const READY = "/__career_compass_offline_ready__";
const PERMISSION_CACHE = CACHE_PREFIX + "update-permission";
const PERMISSION = "/__career_compass_update_permission__";
let enabled = true;
let complete = false;
let controller;

async function broadcast(message) {
  for (const client of await self.clients.matchAll({ type: "window", includeUncontrolled: true })) client.postMessage(message);
}
function status() { return { type: "OFFLINE_STATUS", version: manifest.version, bytes: manifest.bytes, resources: manifest.resources.length, complete }; }

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const connection = self.navigator?.connection;
    const permission = await caches.match(PERMISSION, { cacheName: PERMISSION_CACHE });
    const explicitlyRequested = permission && Number(await permission.text()) > Date.now();
    if (self.registration?.active && connection && (connection.saveData || ["slow-2g", "2g", "3g"].includes(connection.effectiveType)) && !explicitlyRequested) {
      await broadcast({ ...status(), type: "OFFLINE_UPDATE_DEFERRED" });
      throw new Error("Background update deferred on a limited connection");
    }
    controller = new AbortController();
    // A failed new build never damages the working old build.
    await caches.delete(CACHE);
    const cache = await caches.open(CACHE);
    let index = 0, downloaded = 0, count = 0;
    let workers = [];
    try {
      workers = Array.from({ length: 4 }, async () => {
        while (index < manifest.resources.length) {
          const resource = manifest.resources[index++];
          const response = await fetch(resource.url, { cache: "no-store", credentials: "omit", signal: controller.signal });
          if (!response.ok || response.type === "opaque" || !enabled) throw new Error("Download did not finish");
          const body = await response.arrayBuffer();
          const headers = new Headers(response.headers);
          headers.delete("content-encoding");
          headers.delete("content-length");
          headers.delete("vary");
          if (resource.type === "rsc") {
            headers.set("content-type", "text/x-component");
            headers.set("x-nextjs-prerender", "1");
            headers.set("x-nextjs-stale-time", "300");
          }
          await cache.put(resource.key, new Response(body, { status: 200, headers }));
          downloaded += resource.bytes;
          count++;
          await broadcast({ ...status(), type: "OFFLINE_PROGRESS", percent: Math.min(99, Math.floor(downloaded / manifest.bytes * 100)), count });
        }
      });
      await Promise.all(workers);
      if (!enabled) throw new Error("Offline Mode turned off");
      await cache.put(READY, new Response(JSON.stringify(status())));
      complete = true;
      await broadcast({ ...status(), type: "OFFLINE_COMPLETE", percent: 100 });
    } catch (error) {
      controller.abort();
      await Promise.allSettled(workers);
      await caches.delete(CACHE);
      await broadcast({ type: "OFFLINE_ERROR", message: error.name === "QuotaExceededError" ? "storage" : "download" });
      throw error;
    }
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    if (!await cache.match(READY)) throw new Error("Incomplete offline copy");
    if (!enabled) return;
    complete = true;
    await Promise.all((await caches.keys()).filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
    if (!enabled) return;
    await broadcast({ ...status(), type: "OFFLINE_READY" });
  })());
});

self.addEventListener("message", event => {
  const reply = message => { if (event.ports[0]) event.ports[0].postMessage(message); else event.source?.postMessage(message); };
  if (event.data?.type === "STATUS") event.waitUntil((async () => {
    complete = !!await caches.match(READY, { cacheName: CACHE });
    reply(status());
  })());
  if (event.data?.type === "DISABLE") {
    enabled = false;
    controller?.abort();
    event.waitUntil(caches.delete(CACHE).then(() => reply({ type: "OFFLINE_DISABLED" })));
  }
  if (event.data?.type === "ALLOW_UPDATE") event.waitUntil((async () => {
    await (await caches.open(PERMISSION_CACHE)).put(PERMISSION, new Response(String(Date.now() + 120000)));
    reply({ type: "OFFLINE_UPDATE_ALLOWED" });
  })());
  if (event.data?.type === "APPLY_UPDATE") event.waitUntil((async () => {
    const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    if (clients.some(client => /^\/(journey\/(interests|skills|academic)|processing)(\/|$)/.test(new URL(client.url).pathname))) {
      reply({ type: "OFFLINE_UPDATE_BLOCKED" });
      return;
    }
    reply({ type: "OFFLINE_APPLYING" });
    await self.skipWaiting();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request, url = new URL(request.url);
  if (!enabled || request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/") || ["/sw.js", "/offline-manifest.json"].includes(url.pathname)) return;
  const pathname = url.pathname.replace(/\/$/, "") || "/";
  const route = manifest.routes[pathname];
  const image = url.pathname === "/_next/image" ? new URL(url.searchParams.get("url") || "/", self.location.origin) : null;
  const asset = manifest.resources.find(item => item.key === url.pathname);
  if (!route && !asset && !image && request.mode !== "navigate") return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    let key = url.pathname;
    if (image) {
      if (image.origin !== self.location.origin || !manifest.resources.some(item => item.type === "asset" && item.key === image.pathname)) return fetch(request);
      key = image.pathname;
    } else if (route) {
      key = pathname;
      if (request.headers.get("RSC") === "1") {
        const segment = request.headers.get("Next-Router-Segment-Prefetch");
        key = segment ? route.segments[segment] || route.rsc : route.rsc;
      }
    }
    const saved = await cache.match(key);
    if (saved) return saved;
    try { return await fetch(request); }
    catch {
      if (request.mode === "navigate") return await cache.match("/offline.html") || new Response("This page isn't saved on your device yet. Connect to the internet and turn on Offline Mode again.", { headers: { "content-type": "text/plain" }, status: 503 });
      return new Response("Offline resource unavailable", { status: 503 });
    }
  })());
});

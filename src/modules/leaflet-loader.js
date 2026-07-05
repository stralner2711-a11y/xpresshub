let leafletLoadPromise = null;

export function ensureLeaflet() {
  if (globalThis.L) return Promise.resolve(globalThis.L);
  if (!leafletLoadPromise) {
    leafletLoadPromise = Promise.all([
      import('leaflet/dist/leaflet.css'),
      import('leaflet'),
    ]).then(([, mod]) => {
      const leaflet = mod.default || mod;
      globalThis.L = leaflet;
      return leaflet;
    });
  }
  return leafletLoadPromise;
}

globalThis.XpressIntraLeaflet = { ensureLeaflet };

import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { openDB } from 'idb';

declare let self: ServiceWorkerGlobalScope

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
cleanupOutdatedCaches()

// to allow work offline
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')))


// Background Sync for SOS requests
const dbPromise = openDB('sos-db', 1, {
  upgrade(db) {
    db.createObjectStore('sos-requests', { keyPath: 'id' });
  },
});

self.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-sos-requests') {
    event.waitUntil(syncSOSRequests());
  }
});

async function syncSOSRequests() {
  const db = await dbPromise;
  const allReqs = await db.getAll('sos-requests');
  
  return Promise.all(allReqs.map(async (req) => {
    try {
      // In a real app, you would fetch() to your API endpoint
      // For this demo, we'll just simulate a successful sync
      console.log('Syncing SOS request:', req);
      // const response = await fetch('/api/sos', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(req),
      // });

      // if (response.ok) {
        console.log('SOS request synced successfully:', req.id);
        await db.delete('sos-requests', req.id);
      // } else {
      //   console.error('Failed to sync SOS request:', req.id, response.statusText);
      // }
    } catch (error) {
      console.error('Error syncing SOS request:', error);
      // The request will remain in IndexedDB to be retried later.
    }
  }));
}

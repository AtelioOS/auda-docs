/* AUDA OS — service worker (PWA + notifications) */
const CACHE = 'auda-os-v1';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

/* Push desde el backend de producción (pagos, firmas, avances) */
self.addEventListener('push', e => {
  let data = { title: 'AUDA OS', body: 'Tienes una novedad en tu obra.' };
  try { if (e.data) data = Object.assign(data, e.data.json()); }
  catch (_) { if (e.data) data.body = e.data.text(); }
  e.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    data: data.url || './demo.html'
  }));
});

/* Tocar la notificación abre / enfoca la app */
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    for (const c of cs) { if ('focus' in c) return c.focus(); }
    if (clients.openWindow) return clients.openWindow(e.notification.data || './demo.html');
  }));
});

/* Notificación local (prueba desde la app, sin backend) */
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'demo-notif') {
    self.registration.showNotification(e.data.title || 'AUDA OS', {
      body: e.data.body || 'Notificación de prueba — ¡funciona! 🔔',
      icon: 'icon-192.png',
      badge: 'icon-192.png'
    });
  }
});

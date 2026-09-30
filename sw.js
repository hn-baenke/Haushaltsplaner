// sw.js - Service Worker für Push-Benachrichtigungen

self.addEventListener('push', function(event) {
  if (!event.data) return;

  const data = event.data.json();
  const title = data.title || 'Haushaltsplaner';
  const options = {
    body: data.body || 'Neues Update im Haushalt!',
    icon: 'favicon.ico',
    badge: 'favicon.ico',
    data: data.url || '/'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Beim Klick auf die Benachrichtigung die App öffnen
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
});
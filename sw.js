// sw.js - Service Worker für Push-Benachrichtigungen

self.addEventListener('push', function(event) {
  if (!event.data) return;

  const data = event.data.json();
  const title = data.title || 'Haushaltsplaner';
  
  // Fängt '/' ab und erzwingt die korrekte GitHub Pages URL mit Unterordner
  const targetUrl = data.url && data.url !== '/' 
    ? data.url 
    : 'https://hn-baenke.github.io/Haushaltsplaner/';

  const options = {
    body: data.body || 'Neues Update im Haushalt!',
    icon: 'favicon.ico',
    badge: 'favicon.ico',
    data: targetUrl // Speichert die absolute URL in den Benachrichtigungsdaten
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Beim Klick auf die Benachrichtigung die App öffnen oder vorhandenen Tab fokussieren
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const targetUrl = event.notification.data || 'https://hn-baenke.github.io/Haushaltsplaner/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // Prüfen, ob die App schon offen ist -> Tab in den Vordergrund holen
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes('Haushaltsplaner') && 'focus' in client) {
          return client.focus();
        }
      }
      // Ansonsten neuen Tab mit der exakten URL öffnen
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
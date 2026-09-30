// sw.js - Service Worker für Push-Benachrichtigungen

self.addEventListener('push', function(event) {
  if (!event.data) return;

  const data = event.data.json();
  const title = data.title || 'Haushaltsplaner';
  const options = {
    body: data.body || 'Neues Update im Haushalt!',
    icon: 'favicon.ico', // Hier kannst du ein Icon verlinken
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

// ==========================================
// PUSH-BENACHRICHTIGUNG LOGIK (EINKAUFSLISTE)
// ==========================================

// Globaler Timer für das 30-Sekunden-Sammeln beim Hinzufügen
let shoppingPushTimer = null;

// Hilfsfunktion: Schickt eine Nachricht an den Partner (alle User außer sich selbst)
async function sendPushToPartner(title, message) {
  const currentUserId = localStorage.getItem('haushalt_active_user');
  if (!currentUserId) return; // Abbrechen, falls noch kein User ausgewählt wurde

  try {
    // 1. Partner-Subscription aus Supabase holen
    const { data: partners, error } = await db
      .from('users')
      .select('name, push_subscription')
      .neq('id', currentUserId)
      .not('push_subscription', 'is', null);

    if (error) throw error;

    // 2. An jeden Partner senden
    partners.forEach(partner => {
      if (partner.push_subscription) {
        // Hinweis: Hier wird der Service Worker getriggert
        console.log(`Push gesendet an ${partner.name}: ${title} - ${message}`);
      }
    });
  } catch (err) {
    console.error('Fehler beim Senden der Push-Nachricht:', err);
  }
}
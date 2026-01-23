// Service Worker para Web Push Notifications
// Este arquivo precisa estar na raiz do public para funcionar

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalado');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Ativado');
  event.waitUntil(self.clients.claim());
});

// Escutar notificações push
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push recebido');

  let notification = {
    title: 'Orion ERP',
    body: 'Nova notificação',
    icon: '/logo.png',
    badge: '/logo-badge.png',
    data: {},
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notification = {
        title: data.title || notification.title,
        body: data.message || data.body || notification.body,
        icon: data.icon || notification.icon,
        badge: data.badge || notification.badge,
        data: data.data || {},
      };
    } catch (error) {
      console.error('[Service Worker] Erro ao parsear dados push:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notification.title, {
      body: notification.body,
      icon: notification.icon,
      badge: notification.badge,
      data: notification.data,
      tag: notification.data.tag || 'orion-notification',
      requireInteraction: false,
    })
  );
});

// Lidar com cliques na notificação
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notificação clicada');
  event.notification.close();

  const urlToOpen = event.notification.data?.link || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Se já existe uma janela aberta, focar nela
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      // Caso contrário, abrir nova janela
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

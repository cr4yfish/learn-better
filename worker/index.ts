/* eslint-disable @typescript-eslint/no-explicit-any */

self.addEventListener('push', function(event: any) {
    const data = (event).data.json();
    const options = {
      body: data.body,
      icon: '/icon.png',
      badge: '/badge.png'
    };
    event.waitUntil(
      (self as any).registration.showNotification(data.title, options)
    );
  });
// Register before Firebase installs its own click listener, to avoid opening twice.
self.addEventListener('notificationclick', (event) => {
  event.stopImmediatePropagation();
  event.notification.close();
  const data = event.notification.data || {};
  const rawUrl = data.url || data.FCM_MSG?.data?.url || '/map';
  let target;
  try {
    target = new URL(rawUrl, self.location.origin);
    if (target.origin !== self.location.origin || !/^https?:$/.test(target.protocol)) throw new Error('External URL');
  } catch { target = new URL('/map', self.location.origin); }
  event.waitUntil((async () => {
    const windows = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    const exact = windows.find(client => client.url === target.href);
    if (exact) return exact.focus();
    const existing = windows.find(client => new URL(client.url).origin === self.location.origin);
    if (existing && 'navigate' in existing) {
      const navigated = await existing.navigate(target.href);
      if (navigated) return navigated.focus();
    }
    return clients.openWindow(target.href);
  })());
});

importScripts('https://www.gstatic.com/firebasejs/12.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.10.0/firebase-messaging-compat.js');

const params = new URL(location).searchParams;
const firebaseConfig = {
  apiKey: params.get('apiKey'),
  projectId: params.get('projectId'),
  messagingSenderId: params.get('messagingSenderId'),
  appId: params.get('appId'),
};
if (firebaseConfig.apiKey) {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    // Firebase already displays notification payloads. Only data-only payloads
    // need manual display; otherwise users receive duplicate notifications.
    if (payload.notification) return;
    return self.registration.showNotification(payload.data?.title || 'Huddle', {
      body: payload.data?.body || 'You have an event update.',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      data: payload.data,
    });
  });
}

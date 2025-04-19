self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};

  const title = data.title || "🏡 New Notification from Easy Homes";
  const options = {
    body: data.body || "You have a new update from Easy Homes.",
    icon: "/homes.jpg",
    vibrate: [200, 100, 300],
    badge: "/homes.jpg",
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});

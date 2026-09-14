import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { AUTH_TOKEN_KEY } from './app/core/auth';

async function clearBrowserCaches(): Promise<void> {
  if ('caches' in window) {
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys.map((key) => caches.delete(key)));
  }

  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }

  sessionStorage.clear();

  Object.keys(localStorage)
    .filter((key) => key !== AUTH_TOKEN_KEY)
    .forEach((key) => localStorage.removeItem(key));
}

clearBrowserCaches()
  .catch((err) => console.error('Failed to clear browser caches', err))
  .finally(() => {
    bootstrapApplication(App, appConfig).catch((err) => console.error(err));
  });

'use client';

import { useEffect } from 'react';

export default function PwaRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('PWA Service Worker registered successfully:', registration.scope);
          },
          (err) => {
            console.error('PWA Service Worker registration failed:', err);
          }
        );
      });
    }
  }, []);

  return null;
}

"use client";

import { useEffect } from 'react';

const PushNotification = () => {
  useEffect(() => {
    if ('Notification' in window && navigator.serviceWorker) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        } else {
          console.log('Notification permission denied.');
        }
      });
    }
  }, []);

  return null;
};

export default PushNotification;
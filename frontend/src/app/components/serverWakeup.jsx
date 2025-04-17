// app/components/ServerWakeup.jsx
"use client";

import { useEffect, useState } from 'react';

export default function ServerWakeup() {
  useEffect(() => {
    const wakeServer = async () => {
      try {
        // Replace with your backend URL
        const response = await fetch('https://youtube-clone-4fmc.onrender.com');
        console.log('Server wake-up attempt:', response.ok ? 'successful' : 'failed');
      } catch (error) {
        console.error('Error waking server:', error);
      }
    };

    wakeServer();
  }, []);

  return null; // This component doesn't render anything
}
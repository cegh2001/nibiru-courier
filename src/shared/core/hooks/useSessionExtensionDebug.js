"use client";
import { useState, useEffect } from 'react';
import { SESSION_CONFIG } from '@/core/config/sessionConfig';

export const useSessionExtensionDebug = () => {
  const [debugInfo, setDebugInfo] = useState({
    isLeader: false,
    nextExtensionTime: null,
    timeUntilNext: null,
    backendExpires: null,
    lastHeartbeat: null,
  });

  useEffect(() => {
    const updateDebugInfo = () => {
      const nextExtensionTime = localStorage.getItem(SESSION_CONFIG.STORAGE_KEYS.NEXT_EXTENSION_TIME);
      const sessionLeader = localStorage.getItem(SESSION_CONFIG.STORAGE_KEYS.SESSION_LEADER);
      const leaderTab = localStorage.getItem(SESSION_CONFIG.STORAGE_KEYS.LEADER_TAB);
      const backendExpires = localStorage.getItem(SESSION_CONFIG.STORAGE_KEYS.BACKEND_TOKEN_EXPIRES);
      
      const now = Date.now();
      const isCurrentTabLeader = leaderTab && leaderTab !== 'unknown' && leaderTab.startsWith('tab_');
      const lastHeartbeat = sessionLeader ? now - parseInt(sessionLeader) : null;
      
      setDebugInfo({
        isLeader: isCurrentTabLeader,
        nextExtensionTime: nextExtensionTime ? new Date(parseInt(nextExtensionTime)).toLocaleTimeString() : null,
        timeUntilNext: nextExtensionTime ? Math.max(0, parseInt(nextExtensionTime) - now) : null,
        backendExpires: backendExpires ? new Date(backendExpires).toLocaleTimeString() : null,
        lastHeartbeat: lastHeartbeat,
        tabId: leaderTab,
      });
    };

    // Actualizar inmediatamente
    updateDebugInfo();

    // Actualizar cada segundo
    const interval = setInterval(updateDebugInfo, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (milliseconds) => {
    if (!milliseconds) return 'N/A';
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    ...debugInfo,
    timeUntilNextFormatted: formatTime(debugInfo.timeUntilNext),
    isLeaderHealthy: debugInfo.lastHeartbeat !== null && debugInfo.lastHeartbeat < SESSION_CONFIG.LEADER_TIMEOUT,
  };
};

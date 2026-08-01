"use client";
import { useSessionExtensionDebug } from '@/core/hooks/useSessionExtensionDebug';

export const SessionExtensionDebugPanel = ({deactivate}) => {
  const debug = useSessionExtensionDebug();

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development' || deactivate) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50 max-w-sm">
      <div className="font-bold mb-2">🔧 Session Extension Debug</div>
      
      <div className={`flex items-center gap-2 mb-1 ${debug.isLeader ? 'text-green-400' : 'text-gray-400'}`}>
        <span>{debug.isLeader ? '👑' : '👤'}</span>
        <span>{debug.isLeader ? 'LÍDER' : 'Seguidor'}</span>
        {debug.isLeaderHealthy && <span className="text-green-400">✅</span>}
      </div>
      
      <div className="space-y-1 text-xs">
        <div>
          <span className="text-gray-300">Tab ID:</span>
          <span className="ml-1">{debug.tabId || 'N/A'}</span>
        </div>
        
        <div>
          <span className="text-gray-300">Próxima extensión:</span>
          <span className="ml-1">{debug.timeUntilNextFormatted}</span>
        </div>
        
        <div>
          <span className="text-gray-300">Hora programada:</span>
          <span className="ml-1">{debug.nextExtensionTime || 'N/A'}</span>
        </div>
        
        <div>
          <span className="text-gray-300">Backend expira:</span>
          <span className="ml-1">{debug.backendExpires || 'N/A'}</span>
        </div>
        
        <div>
          <span className="text-gray-300">Último heartbeat:</span>
          <span className="ml-1">{debug.lastHeartbeat ? `${Math.round(debug.lastHeartbeat / 1000)}s` : 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

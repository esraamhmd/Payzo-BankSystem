'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode, ElementType } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon      from '@mui/icons-material/CancelRounded';
import InfoIcon               from '@mui/icons-material/Info';
import WarningRoundedIcon     from '@mui/icons-material/WarningRounded';
import CloseRoundedIcon       from '@mui/icons-material/CloseRounded';

type Sev = 'success' | 'error' | 'info' | 'warning';
interface ToastMsg { id: number; message: string; severity: Sev; }
interface ToastCtx { showToast: (message: string, severity?: Sev) => void; }

const Ctx = createContext<ToastCtx>({ showToast: () => {} });
export const useToast = () => useContext(Ctx);

const CFG: Record<Sev, { bg: string; border: string; iconColor: string; Icon: ElementType }> = {
  success: { bg: '#f0fdf4', border: '#22c55e', iconColor: '#16a34a', Icon: CheckCircleRoundedIcon },
  error:   { bg: '#fff1f2', border: '#ef4444', iconColor: '#dc2626', Icon: CancelRoundedIcon      },
  info:    { bg: '#eff6ff', border: '#3b82f6', iconColor: '#2563eb', Icon: InfoIcon               },
  warning: { bg: '#fffbeb', border: '#f59e0b', iconColor: '#d97706', Icon: WarningRoundedIcon     },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  const showToast = useCallback((message: string, severity: Sev = 'success') => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, severity }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4500);
  }, []);

  const close = (id: number) => setToasts((p) => p.filter((t) => t.id !== id));

  return (
    
    <Ctx.Provider value={{ showToast }}>
      {children}
      <Box sx={{
        position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
        zIndex: 99999, display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 1.5, pointerEvents: 'none',
        width: '100%', maxWidth: 440, px: 2,
      }}>
        {toasts.map((t) => {
          const { bg, border, iconColor, Icon } = CFG[t.severity];
          return (
            <Box key={t.id} sx={{
              pointerEvents: 'all', width: '100%',
              display: 'flex', alignItems: 'center', gap: 1.5,
              p: '13px 16px', bgcolor: bg,
              border: `1px solid ${border}40`,
              borderLeft: `4px solid ${border}`,
              borderRadius: '14px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
              animation: 'toastIn 0.38s cubic-bezier(0.34,1.56,0.64,1)',
              '@keyframes toastIn': {
                from: { opacity: 0, transform: 'translateY(-28px) scale(0.9)' },
                to:   { opacity: 1, transform: 'translateY(0) scale(1)' },
              },
            }}>
              <Icon sx={{ fontSize: 21, color: iconColor, flexShrink: 0 }} />
              <Typography sx={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#111827', lineHeight: 1.5 }}>
                {t.message}
              </Typography>
              <IconButton size="small" onClick={() => close(t.id)}
                sx={{ p: 0.4, color: '#9ca3af', borderRadius: '8px', '&:hover': { color: '#374151', bgcolor: 'rgba(0,0,0,0.07)' } }}>
                <CloseRoundedIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Box>
          );
        })}
      </Box>
    </Ctx.Provider>
  );
}
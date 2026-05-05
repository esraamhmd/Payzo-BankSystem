'use client';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Avatar, Drawer, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Divider, useMediaQuery, useTheme } from '@mui/material';
import MenuRoundedIcon             from '@mui/icons-material/MenuRounded';
import AccountBalanceIcon          from '@mui/icons-material/AccountBalance';
import DashboardRoundedIcon        from '@mui/icons-material/DashboardRounded';
import SendRoundedIcon             from '@mui/icons-material/SendRounded';
import ReceiptLongRoundedIcon      from '@mui/icons-material/ReceiptLongRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import LogoutRoundedIcon           from '@mui/icons-material/LogoutRounded';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useLogout } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import Sidebar from './Sidebar';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':    'Dashboard',
  '/transfer':     'Transfer & Payments',
  '/transactions': 'Transaction History',
  '/admin':        'Admin Panel',
};

const NAV = [
  { label: 'Dashboard',    href: '/dashboard',    icon: <DashboardRoundedIcon     sx={{ fontSize: 21 }} /> },
  { label: 'Transfer',     href: '/transfer',     icon: <SendRoundedIcon          sx={{ fontSize: 21 }} /> },
  { label: 'Transactions', href: '/transactions', icon: <ReceiptLongRoundedIcon   sx={{ fontSize: 21 }} /> },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const theme     = useTheme();
  const isMobile  = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname  = usePathname();
  const router    = useRouter();
  const user      = useAppSelector((s) => s.auth.user);
  const { mutate: logout } = useLogout();
  const { showToast } = useToast();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#EEF4E8' }}>
      {!isMobile && <Sidebar />}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)}
          sx={{ '& .MuiDrawer-paper': { width: 260, background: 'linear-gradient(180deg,#031e0a,#043915 50%,#0a4d20 100%)' } }}>
          <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AccountBalanceIcon sx={{ color: '#9AD872', fontSize: 24 }} />
            <Typography fontWeight={800} sx={{ color: 'white', letterSpacing: 2.5, fontSize: 17 }}>PAYZO</Typography>
          </Box>
          <Divider sx={{ borderColor: 'rgba(154,216,114,0.15)' }} />
          <List sx={{ px: 1.5, pt: 1.5 }}>
            {NAV.map((item) => (
              <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton onClick={() => { router.push(item.href); setMobileOpen(false); }}
                  sx={{ borderRadius: 2.5, bgcolor: pathname === item.href ? 'rgba(154,216,114,0.18)' : 'transparent', '&:hover': { bgcolor: 'rgba(154,216,114,0.1)' } }}>
                  <ListItemIcon sx={{ color: pathname === item.href ? '#9AD872' : 'rgba(255,255,255,0.5)', minWidth: 38 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label}
                    slotProps={{ primary: { color: pathname === item.href ? 'white' : 'rgba(255,255,255,0.65)', fontWeight: pathname === item.href ? 700 : 500, fontSize: 14.5 } }} />
                </ListItemButton>
              </ListItem>
            ))}
            {user?.role === 'admin' && (
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton onClick={() => { router.push('/admin'); setMobileOpen(false); }}
                  sx={{ borderRadius: 2.5, '&:hover': { bgcolor: 'rgba(154,216,114,0.1)' } }}>
                  <ListItemIcon sx={{ color: 'rgba(255,255,255,0.5)', minWidth: 38 }}>
                    <AdminPanelSettingsRoundedIcon sx={{ fontSize: 21 }} />
                  </ListItemIcon>
                  <ListItemText primary="Admin" slotProps={{ primary: { color: 'rgba(255,255,255,0.65)', fontSize: 14.5 } }} />
                </ListItemButton>
              </ListItem>
            )}
          </List>
          <Divider sx={{ borderColor: 'rgba(154,216,114,0.12)', mt: 'auto' }} />
          <List sx={{ px: 1.5, pb: 2 }}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => logout()}
                sx={{ borderRadius: 2.5, '&:hover': { bgcolor: 'rgba(239,68,68,0.12)' } }}>
                <ListItemIcon sx={{ color: 'rgba(252,129,129,0.7)', minWidth: 38 }}>
                  <LogoutRoundedIcon sx={{ fontSize: 21 }} />
                </ListItemIcon>
                <ListItemText primary="Logout" slotProps={{ primary: { color: 'rgba(252,129,129,0.7)', fontSize: 14.5 } }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
      )}

      {/* Main */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <AppBar position="static" elevation={0}
          sx={{ bgcolor: 'white', borderBottom: '1px solid rgba(176,206,136,0.25)', color: '#0D2414' }}>
          <Toolbar sx={{ minHeight: '64px !important', px: { xs: 2, sm: 3 } }}>
            {isMobile && (
              <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 1.5, color: '#4C763B' }}>
                <MenuRoundedIcon sx={{ fontSize: 26 }} />
              </IconButton>
            )}
            <Typography variant="h5" fontWeight={700} color="#0D2414"
              sx={{ flexGrow: 1, fontSize: { xs: 17, sm: 20, md: 22 } }}>
              {PAGE_TITLES[pathname] || 'Payzo'}
            </Typography>
            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Typography variant="body2" fontWeight={700} color="#0D2414" fontSize={14}>{user.name}</Typography>
                  <Typography variant="caption" color="text.secondary" fontSize={12} sx={{ fontFamily: 'monospace' }}>
                    {user.accountNumber}
                  </Typography>
                </Box>
                <Avatar sx={{ width: 36, height: 36, bgcolor: '#9AD872', color: '#043915', fontWeight: 800, fontSize: 15 }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              </Box>
            )}
          </Toolbar>
        </AppBar>
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: { xs: 2, sm: 3, lg: 4 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
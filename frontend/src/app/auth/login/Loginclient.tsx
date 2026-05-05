'use client';
import { useState } from 'react';
import { Box, Typography, TextField, Button, InputAdornment, IconButton,
  Alert, Divider, CircularProgress } from '@mui/material';
import VisibilityIcon          from '@mui/icons-material/Visibility';
import VisibilityOffIcon       from '@mui/icons-material/VisibilityOff';
import AccountBalanceIcon      from '@mui/icons-material/AccountBalance';
import EmailIcon               from '@mui/icons-material/Email';
import LockIcon                from '@mui/icons-material/Lock';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import SecurityIcon            from '@mui/icons-material/Security';
import FlashOnIcon             from '@mui/icons-material/FlashOn';
import BarChartIcon            from '@mui/icons-material/BarChart';
import AccessTimeIcon          from '@mui/icons-material/AccessTime';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { useLogin } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import type { LoginFormValues } from '@/lib/validation';

const features = [
  { Icon: SecurityIcon,   label: 'Bank-grade security', color: '#86efac' },
  { Icon: FlashOnIcon,    label: 'Instant transfers',   color: '#fde68a' },
  { Icon: BarChartIcon,   label: 'Smart analytics',     color: '#a5f3fc' },
  { Icon: AccessTimeIcon, label: 'Available 24/7',      color: '#c4b5fd' },
];

export default function LoginClient() {
  const [showPw, setShowPw] = useState(false);
  const { mutate: login, isPending, error } = useLogin();
  const { showToast } = useToast();

  const { register, handleSubmit, setError, formState: { errors } } =
    useForm<LoginFormValues>({ defaultValues: { email: '', password: '' } });


  const errMsg = (error as any)?.response?.data?.message || error?.message;


  const onSubmit = (v: LoginFormValues) => {
    let bad = false;
    if (!v.email.trim())    { setError('email',    { message: 'Email is required' });    bad = true; }
    if (!v.password.trim()) { setError('password', { message: 'Password is required' }); bad = true; }
    if (bad) return;
    login(
      { email: v.email.toLowerCase().trim(), password: v.password },
      { onSuccess: (d) => showToast(d.message, 'success') }
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#EEF4E8' }}>

  
      <Box sx={{ display: { xs: 'none', md: 'flex' }, width: '52%', position: 'relative',
        overflow: 'hidden', flexDirection: 'column', justifyContent: 'flex-end', p: { md: 5, lg: 7 } }}>
        <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'url(/bank-2.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <Box sx={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(170deg,rgba(2,26,9,0.96) 0%,rgba(4,57,21,0.90) 42%,rgba(60,110,42,0.72) 75%,rgba(154,216,114,0.22) 100%)' }} />
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 5 }}>
            <Box sx={{ width: 46, height: 46, borderRadius: '13px', bgcolor: 'rgba(154,216,114,0.22)',
              border: '2px solid rgba(154,216,114,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AccountBalanceIcon sx={{ color: '#9AD872', fontSize: 25 }} />
            </Box>
            <Typography fontWeight={800} sx={{ color: '#ffffff', fontSize: 21, letterSpacing: 3 }}>PAYZO</Typography>
          </Box>
          <Typography sx={{ color: '#9AD872', fontWeight: 700, fontSize: 12.5,
            letterSpacing: 2.5, textTransform: 'uppercase', mb: 2 }}>
            Smart Banking Platform
          </Typography>
          <Typography variant="h2" fontWeight={800} sx={{ color: '#ffffff', lineHeight: 1.1,
            mb: 2.5, fontSize: { md: '2.5rem', lg: '3rem' } }}>
            Banking made<br />simple, secure<br />&amp; smart
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.78)', mb: 5, fontSize: 15.5, lineHeight: 1.8, maxWidth: 400 }}>
            Manage your finances, send money instantly, and track every transaction — all from one beautiful platform.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {features.map(({ Icon, label, color }) => (
              <Box key={label} sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                px: 2.25, py: 1.1, borderRadius: '22px',
                bgcolor: 'rgba(0,0,0,0.42)', border: `1.5px solid ${color}55`,
                cursor: 'default', transition: 'all 0.22s ease',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.60)', border: `1.5px solid ${color}cc`, transform: 'translateY(-2px)' },
              }}>
                <Icon sx={{ fontSize: 18, color }} />
                <Typography sx={{ color: '#ffffff', fontSize: 13.5, fontWeight: 600 }}>{label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      
      <Box sx={{ width: { xs: '100%', md: '48%' }, display: 'flex', alignItems: 'center',
        justifyContent: 'center', p: { xs: 3, sm: 5, lg: 7 }, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: -100, right: -100, width: 340, height: 340,
          borderRadius: '50%', bgcolor: 'rgba(154,216,114,0.07)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -80, left: -80, width: 260, height: 260,
          borderRadius: '50%', bgcolor: 'rgba(76,118,59,0.05)', pointerEvents: 'none' }} />

        <Box sx={{ width: '100%', maxWidth: 430, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '11px',
              background: 'linear-gradient(135deg,#043915,#4C763B)',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AccountBalanceIcon sx={{ color: '#9AD872', fontSize: 21 }} />
            </Box>
            <Typography fontWeight={800} fontSize={20} color="#0D2414" letterSpacing={1.5}>PAYZO</Typography>
          </Box>

          <Typography variant="h3" fontWeight={800} color="#0D2414" mb={0.75}
            sx={{ fontSize: { xs: '2rem', sm: '2.3rem' } }}>
            Welcome back
          </Typography>
          <Typography color="text.secondary" mb={4} fontSize={16.5}>
            Sign in to your Payzo account
          </Typography>

          {errMsg && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5, fontSize: 14, fontWeight: 500 }}>
              {errMsg}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Email Address" type="email" fullWidth autoFocus
              slotProps={{
                htmlInput: { style: { fontSize: 15.5 } },
                inputLabel: { style: { fontSize: 15 } },
                input: { startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: '#4C763B', fontSize: 22 }} /></InputAdornment> },
              }}
              error={!!errors.email} helperText={errors.email?.message}
              {...register('email')} />

            <TextField
              label="Password" type={showPw ? 'text' : 'password'} fullWidth
              slotProps={{
                htmlInput: { style: { fontSize: 15.5 } },
                inputLabel: { style: { fontSize: 15 } },
                input: {
                  startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: '#4C763B', fontSize: 22 }} /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPw((v) => !v)} edge="end">
                        {showPw
                          ? <VisibilityOffIcon sx={{ fontSize: 21, color: '#6b7280' }} />
                          : <VisibilityIcon   sx={{ fontSize: 21, color: '#6b7280' }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              error={!!errors.password} helperText={errors.password?.message}
              {...register('password')} />

            <Button type="submit" fullWidth variant="contained" size="large" disabled={isPending}
              endIcon={isPending ? <CircularProgress size={19} color="inherit" /> : <ArrowForwardRoundedIcon />}
              sx={{ mt: 0.5, py: 1.85, fontSize: 17, borderRadius: 2.5, letterSpacing: 0.3 }}>
              {isPending ? 'Signing in...' : 'Sign In'}
            </Button>

            <Divider>
              <Typography variant="caption" color="text.secondary" sx={{ px: 1.5, fontSize: 13 }}>
                New to Payzo?
              </Typography>
            </Divider>

            <Button component={NextLink} href="/auth/register" fullWidth variant="outlined" size="large"
              sx={{ py: 1.75, fontSize: 16, borderRadius: 2.5 }}>
              Create Free Account
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
'use client';
import { useState } from 'react';
import { Box, Typography, TextField, Button, InputAdornment, IconButton,
  Alert, Divider, CircularProgress } from '@mui/material';
import VisibilityIcon          from '@mui/icons-material/Visibility';
import VisibilityOffIcon       from '@mui/icons-material/VisibilityOff';
import AccountBalanceIcon      from '@mui/icons-material/AccountBalance';
import EmailIcon               from '@mui/icons-material/Email';
import LockIcon                from '@mui/icons-material/Lock';
import PersonIcon              from '@mui/icons-material/Person';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MonetizationOnIcon       from '@mui/icons-material/MonetizationOn';
import BoltIcon                 from '@mui/icons-material/Bolt';
import InsightsIcon             from '@mui/icons-material/Insights';
import ShieldIcon               from '@mui/icons-material/Shield';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { useRegister } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import type { RegisterFormValues } from '@/lib/validation';

const perks = [
  { Icon: AccountBalanceWalletIcon, text: 'Free account — no monthly fees ever', color: '#9AD872' },
  { Icon: MonetizationOnIcon,       text: 'Start with $5,000 demo balance',      color: '#fde68a' },
  { Icon: BoltIcon,                 text: 'Send money in under 3 seconds',        color: '#a5f3fc' },
  { Icon: InsightsIcon,             text: 'Live charts & spending insights',      color: '#c4b5fd' },
  { Icon: ShieldIcon,               text: 'Bank-grade encryption always on',      color: '#86efac' },
];

export default function RegisterClient() {
  const [showPw, setShowPw] = useState(false);
  const { mutate: reg, isPending, error } = useRegister();
  const { showToast } = useToast();

  const { register, handleSubmit, setError, formState: { errors } } =
    useForm<RegisterFormValues>({ defaultValues: { name: '', email: '', password: '' } });

  
  const errMsg = (error as any)?.response?.data?.message || error?.message;

  
  const onSubmit = (v: RegisterFormValues) => {
    let bad = false;
    if (!v.name.trim())     { setError('name',     { message: 'Name is required' });     bad = true; }
    if (!v.email.trim())    { setError('email',    { message: 'Email is required' });    bad = true; }
    if (!v.password.trim()) { setError('password', { message: 'Password is required' }); bad = true; }
    if (bad) return;
    reg(
      { name: v.name.trim(), email: v.email.toLowerCase().trim(), password: v.password },
      { onSuccess: (d) => showToast(d.message, 'success') }
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#EEF4E8' }}>

    
      <Box sx={{ width: { xs: '100%', md: '48%' }, display: 'flex', alignItems: 'center',
        justifyContent: 'center', p: { xs: 3, sm: 5, lg: 7 }, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', bottom: -100, right: -100, width: 320, height: 320,
          borderRadius: '50%', bgcolor: 'rgba(154,216,114,0.07)', pointerEvents: 'none' }} />

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
            Open your account
          </Typography>
          <Typography color="text.secondary" mb={4} fontSize={16.5}>
            Join thousands managing money smarter
          </Typography>

          {errMsg && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5, fontSize: 14, fontWeight: 500 }}>
              {errMsg}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

            <TextField
              label="Full Name" fullWidth autoFocus
              slotProps={{
                htmlInput: { style: { fontSize: 15.5 } },
                inputLabel: { style: { fontSize: 15 } },
                input: { startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#4C763B', fontSize: 22 }} /></InputAdornment> },
              }}
              error={!!errors.name} helperText={errors.name?.message}
              {...register('name')} />

            <TextField
              label="Email Address" type="email" fullWidth
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
              error={!!errors.password}
              helperText={errors.password?.message || 'Min 8 chars · 1 uppercase · 1 number'}
              {...register('password')} />

            <Button type="submit" fullWidth variant="contained" size="large" disabled={isPending}
              endIcon={isPending ? <CircularProgress size={19} color="inherit" /> : <ArrowForwardRoundedIcon />}
              sx={{ mt: 0.5, py: 1.85, fontSize: 17, borderRadius: 2.5 }}>
              {isPending ? 'Creating Account...' : 'Create Free Account'}
            </Button>

            <Divider>
              <Typography variant="caption" color="text.secondary" sx={{ px: 1.5, fontSize: 13 }}>
                Already a member?
              </Typography>
            </Divider>

            <Button component={NextLink} href="/auth/login" fullWidth variant="outlined" size="large"
              sx={{ py: 1.75, fontSize: 16, borderRadius: 2.5 }}>
              Sign In Instead
            </Button>
          </Box>
        </Box>
      </Box>

   
      <Box sx={{ display: { xs: 'none', md: 'flex' }, width: '52%', position: 'relative',
        overflow: 'hidden', flexDirection: 'column', justifyContent: 'flex-end', p: { md: 5, lg: 7 } }}>
        <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'url(/bank.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <Box sx={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(165deg,rgba(2,30,10,0.95) 0%,rgba(4,57,21,0.88) 40%,rgba(70,132,50,0.65) 75%,rgba(154,216,114,0.25) 100%)' }} />
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
            <Box sx={{ width: 46, height: 46, borderRadius: '13px', bgcolor: 'rgba(154,216,114,0.18)',
              border: '1.5px solid rgba(154,216,114,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AccountBalanceIcon sx={{ color: '#9AD872', fontSize: 25 }} />
            </Box>
            <Typography fontWeight={800} sx={{ color: 'white', fontSize: 21, letterSpacing: 3 }}>PAYZO</Typography>
          </Box>
          <Typography variant="h3" fontWeight={800} sx={{ color: 'white', mb: 1.5, lineHeight: 1.1 }}>
            Everything you need,<br />nothing you don't
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.68)', mb: 4, fontSize: 15.5 }}>
            Join Payzo and take full control of your finances
          </Typography>
          {perks.map(({ Icon, text, color }) => (
            <Box key={text} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.25 }}>
              <Box sx={{ width: 38, height: 38, borderRadius: '50%',
                bgcolor: 'rgba(0,0,0,0.35)', border: `1px solid ${color}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon sx={{ fontSize: 20, color }} />
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.88)', fontWeight: 500, fontSize: 15 }}>
                {text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
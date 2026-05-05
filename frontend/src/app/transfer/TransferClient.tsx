'use client';
import { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, TextField, Button, Alert,
  InputAdornment, CircularProgress, Avatar } from '@mui/material';
import SendRoundedIcon                 from '@mui/icons-material/SendRounded';
import AddCircleRoundedIcon            from '@mui/icons-material/AddCircleRounded';
import RemoveCircleRoundedIcon         from '@mui/icons-material/RemoveCircleRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ContentCopyRoundedIcon          from '@mui/icons-material/ContentCopyRounded';
import AttachMoneyIcon                 from '@mui/icons-material/AttachMoney';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useAuth';
import { useTransfer, useDeposit, useWithdraw, useSummary } from '@/hooks/useTransactions';
import { useToast } from '@/components/ui/Toast';
import AppLayout from '@/components/layout/AppLayout';

interface TransferForm { receiverAccountNumber: string; amount: string; description: string; }
interface DepositForm  { amount: string; }
interface WithdrawForm { amount: string; }

export default function TransferClient() {
  const router = useRouter();
  const { showToast } = useToast();
  const { isLoading: aL, isError: aE, data: user } = useCurrentUser();
  const { data: summary } = useSummary();

  const { mutate: transfer, isPending: tP } = useTransfer();
  const { mutate: deposit,  isPending: dP } = useDeposit();
  const { mutate: withdraw, isPending: wP } = useWithdraw();

  const [tErr, setTErr] = useState('');
  const [dErr, setDErr] = useState('');
  const [wErr, setWErr] = useState('');

  const tF = useForm<TransferForm>({ defaultValues: { receiverAccountNumber: '', amount: '', description: '' } });
  const dF = useForm<DepositForm>({  defaultValues: { amount: '' } });
  const wF = useForm<WithdrawForm>({ defaultValues: { amount: '' } });

  useEffect(() => { if (!aL && aE) router.push('/auth/login'); }, [aL, aE, router]);
  if (aL || aE || !user) return null;

  const copyAcct = () => {
    navigator.clipboard.writeText(summary?.accountNumber || '');
    showToast('Account number copied!', 'info');
  };

  const onTransfer = (v: TransferForm) => {
    setTErr('');
    if (!v.receiverAccountNumber.trim()) { tF.setError('receiverAccountNumber', { message: 'Account number is required' }); return; }
    const amt = parseFloat(v.amount);
    if (!v.amount || isNaN(amt)) { tF.setError('amount', { message: 'Please enter a valid amount' }); return; }
    if (amt < 1)      { tF.setError('amount', { message: 'Minimum transfer is $1' }); return; }
    if (amt > 100000) { tF.setError('amount', { message: 'Maximum transfer is $100,000' }); return; }
    transfer(
      { receiverAccountNumber: v.receiverAccountNumber.trim(), amount: amt, description: v.description || undefined },
      {
        onSuccess: (d) => { showToast(d.message, 'success'); tF.reset(); setTErr(''); },
        onError:   (e: any) => setTErr(e?.response?.data?.message || e?.message || 'Transfer failed'),
      }
    );
  };

  const onDeposit = (v: DepositForm) => {
    setDErr('');
    const amt = parseFloat(v.amount);
    if (!v.amount || isNaN(amt)) { dF.setError('amount', { message: 'Please enter a valid amount' }); return; }
    if (amt < 1)     { dF.setError('amount', { message: 'Minimum deposit is $1' }); return; }
    if (amt > 50000) { dF.setError('amount', { message: 'Maximum deposit is $50,000' }); return; }
    deposit(
      { amount: amt },
      {
        onSuccess: (d) => { showToast(d.message, 'success'); dF.reset(); setDErr(''); },
        onError:   (e: any) => setDErr(e?.response?.data?.message || e?.message || 'Deposit failed'),
      }
    );
  };

  const onWithdraw = (v: WithdrawForm) => {
    setWErr('');
    const amt = parseFloat(v.amount);
    if (!v.amount || isNaN(amt)) { wF.setError('amount', { message: 'Please enter a valid amount' }); return; }
    if (amt < 1)     { wF.setError('amount', { message: 'Minimum withdrawal is $1' }); return; }
    if (amt > 10000) { wF.setError('amount', { message: 'Maximum withdrawal is $10,000' }); return; }
    withdraw(
      { amount: amt },
      {
        onSuccess: (d) => { showToast(d.message, 'success'); wF.reset(); setWErr(''); },
        onError:   (e: any) => setWErr(e?.response?.data?.message || e?.message || 'Withdrawal failed'),
      }
    );
  };


  const amountSlot = (color: string) => ({
    slotProps: {
      input: {
        startAdornment: (
          <InputAdornment position="start">
            <AttachMoneyIcon sx={{ color, fontSize: 21 }} />
          </InputAdornment>
        ),
        inputProps: { min: 1, step: 0.01, style: { fontSize: 15 } },
      },
    },
  });

  return (
    <AppLayout>
     
      <Card sx={{ mb: 3.5, background: 'linear-gradient(135deg,#032b0f 0%,#043915 50%,#0a5228 100%)', position: 'relative', overflow: 'hidden' }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Box sx={{ width: 52, height: 52, borderRadius: 3, bgcolor: 'rgba(154,216,114,0.18)', border: '1.5px solid rgba(154,216,114,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AccountBalanceWalletRoundedIcon sx={{ color: '#9AD872', fontSize: 26 }} />
            </Box>
            <Box>
              <Typography sx={{ color: 'rgba(154,216,114,0.72)', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
                Current Balance
              </Typography>
              <Typography sx={{ color: 'white', fontWeight: 800, fontSize: { xs: 26, sm: 34 }, letterSpacing: -0.5 }}>
                ${summary?.balance.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '...'}
              </Typography>
            </Box>
          </Box>
          <Box onClick={copyAcct} sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', fontSize: 14 }}>
              Account: {summary?.accountNumber || '—'}
            </Typography>
            <ContentCopyRoundedIcon sx={{ fontSize: 15, color: '#9AD872', opacity: 0.7 }} />
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>

        {/* ── Send Money ── */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', '&:hover': { boxShadow: '0 8px 32px rgba(4,57,21,0.14)', transform: 'translateY(-2px)' }, transition: 'all 0.22s' }}>
            <Box sx={{ p: 3, background: 'linear-gradient(135deg,#4C763B,#468432)', borderRadius: '18px 18px 0 0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.3)' }}>
                  <SendRoundedIcon sx={{ fontSize: 23 }} />
                </Avatar>
                <Box>
                  <Typography fontWeight={700} sx={{ color: 'white', fontSize: 19 }}>Send Money</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: 13.5 }}>Transfer to any Payzo account</Typography>
                </Box>
              </Box>
            </Box>
            <CardContent sx={{ p: 3 }}>
              {tErr && <Alert severity="error" onClose={() => setTErr('')} sx={{ mb: 2.5, borderRadius: 2.5, fontSize: 14 }}>{tErr}</Alert>}
              <Box component="form" onSubmit={tF.handleSubmit(onTransfer)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Receiver Account Number" fullWidth placeholder="e.g. PZ-A3F2B1C4D5E6"
                  slotProps={{ htmlInput: { style: { fontSize: 15 } } }}
                  error={!!tF.formState.errors.receiverAccountNumber}
                  helperText={tF.formState.errors.receiverAccountNumber?.message}
                  {...tF.register('receiverAccountNumber')} />
                <TextField
                  label="Amount" type="number" fullWidth placeholder="0.00"
                  {...amountSlot('#9AD872')}
                  error={!!tF.formState.errors.amount}
                  helperText={tF.formState.errors.amount?.message}
                  {...tF.register('amount')} />
                <TextField
                  label="Note (optional)" fullWidth placeholder="e.g. Rent, Invoice #123"
                  slotProps={{ htmlInput: { style: { fontSize: 15 } } }}
                  {...tF.register('description')} />
                <Button type="submit" fullWidth variant="contained" size="large" disabled={tP}
                  startIcon={tP ? <CircularProgress size={18} color="inherit" /> : <SendRoundedIcon />}
                  sx={{ py: 1.6, fontSize: 16, borderRadius: 2.5 }}>
                  {tP ? 'Sending...' : 'Send Money'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Deposit ── */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', '&:hover': { boxShadow: '0 8px 32px rgba(37,99,235,0.14)', transform: 'translateY(-2px)' }, transition: 'all 0.22s' }}>
            <Box sx={{ p: 3, background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', borderRadius: '18px 18px 0 0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.3)' }}>
                  <AddCircleRoundedIcon sx={{ fontSize: 23 }} />
                </Avatar>
                <Box>
                  <Typography fontWeight={700} sx={{ color: 'white', fontSize: 19 }}>Deposit Money</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: 13.5 }}>Add funds to your account</Typography>
                </Box>
              </Box>
            </Box>
            <CardContent sx={{ p: 3 }}>
              {dErr && <Alert severity="error" onClose={() => setDErr('')} sx={{ mb: 2.5, borderRadius: 2.5, fontSize: 14 }}>{dErr}</Alert>}
              <Box component="form" onSubmit={dF.handleSubmit(onDeposit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Amount to Deposit" type="number" fullWidth placeholder="0.00"
                  {...amountSlot('#2563eb')}
                  error={!!dF.formState.errors.amount}
                  helperText={dF.formState.errors.amount?.message}
                  {...dF.register('amount')} />
                <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                  <Typography sx={{ color: '#2563eb', fontWeight: 500, fontSize: 14 }}>
                    Minimum $1 · Maximum $50,000 per deposit
                  </Typography>
                </Box>
                <Button type="submit" fullWidth variant="contained" size="large" disabled={dP}
                  startIcon={dP ? <CircularProgress size={18} color="inherit" /> : <AddCircleRoundedIcon />}
                  sx={{ py: 1.6, fontSize: 16, borderRadius: 2.5, background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', '&:hover': { background: 'linear-gradient(135deg,#1e40af,#1d4ed8)' } }}>
                  {dP ? 'Depositing...' : 'Deposit'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Withdraw ── */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', '&:hover': { boxShadow: '0 8px 32px rgba(234,88,12,0.14)', transform: 'translateY(-2px)' }, transition: 'all 0.22s' }}>
            <Box sx={{ p: 3, background: 'linear-gradient(135deg,#c2410c,#ea580c)', borderRadius: '18px 18px 0 0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.3)' }}>
                  <RemoveCircleRoundedIcon sx={{ fontSize: 23 }} />
                </Avatar>
                <Box>
                  <Typography fontWeight={700} sx={{ color: 'white', fontSize: 19 }}>Withdraw Money</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: 13.5 }}>Cash out from your account</Typography>
                </Box>
              </Box>
            </Box>
            <CardContent sx={{ p: 3 }}>
              {wErr && <Alert severity="error" onClose={() => setWErr('')} sx={{ mb: 2.5, borderRadius: 2.5, fontSize: 14 }}>{wErr}</Alert>}
              <Box component="form" onSubmit={wF.handleSubmit(onWithdraw)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Amount to Withdraw" type="number" fullWidth placeholder="0.00"
                  {...amountSlot('#ea580c')}
                  error={!!wF.formState.errors.amount}
                  helperText={wF.formState.errors.amount?.message}
                  {...wF.register('amount')} />
                <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: '#fff7ed', border: '1px solid #fed7aa' }}>
                  <Typography sx={{ color: '#ea580c', fontWeight: 500, fontSize: 14 }}>
                    Minimum $1 · Maximum $10,000 per withdrawal
                  </Typography>
                </Box>
                <Button type="submit" fullWidth variant="contained" size="large" disabled={wP}
                  startIcon={wP ? <CircularProgress size={18} color="inherit" /> : <RemoveCircleRoundedIcon />}
                  sx={{ py: 1.6, fontSize: 16, borderRadius: 2.5, background: 'linear-gradient(135deg,#c2410c,#ea580c)', '&:hover': { background: 'linear-gradient(135deg,#9a3412,#c2410c)' } }}>
                  {wP ? 'Withdrawing...' : 'Withdraw'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </AppLayout>
  );
}
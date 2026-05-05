'use client';
import { useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Skeleton, Button, Divider, LinearProgress, Chip, Avatar } from '@mui/material';
import WavingHandIcon              from '@mui/icons-material/WavingHand';
import TrendingUpRoundedIcon       from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon     from '@mui/icons-material/TrendingDownRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import RemoveCircleOutlineIcon     from '@mui/icons-material/RemoveCircleOutline';
import SendRoundedIcon             from '@mui/icons-material/SendRounded';
import AddRoundedIcon              from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon           from '@mui/icons-material/RemoveRounded';
import HistoryRoundedIcon          from '@mui/icons-material/HistoryRounded';
import ContentCopyRoundedIcon      from '@mui/icons-material/ContentCopyRounded';
import ArrowForwardRoundedIcon     from '@mui/icons-material/ArrowForwardRounded';
import FiberManualRecordIcon       from '@mui/icons-material/FiberManualRecord';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useAuth';
import { useSummary, useTransactions } from '@/hooks/useTransactions';
import { useToast } from '@/components/ui/Toast';
import AppLayout from '@/components/layout/AppLayout';
import TransactionRow from '@/components/ui/TransactionRow';
import SpendingChart from '@/components/charts/SpendingChart';
import DonutChart from '@/components/charts/DonutChart';

export default function DashboardClient() {
  const router = useRouter();
  const { showToast } = useToast();
  const { isLoading: authLoading, isError: authError, data: user } = useCurrentUser();
  const { data: summary, isLoading: sumLoading } = useSummary();
  const { data: txData } = useTransactions(1);

  useEffect(() => { if (!authLoading && authError) router.push('/auth/login'); }, [authLoading, authError, router]);

  if (authLoading) return (
    <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', bgcolor:'#EEF4E8', flexDirection:'column', gap:2 }}>
      <LinearProgress sx={{ width:200, borderRadius:4, '& .MuiLinearProgress-bar':{ bgcolor:'#4C763B' } }}/>
      <Typography color="text.secondary" fontSize={14}>Loading Payzo...</Typography>
    </Box>
  );
  if (authError || !user) return null;

  const copy = () => {
    navigator.clipboard.writeText(summary?.accountNumber || '');
    showToast('Account number copied!', 'info');
  };

  
  const statCards = [
    { label:'Sent',      value: summary?.totalSent,      icon: <TrendingUpRoundedIcon          sx={{ fontSize:20 }}/>, clr:'#dc2626', bg:'#fff1f2', border:'#fecdd3' },
    { label:'Received',  value: summary?.totalReceived,  icon: <TrendingDownRoundedIcon         sx={{ fontSize:20 }}/>, clr:'#16a34a', bg:'#f0fdf4', border:'#bbf7d0' },
    { label:'Deposited', value: summary?.totalDeposited, icon: <AccountBalanceWalletRoundedIcon sx={{ fontSize:20 }}/>, clr:'#2563eb', bg:'#eff6ff', border:'#bfdbfe' },
    { label:'Withdrawn', value: summary?.totalWithdrawn, icon: <RemoveCircleOutlineIcon         sx={{ fontSize:20 }}/>, clr:'#ea580c', bg:'#fff7ed', border:'#fed7aa' },
  ];

  const qBtns = [
    { label:'Send',     icon:<SendRoundedIcon    sx={{ fontSize:14 }}/>, onClick:()=>router.push('/transfer') },
    { label:'Deposit',  icon:<AddRoundedIcon     sx={{ fontSize:14 }}/>, onClick:()=>router.push('/transfer') },
    { label:'Withdraw', icon:<RemoveRoundedIcon  sx={{ fontSize:14 }}/>, onClick:()=>router.push('/transfer') },
    { label:'History',  icon:<HistoryRoundedIcon sx={{ fontSize:14 }}/>, onClick:()=>router.push('/transactions') },
  ];

  return (
    <AppLayout>
     
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', mb:3.5, flexWrap:'wrap', gap:2 }}>
        <Box>
          <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
            <Typography variant="h3" fontWeight={800} color="#0D2414"
              sx={{ fontSize:{ xs:'1.7rem', sm:'2.2rem' } }}>
              Good day, {user.name.split(' ')[0]}
            </Typography>
           
            <WavingHandIcon sx={{ fontSize:{ xs:'1.7rem', sm:'2.2rem' }, color:'#4C763B' }}/>
          </Box>
          <Typography color="text.secondary" mt={0.5} fontSize={15}>Here is your financial overview</Typography>
        </Box>
        <Box sx={{ display:'flex', gap:1.5 }}>
          <Button variant="contained" startIcon={<SendRoundedIcon sx={{ fontSize:16 }}/>}
            onClick={()=>router.push('/transfer')} sx={{ borderRadius:2.5, px:2.5 }}>
            Send Money
          </Button>
          <Button variant="outlined" startIcon={<AddRoundedIcon sx={{ fontSize:16 }}/>}
            onClick={()=>router.push('/transfer')}
            sx={{ borderRadius:2.5, px:2.5, display:{ xs:'none', sm:'flex' } }}>
            Deposit
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>

       
        <Grid item xs={12} lg={5}>
          <Card sx={{ background:'linear-gradient(140deg,#032b0f 0%,#043915 35%,#0a5228 65%,#0f6030 100%)', height:'100%', minHeight:260 }}>
            <CardContent sx={{ p:{ xs:2.5, sm:3.5 }, height:'100%', display:'flex', flexDirection:'column' }}>
              <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
                <Typography sx={{ color:'rgba(154,216,114,0.78)', fontSize:11.5, fontWeight:700, letterSpacing:2, textTransform:'uppercase' }}>
                  Available Balance
                </Typography>
                <Box sx={{ display:'flex', alignItems:'center', gap:0.75, px:1.5, py:0.5, borderRadius:10, bgcolor:'rgba(154,216,114,0.15)', border:'1px solid rgba(154,216,114,0.3)' }}>
                  <FiberManualRecordIcon sx={{ fontSize:8, color:'#9AD872' }}/>
                  <Typography sx={{ color:'#9AD872', fontSize:11, fontWeight:700 }}>LIVE</Typography>
                </Box>
              </Box>

              {sumLoading
                ? <Skeleton sx={{ bgcolor:'rgba(255,255,255,0.12)', borderRadius:2 }} width={220} height={56}/>
                : <Typography sx={{ color:'white', fontWeight:800, fontSize:{ xs:'1.8rem', sm:'2.4rem' }, letterSpacing:-1, lineHeight:1.1 }}>
                    ${summary?.balance.toLocaleString('en-US', { minimumFractionDigits:2 })}
                  </Typography>
              }

              <Box onClick={copy} sx={{ display:'flex', alignItems:'center', gap:1, mt:1.25, cursor:'pointer', width:'fit-content',
                '&:hover .copy-icon':{ opacity:1 }, '&:hover .acct-txt':{ color:'rgba(255,255,255,0.8)' } }}>
                <Typography className="acct-txt" sx={{ color:'rgba(255,255,255,0.5)', fontFamily:'monospace', fontSize:{ xs:11, sm:12.5 }, transition:'0.15s' }}>
                  {summary?.accountNumber || '—'}
                </Typography>
                <ContentCopyRoundedIcon className="copy-icon" sx={{ fontSize:13, color:'#9AD872', opacity:0.6, transition:'0.15s' }}/>
              </Box>

              <Divider sx={{ borderColor:'rgba(154,216,114,0.15)', my:2 }}/>

              <Grid container spacing={1.5} sx={{ mb:2 }}>
                {[{ label:'Sent', val:summary?.totalSent||0 }, { label:'Received', val:summary?.totalReceived||0 }].map((s)=>(
                  <Grid item xs={6} key={s.label}>
                    <Box sx={{ textAlign:'center', p:{ xs:1, sm:1.5 }, borderRadius:2.5, bgcolor:'rgba(154,216,114,0.1)', border:'1px solid rgba(154,216,114,0.18)' }}>
                      <Typography sx={{ color:'rgba(154,216,114,0.68)', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>
                        {s.label}
                      </Typography>
                      <Typography sx={{ color:'white', fontWeight:700, fontSize:{ xs:13, sm:14.5 }, mt:0.25 }}>
                        ${s.val.toLocaleString('en-US', { minimumFractionDigits:0 })}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

             
              <Box sx={{ display:'flex', gap:0.75 }}>
                {qBtns.map((b)=>(
                  <Button key={b.label} onClick={b.onClick} size="small" startIcon={b.icon}
                    sx={{ flex:1, color:'rgba(255,255,255,0.85)', bgcolor:'rgba(154,216,114,0.14)',
                      border:'1px solid rgba(154,216,114,0.25)', borderRadius:2, fontSize:{ xs:10, sm:11.5 },
                      fontWeight:600, px:0, minWidth:0,
                      '&:hover':{ bgcolor:'rgba(154,216,114,0.25)', transform:'translateY(-1px)' },
                      transition:'all 0.18s',
                    }}>
                    {b.label}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>


        <Grid item xs={12} lg={7}>
          <Grid container spacing={2} sx={{ height:'100%' }}>
            {statCards.map((s)=>(
              <Grid item xs={6} key={s.label}>
                <Card sx={{ bgcolor:s.bg, border:`1px solid ${s.border}`, boxShadow:'none', height:'100%',
                  '&:hover':{ transform:'translateY(-2px)', boxShadow:`0 8px 24px ${s.clr}18` }, transition:'all 0.22s ease' }}>
                  <CardContent sx={{ p:{ xs:1.5, sm:2.5 } }}>
                    <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:1 }}>
       
                      <Typography sx={{ fontSize:{ xs:10.5, sm:11.5 }, fontWeight:700, color:s.clr, textTransform:'uppercase', letterSpacing:0.8, opacity:0.85, whiteSpace:'nowrap' }}>
                        {s.label}
                      </Typography>
                      <Avatar sx={{ width:{ xs:26, sm:32 }, height:{ xs:26, sm:32 }, bgcolor:`${s.clr}18`, color:s.clr, flexShrink:0 }}>
                        {s.icon}
                      </Avatar>
                    </Box>
                    {sumLoading
                      ? <Skeleton width={80} height={28}/>
                      : <Typography fontWeight={800} fontSize={{ xs:14, sm:18 }} color={s.clr}>
                          ${(s.value||0).toLocaleString('en-US', { minimumFractionDigits:2 })}
                        </Typography>
                    }
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

       
        <Grid item xs={12} md={8}>
          {txData?.transactions
            ? <SpendingChart transactions={txData.transactions} userId={user._id}/>
            : <Card><CardContent><Skeleton height={240} variant="rounded"/></CardContent></Card>
          }
        </Grid>
        <Grid item xs={12} md={4}>
          {summary
            ? <DonutChart totalSent={summary.totalSent} totalReceived={summary.totalReceived}
                totalDeposited={summary.totalDeposited} totalWithdrawn={summary.totalWithdrawn}/>
            : <Card><CardContent><Skeleton height={240} variant="rounded"/></CardContent></Card>
          }
        </Grid>


        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p:0 }}>
              <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', px:3, py:2.5, borderBottom:'1px solid rgba(176,206,136,0.2)' }}>
                <Box>
                  <Typography variant="h5" fontWeight={700}>Recent Transactions</Typography>
                  <Typography variant="caption" color="text.secondary">Your latest activity</Typography>
                </Box>
                <Button size="small" endIcon={<ArrowForwardRoundedIcon sx={{ fontSize:15 }}/>}
                  onClick={()=>router.push('/transactions')}
                  sx={{ color:'#4C763B', fontWeight:600, fontSize:13, '&:hover':{ bgcolor:'rgba(154,216,114,0.1)' } }}>
                  View All
                </Button>
              </Box>

              {sumLoading ? (
                <Box sx={{ p:3, display:'flex', flexDirection:'column', gap:1 }}>
                  {[1,2,3].map(i=><Skeleton key={i} height={62} variant="rounded"/>)}
                </Box>
              ) : summary?.recentTransactions?.length ? (

                <TableContainer sx={{ overflowX:'auto' }}>
                  <Table size="small" sx={{ minWidth:560 }}>
                    <TableHead>
                      <TableRow sx={{ '& th':{ bgcolor:'#f8fcf5', fontWeight:700, color:'#4C763B', fontSize:13, py:1.75, borderBottom:'2px solid rgba(176,206,136,0.3)', whiteSpace:'nowrap' } }}>
                        <TableCell>Description</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {summary.recentTransactions.map((tx)=><TransactionRow key={tx._id} tx={tx}/>)}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ p:5, textAlign:'center' }}>
                  <Typography color="text.secondary" fontSize={15}>No transactions yet — make your first transfer!</Typography>
                  <Button variant="contained" startIcon={<SendRoundedIcon/>} onClick={()=>router.push('/transfer')} sx={{ mt:2, borderRadius:2.5 }}>
                    Send Money
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </AppLayout>
  );
}
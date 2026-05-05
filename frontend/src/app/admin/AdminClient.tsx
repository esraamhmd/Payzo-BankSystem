'use client';
import { useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Chip, IconButton, Skeleton, Tooltip, Avatar } from '@mui/material';
import PeopleRoundedIcon           from '@mui/icons-material/PeopleRounded';
import MonetizationOnRoundedIcon   from '@mui/icons-material/MonetizationOnRounded';
import BlockRoundedIcon            from '@mui/icons-material/BlockRounded';
import CheckCircleRoundedIcon      from '@mui/icons-material/CheckCircleRounded';
import ReceiptLongRoundedIcon      from '@mui/icons-material/ReceiptLongRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import TrendingUpRoundedIcon       from '@mui/icons-material/TrendingUpRounded';
import AccountBalanceRoundedIcon   from '@mui/icons-material/AccountBalanceRounded';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useAuth';
import { useAdminStats, useAdminUsers, useUpdateUser } from '@/hooks/useAdmin';
import { useToast } from '@/components/ui/Toast';
import AppLayout from '@/components/layout/AppLayout';

export default function AdminClient() {
  const router = useRouter();
  const { showToast } = useToast();
  const { isLoading: aL, isError: aE, data: user } = useCurrentUser();
  const { data: stats, isLoading: sL } = useAdminStats();
  const { data: users, isLoading: uL } = useAdminUsers();
  const { mutate: updateUser } = useUpdateUser();

  useEffect(() => {
    if (!aL) { if (aE) router.push('/auth/login'); else if (user && user.role !== 'admin') router.push('/dashboard'); }
  }, [aL, aE, user, router]);
  if (aL || aE || !user || user.role !== 'admin') return null;

  const toggle = (id: string, cur: boolean) =>
    updateUser({ id, isActive: !cur }, { onSuccess: (d) => showToast(d.message, cur ? 'warning' : 'success') });

  const statCards = [
    { label:'Total Users',        val:stats?.totalUsers,        icon:<PeopleRoundedIcon             sx={{ fontSize:20 }}/>, grad:'linear-gradient(135deg,#043915,#4C763B)',  shadow:'rgba(4,57,21,0.3)' },
    { label:'Active Users',       val:stats?.activeUsers,       icon:<CheckCircleRoundedIcon        sx={{ fontSize:20 }}/>, grad:'linear-gradient(135deg,#15803d,#16a34a)',  shadow:'rgba(22,163,74,0.3)' },
    { label:'Suspended',          val:stats?.suspendedUsers,    icon:<BlockRoundedIcon              sx={{ fontSize:20 }}/>, grad:'linear-gradient(135deg,#b91c1c,#dc2626)',  shadow:'rgba(220,38,38,0.3)' },
    { label:'Transactions',       val:stats?.totalTransactions, icon:<ReceiptLongRoundedIcon        sx={{ fontSize:20 }}/>, grad:'linear-gradient(135deg,#1d4ed8,#2563eb)',  shadow:'rgba(37,99,235,0.3)' },
    { label:'Volume',             val:stats ? `$${stats.totalVolume.toLocaleString('en-US',{ maximumFractionDigits:0 })}` : '—', icon:<TrendingUpRoundedIcon sx={{ fontSize:20 }}/>, grad:'linear-gradient(135deg,#c2410c,#ea580c)', shadow:'rgba(234,88,12,0.3)' },
    { label:'Total Balances',     val:stats ? `$${stats.totalBalances.toLocaleString('en-US',{ maximumFractionDigits:0 })}` : '—', icon:<AccountBalanceRoundedIcon sx={{ fontSize:20 }}/>, grad:'linear-gradient(135deg,#6d28d9,#7c3aed)', shadow:'rgba(124,58,237,0.3)' },
  ];

  return (
    <AppLayout>
      {/* Header */}
      <Box sx={{ display:'flex', alignItems:'center', gap:2, mb:3.5 }}>
        <Avatar sx={{ width:52, height:52, background:'linear-gradient(135deg,#043915,#4C763B)', boxShadow:'0 4px 16px rgba(4,57,21,0.3)' }}>
          <AdminPanelSettingsRoundedIcon sx={{ fontSize:26 }}/>
        </Avatar>
        <Box>
          <Typography variant="h3" fontWeight={800} color="#0D2414" sx={{ fontSize:{ xs:'1.7rem', sm:'2rem' } }}>
            Admin Panel
          </Typography>
          <Typography color="text.secondary" variant="body2" fontSize={14}>Payzo system overview & user management</Typography>
        </Box>
      </Box>

   
      <Grid container spacing={2.5} sx={{ mb:3.5 }}>
        {statCards.map((s)=>(
          <Grid item xs={6} md={4} key={s.label}>
            <Card sx={{ background:s.grad, border:'none', boxShadow:`0 4px 20px ${s.shadow}`, '&:hover':{ transform:'translateY(-2px)', boxShadow:`0 8px 28px ${s.shadow}` }, transition:'all 0.22s' }}>
              <CardContent sx={{ p:{ xs:2, sm:2.5 } }}>
                <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', mb:1.5 }}>
                  <Typography sx={{ color:'rgba(255,255,255,0.72)', fontSize:{ xs:10.5, sm:11.5 }, fontWeight:600, textTransform:'uppercase', letterSpacing:0.8, whiteSpace:'nowrap' }}>
                    {s.label}
                  </Typography>
                  <Avatar sx={{ width:{ xs:26, sm:32 }, height:{ xs:26, sm:32 }, bgcolor:'rgba(255,255,255,0.18)', flexShrink:0 }}>{s.icon}</Avatar>
                </Box>
                {sL ? <Skeleton sx={{ bgcolor:'rgba(255,255,255,0.25)', borderRadius:1 }} width={70} height={30}/>
                    : <Typography fontWeight={800} fontSize={{ xs:18, sm:22 }} sx={{ color:'white' }}>{s.val ?? 0}</Typography>
                }
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>


      <Card>
        <CardContent sx={{ p:0 }}>
          <Box sx={{ px:3, py:2.5, borderBottom:'1px solid rgba(176,206,136,0.2)', display:'flex', alignItems:'center', gap:1.5 }}>
            <PeopleRoundedIcon sx={{ color:'#4C763B', fontSize:22 }}/>
            <Typography variant="h5" fontWeight={700} sx={{ fontSize:{ xs:16, sm:18 } }}>User Management</Typography>
            {users && <Chip label={`${users.length} users`} size="small" sx={{ bgcolor:'#9AD872', color:'#043915', fontWeight:700, height:20, fontSize:11 }}/>}
          </Box>

          {uL ? (
            <Box sx={{ p:3, display:'flex', flexDirection:'column', gap:1 }}>
              {[1,2,3,4].map(i=><Skeleton key={i} height={60} variant="rounded"/>)}
            </Box>
          ) : users?.length ? (

            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ '& th':{ bgcolor:'#f8fcf5', fontWeight:700, color:'#4C763B', fontSize:13, py:1.75, borderBottom:'2px solid rgba(176,206,136,0.3)', whiteSpace:'nowrap' } }}>
                    <TableCell>User</TableCell>
                    <TableCell>Account No.</TableCell>
                    <TableCell align="right">Balance</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u)=>(
                    <TableRow hover key={u._id} sx={{ '&:hover':{ bgcolor:'rgba(154,216,114,0.04)' }, transition:'background 0.15s' }}>
                      <TableCell sx={{ py:1.75 }}>
                        <Box sx={{ display:'flex', alignItems:'center', gap:1.75 }}>
                          <Avatar sx={{ width:36, height:36, bgcolor:'#9AD872', color:'#043915', fontWeight:800, fontSize:14, flexShrink:0 }}>
                            {u.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600} color="#0D2414" fontSize={13.5} sx={{ whiteSpace:'nowrap' }}>{u.name}</Typography>
                            <Typography variant="caption" color="text.secondary" fontSize={12}>{u.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontFamily:'monospace', fontSize:12, color:'#4C763B', bgcolor:'#f0fdf4', px:1, py:0.4, borderRadius:1.5, display:'inline-block', whiteSpace:'nowrap' }}>
                          {u.accountNumber}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={700} fontSize={13.5} color="#16a34a" sx={{ whiteSpace:'nowrap' }}>
                          ${u.balance.toLocaleString('en-US', { minimumFractionDigits:2 })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={u.role} size="small" variant="outlined"
                          sx={{ borderColor:u.role==='admin'?'#9AD872':'#d1d5db', color:u.role==='admin'?'#043915':'#6b7280', fontWeight:600, fontSize:11.5 }}/>
                      </TableCell>
                      <TableCell>
                        <Chip label={u.isActive?'Active':'Suspended'} size="small"
                          sx={{ bgcolor:u.isActive?'#f0fdf4':'#fff1f2', color:u.isActive?'#16a34a':'#dc2626',
                            border:`1px solid ${u.isActive?'#bbf7d0':'#fecdd3'}`, fontWeight:700, fontSize:11.5 }}/>
                      </TableCell>
                      <TableCell align="center">
                        {u._id !== user._id && (
                          <Tooltip title={u.isActive?'Suspend user':'Activate user'} arrow>
                            <IconButton size="small" color={u.isActive?'error':'success'}
                              onClick={()=>toggle(u._id, u.isActive)}
                              sx={{ '&:hover':{ bgcolor:u.isActive?'rgba(220,38,38,0.1)':'rgba(22,163,74,0.1)' } }}>
                              {u.isActive ? <BlockRoundedIcon fontSize="small"/> : <CheckCircleRoundedIcon fontSize="small"/>}
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p:4, textAlign:'center' }}>
              <Typography color="text.secondary">No users found.</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
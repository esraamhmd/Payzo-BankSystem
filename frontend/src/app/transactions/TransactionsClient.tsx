'use client';
import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Skeleton, Pagination, Chip, Avatar } from '@mui/material';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useAuth';
import { useTransactions } from '@/hooks/useTransactions';
import AppLayout from '@/components/layout/AppLayout';
import TransactionRow from '@/components/ui/TransactionRow';

export default function TransactionsClient() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { isLoading: aL, isError: aE, data: user } = useCurrentUser();
  const { data, isLoading } = useTransactions(page);
  useEffect(() => { if (!aL && aE) router.push('/auth/login'); }, [aL, aE, router]);
  if (aL || aE || !user) return null;

  return (
    <AppLayout>
      <Box sx={{ display:'flex', alignItems:'center', gap:2, mb:3.5 }}>
        <Avatar sx={{ width:48, height:48, background:'linear-gradient(135deg,#4C763B,#468432)', boxShadow:'0 4px 14px rgba(70,132,50,0.3)' }}>
          <ReceiptLongRoundedIcon sx={{ fontSize:24 }}/>
        </Avatar>
        <Box>
          <Typography variant="h3" fontWeight={800} color="#0D2414" sx={{ fontSize:{ xs:'1.7rem', sm:'2rem' } }}>
            Transaction History
          </Typography>
          <Box sx={{ display:'flex', alignItems:'center', gap:1, mt:0.25 }}>
            <Typography color="text.secondary" variant="body2" fontSize={14}>All your transactions</Typography>
            {data && <Chip label={`${data.total} total`} size="small" sx={{ bgcolor:'#9AD872', color:'#043915', fontWeight:700, height:20, fontSize:11 }}/>}
          </Box>
        </Box>
      </Box>

      <Card>
        <CardContent sx={{ p:0 }}>
          {isLoading ? (
            <Box sx={{ p:3, display:'flex', flexDirection:'column', gap:1 }}>
              {[1,2,3,4,5].map(i=><Skeleton key={i} height={68} variant="rounded"/>)}
            </Box>
          ) : data?.transactions?.length ? (
            <>

              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 600 }}>
                  <TableHead>
                    <TableRow sx={{ '& th':{ bgcolor:'#f8fcf5', fontWeight:700, color:'#4C763B', fontSize:13, py:1.75, borderBottom:'2px solid rgba(176,206,136,0.3)', whiteSpace:'nowrap' } }}>
                      <TableCell>Description</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right" sx={{ whiteSpace:'nowrap' }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.transactions.map((tx)=><TransactionRow key={tx._id} tx={tx}/>)}
                  </TableBody>
                </Table>
              </TableContainer>
              {data.pages > 1 && (
                <Box sx={{ display:'flex', justifyContent:'center', p:3 }}>
                  <Pagination count={data.pages} page={page} onChange={(_,p)=>setPage(p)}
                    sx={{ '& .MuiPaginationItem-root.Mui-selected':{ bgcolor:'#4C763B', color:'white' } }}/>
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ p:5, textAlign:'center' }}>
              <ReceiptLongRoundedIcon sx={{ fontSize:52, color:'rgba(154,216,114,0.4)', mb:2 }}/>
              <Typography color="text.secondary" fontSize={15}>No transactions yet.</Typography>
              <Typography color="text.secondary" fontSize={13} mt={0.5}>Head to Transfer to make your first one!</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
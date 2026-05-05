'use client';
import { TableRow, TableCell, Chip, Typography, Box, Avatar } from '@mui/material';
import NorthRoundedIcon                from '@mui/icons-material/NorthRounded';
import SouthRoundedIcon                from '@mui/icons-material/SouthRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import RemoveCircleRoundedIcon         from '@mui/icons-material/RemoveCircleRounded';
import { Transaction } from '@/types';
import { useAppSelector } from '@/store/hooks';

export default function TransactionRow({ tx }: { tx: Transaction }) {
  const user = useAppSelector((s) => s.auth.user);
  const isSender  = tx.senderId._id === user?._id;
  const isDeposit = tx.type === 'deposit';
  const isWithdraw= tx.type === 'withdrawal';

  let IconC = SouthRoundedIcon, avatarBg='#f0fdf4', iconClr='#16a34a', amtClr='#16a34a', prefix='+';
  if (isDeposit)       { IconC=AccountBalanceWalletRoundedIcon; avatarBg='#eff6ff'; iconClr='#2563eb'; amtClr='#2563eb'; prefix='+'; }
  else if (isWithdraw) { IconC=RemoveCircleRoundedIcon;          avatarBg='#fff7ed'; iconClr='#ea580c'; amtClr='#ea580c'; prefix='-'; }
  else if (isSender)   { IconC=NorthRoundedIcon;                 avatarBg='#fff1f2'; iconClr='#dc2626'; amtClr='#dc2626'; prefix='-'; }

  const who = isDeposit ? 'Deposit' : isWithdraw ? 'Withdrawal'
    : isSender ? tx.receiverId.name : tx.senderId.name;

  return (
    <TableRow hover sx={{ '&:hover':{ bgcolor:'rgba(154,216,114,0.04)' }, transition:'background 0.15s' }}>
      <TableCell sx={{ py:1.75, minWidth:160 }}>
        <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
          <Avatar sx={{ width:38, height:38, bgcolor:avatarBg, color:iconClr, flexShrink:0, boxShadow:'0 1px 6px rgba(0,0,0,0.07)' }}>
            <IconC sx={{ fontSize:17 }}/>
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600} color="#0D2414" fontSize={13.5} sx={{ whiteSpace:'nowrap' }}>
              {tx.description || 'Transaction'}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontSize={12}>
              {isDeposit||isWithdraw ? tx.type.charAt(0).toUpperCase()+tx.type.slice(1) : `${isSender?'To':'From'}: ${who}`}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      <TableCell sx={{ minWidth:90 }}>
        <Chip label={tx.type} size="small" variant="outlined"
          sx={{ textTransform:'capitalize', borderColor:'#B0CE88', color:'#4C763B', fontSize:11.5, height:22, fontWeight:600 }}/>
      </TableCell>

      <TableCell sx={{ minWidth:90 }}>
        <Chip label={tx.status} size="small" color={tx.status==='completed'?'success':'error'} variant="outlined"
          sx={{ fontSize:11.5, height:22, fontWeight:600 }}/>
      </TableCell>

      <TableCell align="right" sx={{ minWidth:100 }}>
        <Typography fontWeight={700} fontSize={14} color={amtClr} sx={{ whiteSpace:'nowrap' }}>
          {prefix}${tx.amount.toLocaleString('en-US', { minimumFractionDigits:2 })}
        </Typography>
      </TableCell>

      <TableCell align="right" sx={{ minWidth:110 }}>
        <Typography variant="caption" color="text.secondary" fontSize={12} sx={{ whiteSpace:'nowrap' }}>
          {new Date(tx.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
        </Typography>
      </TableCell>
    </TableRow>
  );
}
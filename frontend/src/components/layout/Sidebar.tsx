'use client';
import { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Avatar, Divider, Tooltip, IconButton, Chip } from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { useLogout } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';

const NAV = [
  { label:'Dashboard',    href:'/dashboard',    icon:<DashboardRoundedIcon      sx={{fontSize:20}}/> },
  { label:'Transfer',     href:'/transfer',     icon:<SendRoundedIcon           sx={{fontSize:20}}/> },
  { label:'Transactions', href:'/transactions', icon:<ReceiptLongRoundedIcon    sx={{fontSize:20}}/> },
];

export default function Sidebar() {
  const [col, setCol] = useState(false);
  const pathname = usePathname();
  const router   = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const {mutate:logout} = useLogout();
  const {showToast} = useToast();
  const W = col ? 70 : 256;

  const copy = () => { if(user?.accountNumber){ navigator.clipboard.writeText(user.accountNumber); showToast('Account number copied!','info'); } };

  return (
    <Drawer variant="permanent" sx={{ width:W, flexShrink:0,
      '& .MuiDrawer-paper':{ width:W, overflow:'hidden', transition:'width 0.28s cubic-bezier(0.4,0,0.2,1)',
        background:'linear-gradient(180deg,#031e0a 0%,#042b10 30%,#043915 65%,#0a4d20 100%)',
        border:'none', boxShadow:'4px 0 28px rgba(3,30,10,0.45)',
      },
    }}>
      {/* Logo */}
      <Box sx={{ p: col?1.25:2.5, display:'flex', alignItems:'center', justifyContent: col?'center':'space-between', minHeight:66, borderBottom:'1px solid rgba(154,216,114,0.1)' }}>
        {!col && (
          <Box sx={{display:'flex',alignItems:'center',gap:1.5}}>
            <Box sx={{width:34,height:34,borderRadius:'10px',bgcolor:'rgba(154,216,114,0.18)',border:'1.5px solid rgba(154,216,114,0.4)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <AccountBalanceIcon sx={{color:'#9AD872',fontSize:19}}/>
            </Box>
            <Typography fontWeight={800} sx={{color:'white',letterSpacing:2.5,fontSize:15.5}}>PAYZO</Typography>
          </Box>
        )}
        {col && <AccountBalanceIcon sx={{color:'#9AD872',fontSize:22}}/>}
        <IconButton onClick={()=>setCol(!col)} size="small" sx={{color:'rgba(154,216,114,0.55)','&:hover':{color:'#9AD872',bgcolor:'rgba(154,216,114,0.1)'}}}>
          {col ? <ChevronRightRoundedIcon sx={{fontSize:18}}/> : <ChevronLeftRoundedIcon sx={{fontSize:18}}/>}
        </IconButton>
      </Box>

      {/* User card */}
      {!col && user && (
        <Box sx={{p:2}}>
          <Box sx={{p:1.75,borderRadius:3,bgcolor:'rgba(154,216,114,0.07)',border:'1px solid rgba(154,216,114,0.14)'}}>
            <Box sx={{display:'flex',alignItems:'center',gap:1.5,mb:1.5}}>
              <Avatar sx={{width:38,height:38,bgcolor:'#9AD872',color:'#043915',fontWeight:800,fontSize:14.5}}>{user.name.charAt(0).toUpperCase()}</Avatar>
              <Box sx={{overflow:'hidden',flex:1}}>
                <Typography variant="body2" fontWeight={700} sx={{color:'white',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:13.5}}>{user.name}</Typography>
                <Typography variant="caption" sx={{color:'rgba(154,216,114,0.6)',fontSize:11}}>{user.email.length>22?user.email.substring(0,20)+'…':user.email}</Typography>
              </Box>
              {user.role==='admin' && <Chip label="Admin" size="small" sx={{height:18,fontSize:10,bgcolor:'#9AD872',color:'#043915',fontWeight:700}}/>}
            </Box>
            <Box onClick={copy} sx={{display:'flex',alignItems:'center',justifyContent:'space-between',px:1.25,py:0.8,borderRadius:2,bgcolor:'rgba(3,30,10,0.5)',cursor:'pointer',transition:'all 0.18s','&:hover':{bgcolor:'rgba(3,30,10,0.75)'}}}>
              <Typography sx={{color:'rgba(255,255,255,0.58)',fontFamily:'monospace',fontSize:11,letterSpacing:0.5}}>{user.accountNumber}</Typography>
              <ContentCopyRoundedIcon sx={{fontSize:13,color:'rgba(154,216,114,0.7)'}}/>
            </Box>
          </Box>
        </Box>
      )}
      {col && user && (
        <Box sx={{display:'flex',justifyContent:'center',py:1.5}}>
          <Tooltip title={user.name} placement="right" arrow>
            <Avatar sx={{width:34,height:34,bgcolor:'#9AD872',color:'#043915',fontWeight:800,fontSize:13,cursor:'pointer'}}>{user.name.charAt(0).toUpperCase()}</Avatar>
          </Tooltip>
        </Box>
      )}

      <Divider sx={{borderColor:'rgba(154,216,114,0.09)',mx:col?1:1.75,mb:0.75}}/>

      {/* Nav */}
      <List sx={{px:col?0.75:1.5,flexGrow:1,pt:0.5}}>
        {NAV.map((item)=>{
          const active = pathname===item.href;
          return (
            <ListItem key={item.href} disablePadding sx={{mb:0.5}}>
              <Tooltip title={col?item.label:''} placement="right" arrow>
                <ListItemButton onClick={()=>router.push(item.href)}
                  sx={{ borderRadius:2.5, minHeight:44, px:col?1.5:2, justifyContent:col?'center':'flex-start',
                    bgcolor: active?'rgba(154,216,114,0.17)':'transparent',
                    border:`1px solid ${active?'rgba(154,216,114,0.28)':'transparent'}`,
                    '&:hover':{ bgcolor:'rgba(154,216,114,0.1)', border:'1px solid rgba(154,216,114,0.2)' },
                    transition:'all 0.18s ease',
                  }}>
                  <ListItemIcon sx={{color:active?'#9AD872':'rgba(255,255,255,0.45)',minWidth:col?0:36}}>{item.icon}</ListItemIcon>
                  {!col && <ListItemText primary={item.label} slotProps={{ primary: {fontSize:13.5,fontWeight:active?700:500,color:active?'white':'rgba(255,255,255,0.6)'} }}/>}
                  {!col && active && <Box sx={{width:6,height:6,borderRadius:'50%',bgcolor:'#9AD872',ml:'auto'}}/>}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
        {user?.role==='admin' && (
          <ListItem disablePadding sx={{mb:0.5}}>
            <Tooltip title={col?'Admin':''} placement="right" arrow>
              <ListItemButton onClick={()=>router.push('/admin')}
                sx={{ borderRadius:2.5, minHeight:44, px:col?1.5:2, justifyContent:col?'center':'flex-start',
                  bgcolor:pathname==='/admin'?'rgba(154,216,114,0.17)':'transparent',
                  border:`1px solid ${pathname==='/admin'?'rgba(154,216,114,0.28)':'transparent'}`,
                  '&:hover':{ bgcolor:'rgba(154,216,114,0.1)' }, transition:'all 0.18s',
                }}>
                <ListItemIcon sx={{color:pathname==='/admin'?'#9AD872':'rgba(255,255,255,0.45)',minWidth:col?0:36}}><AdminPanelSettingsRoundedIcon sx={{fontSize:20}}/></ListItemIcon>
                {!col && <ListItemText primary="Admin" slotProps={{ primary: {fontSize:13.5,fontWeight:pathname==='/admin'?700:500,color:pathname==='/admin'?'white':'rgba(255,255,255,0.6)'} }}/>}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        )}
      </List>

      <Divider sx={{borderColor:'rgba(154,216,114,0.09)',mx:col?1:1.75,mb:0.75}}/>
      <List sx={{px:col?0.75:1.5,pb:2}}>
        <ListItem disablePadding>
          <Tooltip title={col?'Logout':''} placement="right" arrow>
            <ListItemButton onClick={()=>logout()}
              sx={{ borderRadius:2.5, minHeight:44, px:col?1.5:2, justifyContent:col?'center':'flex-start',
                '&:hover':{ bgcolor:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.18)' }, transition:'all 0.18s',
              }}>
              <ListItemIcon sx={{color:'rgba(252,129,129,0.7)',minWidth:col?0:36}}><LogoutRoundedIcon sx={{fontSize:20}}/></ListItemIcon>
              {!col && <ListItemText primary="Logout" slotProps={{ primary: {fontSize:13.5,fontWeight:500,color:'rgba(252,129,129,0.7)'} }}/>}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </Drawer>
  );
}
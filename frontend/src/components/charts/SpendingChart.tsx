'use client';
import { useState } from 'react';
import { Box, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import { Transaction } from '@/types';

interface Props { transactions: Transaction[]; userId: string; }

export default function SpendingChart({ transactions, userId }: Props) {
  const [view, setView] = useState<'week' | 'month'>('week');
  const days = view === 'week' ? 7 : 30;

 
  const chartData = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    const label = view === 'week'
      ? date.toLocaleDateString('en-US', { weekday: 'short' })
      : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dayStr = date.toDateString();

    let moneyIn = 0, moneyOut = 0;
    transactions.forEach((tx) => {
      if (new Date(tx.createdAt).toDateString() !== dayStr) return;
      if (tx.type === 'transfer') {
        if (tx.senderId._id === userId)   moneyOut += tx.amount;
        else if (tx.receiverId._id === userId) moneyIn  += tx.amount;
      } else if (tx.type === 'deposit')    moneyIn  += tx.amount;
      else if (tx.type === 'withdrawal')  moneyOut += tx.amount;
    });

    return { label, moneyIn: +moneyIn.toFixed(2), moneyOut: +moneyOut.toFixed(2) };
  });

 
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <Box sx={{ bgcolor: 'white', border: '1px solid #B0CE88', borderRadius: 2, p: 1.5, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
        <Typography fontSize={12} fontWeight={700} color="#0D2414" mb={0.5}>{label}</Typography>
        {payload.map((p: any) => (
          <Typography key={p.name} fontSize={12} color={p.color} fontWeight={600}>
            {p.name}: ${p.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Typography>
        ))}
      </Box>
    );
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight={700} fontSize={15}>Activity Overview</Typography>
            <Typography variant="caption" color="text.secondary">Money in vs money out</Typography>
          </Box>
          <ToggleButtonGroup value={view} exclusive onChange={(_, v) => v && setView(v)} size="small">
            <ToggleButton value="week"  sx={{ px: 1.75, fontSize: 12, fontWeight: 600, '&.Mui-selected': { bgcolor: '#9AD872', color: '#043915', borderColor: '#9AD872' } }}>7D</ToggleButton>
            <ToggleButton value="month" sx={{ px: 1.75, fontSize: 12, fontWeight: 600, '&.Mui-selected': { bgcolor: '#9AD872', color: '#043915', borderColor: '#9AD872' } }}>30D</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }} barSize={view === 'week' ? 18 : 8}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8F0E4" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false}
              tickFormatter={(v) => v === 0 ? '0' : `$${v}`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(154,216,114,0.08)' }} />
            <Legend iconType="circle" iconSize={8}
              formatter={(v) => <span style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>{v === 'moneyIn' ? 'Money In' : 'Money Out'}</span>} />
            <Bar dataKey="moneyIn"  name="moneyIn"  fill="#9AD872" radius={[4, 4, 0, 0]} />
            <Bar dataKey="moneyOut" name="moneyOut" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
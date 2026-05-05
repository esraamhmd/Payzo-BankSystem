'use client';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  totalSent: number;
  totalReceived: number;
  totalDeposited: number;
  totalWithdrawn: number;
}

const COLORS = ['#9AD872', '#468432', '#ef4444', '#f97316'];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: 'white', border: '1px solid #B0CE88', borderRadius: 2, p: 1.5, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
      <Typography fontSize={12} fontWeight={700} color={payload[0].payload.fill}>
        {payload[0].name}: ${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </Typography>
    </Box>
  );
};

export default function DonutChart({ totalSent, totalReceived, totalDeposited, totalWithdrawn }: Props) {
  const raw = [
    { name: 'Received',  value: totalReceived },
    { name: 'Deposited', value: totalDeposited },
    { name: 'Sent',      value: totalSent },
    { name: 'Withdrawn', value: totalWithdrawn },
  ];

  const data = raw.filter((d) => d.value > 0);
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} fontSize={15} mb={0.25}>Transaction Split</Typography>
        <Typography variant="caption" color="text.secondary">Breakdown of your activity</Typography>

        {total === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 210 }}>
            <Typography color="text.secondary" fontSize={14}>No transactions yet</Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={82}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(v) => (
                  <span style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>{v}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
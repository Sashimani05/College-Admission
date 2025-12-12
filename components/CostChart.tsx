import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CostOfAttendance } from '../types';

interface CostChartProps {
  cost: CostOfAttendance;
}

// Professional and vibrant color palette for up to 5 categories
const COLORS = ['#4A90E2', '#50E3C2', '#FFC107', '#E91E63', '#9C27B0']; 

const CostChart: React.FC<CostChartProps> = ({ cost }) => {
  // We'll visualize the breakdown of the total costs for a comprehensive view
  const data = [
    { name: 'Out-of-State Tuition', value: cost.outOfStateTuition },
    { name: 'Room & Board', value: cost.roomAndBoard },
    { name: 'Books & Supplies', value: cost.books },
    { name: 'Food Expenses', value: cost.food },
    { name: 'Travel Expenses', value: cost.travelExpenses },
  ].filter(item => item.value > 0); // Filter out zero-cost items

  if (data.length < 1) { // Changed from 2 to 1, to allow charting even a single cost component
    return <p className="text-center text-gray-400 mt-4">Not enough cost data to visualize a comparison.</p>;
  }

  return (
    <div style={{ width: '100%', height: 250 }} className="mt-6">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
              if (percent === 0) return null;
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
              const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
              return (
                <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="bold">
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={''} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'rgba(30, 41, 59, 0.9)', 
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              color: '#E2E8F0'
            }}
            itemStyle={{ color: '#E2E8F0' }}
            formatter={(value: number) => `$${value.toLocaleString()}`}
          />
          <Legend 
            wrapperStyle={{ color: '#fff', fontSize: '14px', paddingTop: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CostChart;
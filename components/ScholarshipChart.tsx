import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Scholarship } from '../types';

interface ScholarshipChartProps {
  scholarships: Scholarship[];
}

// A vibrant color palette for the chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const ScholarshipChart: React.FC<ScholarshipChartProps> = ({ scholarships }) => {
  if (!Array.isArray(scholarships) || scholarships.length === 0) {
    return null; // Don't render anything if there's no data
  }

  // Process data to count scholarships by type
  const typeCounts = scholarships.reduce((acc, scholarship) => {
    const type = scholarship.type || 'N/A';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(typeCounts).map(([name, value]) => ({
    name,
    value,
  }));

  if (data.length === 0) {
    return <p className="text-center text-gray-400 mt-6">No scholarship type data to visualize.</p>;
  }

  return (
    <div style={{ width: '100%', height: 300 }} className="mt-6">
      <h3 className="text-lg font-semibold text-white text-center mb-2">Scholarship Source Distribution</h3>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={90}
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
            formatter={(value: number) => `${value} ${value === 1 ? 'scholarship' : 'scholarships'}`}
          />
          <Legend
            wrapperStyle={{ color: '#fff', fontSize: '14px', paddingTop: '15px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScholarshipChart;
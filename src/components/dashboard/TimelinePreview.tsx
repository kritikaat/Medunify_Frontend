import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts';
import { useState } from 'react';

const data = [
  { date: 'Jan', hba1c: 5.8, cholesterol: 210, glucose: 95 },
  { date: 'Feb', hba1c: 5.9, cholesterol: 205, glucose: 98 },
  { date: 'Mar', hba1c: 6.1, cholesterol: 200, glucose: 102 },
  { date: 'Apr', hba1c: 6.3, cholesterol: 195, glucose: 108 },
  { date: 'May', hba1c: 6.5, cholesterol: 190, glucose: 112 },
  { date: 'Jun', hba1c: 6.9, cholesterol: 185, glucose: 118 },
];

const tabs = ['All', 'Blood Sugar', 'Lipids', 'Kidney'];

export function TimelinePreview() {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-card rounded-2xl border border-border p-6 shadow-green-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground">Health Timeline</h3>
          <p className="text-sm text-muted-foreground">Last 6 months</p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            
            {/* Reference Area for Normal Range */}
            <ReferenceArea y1={4} y2={5.7} fill="hsl(142, 71%, 45%)" fillOpacity={0.1} />
            
            {(activeTab === 'All' || activeTab === 'Blood Sugar') && (
              <Line
                type="monotone"
                dataKey="hba1c"
                stroke="hsl(142, 71%, 45%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(142, 71%, 45%)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: 'hsl(142, 71%, 45%)' }}
                name="HbA1c (%)"
              />
            )}
            {(activeTab === 'All' || activeTab === 'Lipids') && (
              <Line
                type="monotone"
                dataKey="cholesterol"
                stroke="hsl(160, 84%, 39%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(160, 84%, 39%)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: 'hsl(160, 84%, 39%)' }}
                name="Cholesterol"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">HbA1c</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span className="text-sm text-muted-foreground">Cholesterol</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div className="w-3 h-3 rounded bg-primary/20" />
          <span className="text-sm text-muted-foreground">Normal Range</span>
        </div>
      </div>
    </motion.div>
  );
}

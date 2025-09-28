"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface ActivityData {
  grade: string;
  averageScore: number;
}

interface ActivityChartProps {
  data?: ActivityData[];
}

const defaultData = [
  { grade: "Grade 1", averageScore: 20 },
  { grade: "Grade 2", averageScore: 35 },
  { grade: "Grade 3", averageScore: 25 },
  { grade: "Grade 4", averageScore: 85 },
  { grade: "Grade 5", averageScore: 45 },
  { grade: "Grade 6", averageScore: 55 },
  { grade: "Grade 7", averageScore: 40 },
  { grade: "Grade 8", averageScore: 65 },
  { grade: "Grade 9", averageScore: 50 },
  { grade: "Grade 10", averageScore: 60 },
]

export function ActivityChart({ data = defaultData }: ActivityChartProps) {
  // Transform data to match chart requirements and clean up grade names
  const chartData = data.map(item => ({
    name: item.grade.replace(/(\d+)st|(\d+)nd|(\d+)rd|(\d+)th/, '$1$2$3$4').replace('Grade', 'Grade'),
    value: item.averageScore
  }));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--primary)",
              border: "none",
              borderRadius: "8px",
              color: "var(--primary-foreground)",
              fontSize: "12px",
            }}
            formatter={(value) => [`${value}%`, "Activity"]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#colorValue)"
            dot={{ fill: "var(--primary)", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "var(--primary)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

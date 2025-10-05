"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, Label, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart"

export const description = "An interactive bar chart"

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
]

const defaultChartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Desktop",
    color: "var(--chart-2)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-1)",
  },
  users: {
    label: "Users",
    color: "#f97316",
  },
} satisfies ChartConfig

const performanceChartConfig = {
  excellent: {
    label: "Excellent",
    color: "var(--chart-1)",
  },
  good: {
    label: "Good",
    color: "var(--chart-2)",
  },
  normal: {
    label: "Normal",
    color: "var(--chart-3)",
  },
  dull: {
    label: "Dull",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

interface UserChartData {
  date: string;
  users: number;
  month: string;
}

export interface SubjectPerformanceData {
  subject: string;
  excellent?: number;
  good?: number;
  normal?: number;
  dull?: number;
  total?: number;
}

interface ChartBarInteractiveProps {
  userData?: UserChartData[];
  performanceData?: SubjectPerformanceData[];
}

export function ChartBarInteractive({ userData, performanceData }: ChartBarInteractiveProps) {
  // Use user data if provided, otherwise fall back to default chart data
  const hasUserData = userData && userData.length > 0;
  const hasPerformanceData = performanceData && performanceData.length > 0;

  type NormalizedPerformance = {
    subject: string;
    dull: number;
    normal: number;
    good: number;
    excellent: number;
    total: number;
  };

  const normalizedPerformanceData = React.useMemo<NormalizedPerformance[] | null>(() => {
    if (!hasPerformanceData || !performanceData) {
      return null;
    }

    return performanceData
      .filter((entry) => Boolean(entry?.subject))
      .map((entry) => {
        const dull = Number(entry.dull ?? 0);
        const normal = Number(entry.normal ?? 0);
        const good = Number(entry.good ?? 0);
        const excellent = Number(entry.excellent ?? 0);
        const total = entry.total ?? dull + normal + good + excellent;

        return {
          subject: entry.subject,
          dull,
          normal,
          good,
          excellent,
          total,
        };
      });
  }, [hasPerformanceData, performanceData]);

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof defaultChartConfig>(hasUserData ? "users" : "desktop")

  type Totals =
    | { kind: "performance"; totalSubjects: number; totalStudents: number }
    | { kind: "users"; users: number }
    | { kind: "devices"; desktop: number; mobile: number }

  const totals = React.useMemo<Totals>(() => {
    if (normalizedPerformanceData) {
      const aggregate = normalizedPerformanceData.reduce(
        (
          acc: { totalSubjects: number; totalStudents: number },
          curr
        ) => {
          acc.totalSubjects += 1;
          acc.totalStudents += curr.total ?? 0;
          return acc;
        },
        { totalSubjects: 0, totalStudents: 0 }
      );
      return { kind: "performance", ...aggregate };
    }

    if (hasUserData && userData) {
      return {
        kind: "users",
        users: userData.reduce((acc, curr) => acc + curr.users, 0),
      };
    }

    return {
      kind: "devices",
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
    };
  }, [userData, hasUserData, normalizedPerformanceData])

  const showPerformanceChart = Boolean(normalizedPerformanceData)

  const chartConfig = showPerformanceChart ? performanceChartConfig : defaultChartConfig
  const xAxisKey = showPerformanceChart ? "subject" : hasUserData ? "month" : "date"

  const chartElement = (
    <ChartContainer
      config={chartConfig}
      className={showPerformanceChart ? "min-h-[320px] w-full" : "aspect-auto h-[250px] w-full"}
    >
      <BarChart
        accessibilityLayer
        data={showPerformanceChart && normalizedPerformanceData ? normalizedPerformanceData : hasUserData && userData ? userData : chartData}
        margin={{
          top: 24,
          left: showPerformanceChart ? 24 : 12,
          right: 24,
          bottom: showPerformanceChart ? 72 : 16,
        }}
        barCategoryGap={showPerformanceChart ? "20%" : undefined}
        barGap={showPerformanceChart ? 8 : undefined}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey={xAxisKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={showPerformanceChart ? 12 : 20}
          interval={0}
          angle={showPerformanceChart ? -35 : 0}
          textAnchor={showPerformanceChart ? "end" : "middle"}
          height={showPerformanceChart ? 72 : undefined}
          tickFormatter={(value) => {
            if (showPerformanceChart) {
              return value;
            }
            if (typeof value === "string" && value.includes(" ")) {
              return value;
            }
            const date = new Date(value)
            return date.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })
          }}
        >
          {showPerformanceChart ? (
            <Label
              value="Subjects"
              offset={-36}
              position="insideBottom"
              style={{
                fill: "hsl(var(--muted-foreground))",
                fontSize: 12,
                fontWeight: 500,
              }}
            />
          ) : null}
        </XAxis>
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={6}
          width={showPerformanceChart ? 56 : undefined}
          tickFormatter={(value) => (showPerformanceChart ? Math.floor(Number(value)) : value)}
        >
          {showPerformanceChart ? (
            <Label
              angle={-90}
              position="insideLeft"
              offset={-24}
              style={{
                fill: "hsl(var(--muted-foreground))",
                fontSize: 12,
                fontWeight: 500,
              }}
              value="Number of Students"
            />
          ) : null}
        </YAxis>
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="w-[150px]"
              nameKey={showPerformanceChart ? undefined : hasUserData ? "users" : "views"}
              labelFormatter={(value) => {
                if (showPerformanceChart) {
                  return value as string;
                }
                if (typeof value === "string" && value.includes(" ")) {
                  return value;
                }
                return new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              }}
            />
          }
        />
        {showPerformanceChart && (
          <>
            <Bar dataKey="dull" name={performanceChartConfig.dull.label} fill="var(--color-dull)" radius={[6, 6, 0, 0]} barSize={18} />
            <Bar dataKey="normal" name={performanceChartConfig.normal.label} fill="var(--color-normal)" radius={[6, 6, 0, 0]} barSize={18} />
            <Bar dataKey="good" name={performanceChartConfig.good.label} fill="var(--color-good)" radius={[6, 6, 0, 0]} barSize={18} />
            <Bar dataKey="excellent" name={performanceChartConfig.excellent.label} fill="var(--color-excellent)" radius={[6, 6, 0, 0]} barSize={18} />
          </>
        )}
        {showPerformanceChart ? (
          <ChartLegend content={<ChartLegendContent className="justify-start" />} />
        ) : null}
        {!showPerformanceChart && (
          <Bar dataKey={hasUserData ? "users" : activeChart} fill={`var(--color-${hasUserData ? "users" : activeChart})`} />
        )}
      </BarChart>
    </ChartContainer>
  )

  if (showPerformanceChart && normalizedPerformanceData) {
    return (
      <Card className="border-0 bg-transparent shadow-none">
        <CardContent className="px-0 pb-0 sm:p-0">
          {chartElement}
        </CardContent>
      </Card>
    )
  }

  const userTotals = totals.kind === "users" ? totals : null
  const deviceTotals = totals.kind === "devices" ? totals : null

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          {hasUserData ? (
            <CardTitle className="text-base font-semibold">User Activity</CardTitle>
          ) : (
            <CardTitle className="text-base font-semibold">Device Breakdown</CardTitle>
          )}
        </div>
        <div className="flex">
          {hasUserData && userData && userTotals ? (
            <button
              data-active={true}
              className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:px-8 sm:py-6"
              onClick={() => setActiveChart("users")}
            >
              <span className="text-muted-foreground text-xs">
                {defaultChartConfig.users.label}
              </span>
              <span className="text-lg leading-none font-bold sm:text-3xl">
                {userTotals.users.toLocaleString()}
              </span>
            </button>
          ) : deviceTotals ? (
            (["desktop", "mobile"] as const).map((chart) => (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {defaultChartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {deviceTotals[chart].toLocaleString()}
                </span>
              </button>
            ))
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {chartElement}
      </CardContent>
    </Card>
  )
}

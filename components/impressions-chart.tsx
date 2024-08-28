"use client"

import { useEffect, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"
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
  ChartLegendContent,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { AdEvent } from "@/lib/types/interaction.type"
import { format } from "date-fns"

type ImpressionChartProps = {
  clicks: AdEvent[]
  impressions: AdEvent[]
}

const chartConfig = {
  impressions: {
    label: "Impressions",
    color: "#f59e0b",
  },
  clicks: {
    label: "Clicks",
    color: "#36A2EB",
  },
} satisfies ChartConfig

export function ImpressionChart({ clicks, impressions }: ImpressionChartProps) {
  const [chartData, setChartData] = useState<any>([])

  useEffect(() => {
    const data = processData(impressions, clicks)
    setChartData(data)
  }, [clicks, impressions])

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Ad Performance</CardTitle>
        <CardDescription>Comparing impressions and clicks</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="impressions"
              type="natural"
              fill="var(--color-impressions)"
              fillOpacity={0.4}
              stroke="var(--color-impressions)"
              stackId="a"
            />
            <Area
              dataKey="clicks"
              type="natural"
              fill="var(--color-clicks)"
              fillOpacity={0.4}
              stroke="var(--color-clicks)"
              stackId="a"
            />
            <Legend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function processData(impressions: AdEvent[], clicks: AdEvent[]) {
  const dataMap = new Map<
    string,
    { date: string; impressions: number; clicks: number }
  >()

  const toDate = (timestamp: {
    _seconds: number
    _nanoseconds: number
  }): Date => {
    return new Date(timestamp._seconds * 1000)
  }

  impressions.sort(
    (a, b) => toDate(a.timestamp!).getTime() - toDate(b.timestamp!).getTime()
  )
  clicks.sort(
    (a, b) => toDate(a.timestamp!).getTime() - toDate(b.timestamp!).getTime()
  )

  impressions.forEach(({ timestamp }: AdEvent) => {
    const date = format(toDate(timestamp!), "yyyy-MM-dd")
    if (!dataMap.has(date)) {
      dataMap.set(date, { date, impressions: 0, clicks: 0 })
    }
    const entry = dataMap.get(date)!
    entry.impressions += 1
    dataMap.set(date, entry)
  })

  clicks.forEach(({ timestamp }: AdEvent) => {
    const date = format(toDate(timestamp!), "yyyy-MM-dd")
    if (!dataMap.has(date)) {
      dataMap.set(date, { date, impressions: 0, clicks: 0 })
    }
    const entry = dataMap.get(date)!
    entry.clicks += 1
    dataMap.set(date, entry)
  })

  return Array.from(dataMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
}

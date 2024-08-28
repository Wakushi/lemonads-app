"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import {
  Bar,
  BarChart,
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
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

export function AdEventsBarChart({
  clicks,
  impressions,
}: ImpressionChartProps) {
  const [chartData, setChartData] = useState<any>([])

  useEffect(() => {
    const data = processData(impressions, clicks)
    setChartData(data)
  }, [clicks, impressions])

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Ad Performance - Bar Chart</CardTitle>
        <CardDescription>Comparing impressions and clicks</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <Tooltip content={<ChartTooltipContent indicator="dashed" />} />
            <Bar
              dataKey="impressions"
              fill="var(--color-impressions)"
              radius={4}
            />
            <Bar dataKey="clicks" fill="var(--color-clicks)" radius={4} />
            <Legend />
          </BarChart>
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

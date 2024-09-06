"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { format } from "date-fns"

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Conversion } from "@/lib/types/conversion.type"

const chartConfig = {
  conversions: {
    label: "Conversions",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function ConversionsChart({
  conversions,
}: {
  conversions: Conversion[]
}) {
  // Format the conversion data to work with the chart
  const chartData = conversions.map((conversion) => ({
    date: format(new Date(conversion.timestamp._seconds * 1000), "MMM d"),
    conversions: 1,
  }))
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversions Over Time</CardTitle>
        <CardDescription>
          Displaying conversions based on timestamps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="conversions"
              type="monotone"
              stroke="var(--color-conversions)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total conversions over time
        </div>
      </CardFooter>
    </Card>
  )
}

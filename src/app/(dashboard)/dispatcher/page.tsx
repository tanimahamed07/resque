"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Activity,
  Clock,
  CheckCircle2,
  Send,
  Users,
  ShieldCheck,
  TrendingUp,
  FileText,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
} from "recharts";
import { getDispatcherDashboard } from "@/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const emergencyConfig = {
  value: { label: "Emergencies" },
  pending: { label: "Pending", color: "var(--chart-1)" },
  assigned: { label: "Assigned", color: "var(--chart-2)" },
  completed: { label: "Completed", color: "var(--chart-3)" },
} satisfies ChartConfig;

const dispatchConfig = {
  value: { label: "Dispatches" },
  pending: { label: "Pending", color: "var(--chart-1)" },
  accepted: { label: "Accepted", color: "var(--chart-2)" },
  completed: { label: "Completed", color: "var(--chart-3)" },
} satisfies ChartConfig;

const radarConfig = {
  value: { label: "Count", color: "var(--chart-1)" },
} satisfies ChartConfig;

export default function DispatcherPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dispatcher-dashboard"],
    queryFn: getDispatcherDashboard,
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">
          Failed to load dashboard data
        </p>
      </div>
    );
  }

  const analytics = data.data;

  const emergencyStatusData = [
    {
      key: "pending",
      value: analytics.emergencies.pending,
      fill: "var(--color-pending)",
    },
    {
      key: "assigned",
      value: analytics.emergencies.assigned,
      fill: "var(--color-assigned)",
    },
    {
      key: "completed",
      value: analytics.emergencies.completed,
      fill: "var(--color-completed)",
    },
  ];

  const dispatchStatusData = [
    {
      key: "pending",
      value: analytics.dispatches.pending,
      fill: "var(--color-pending)",
    },
    {
      key: "accepted",
      value: analytics.dispatches.accepted,
      fill: "var(--color-accepted)",
    },
    {
      key: "completed",
      value: analytics.dispatches.completed,
      fill: "var(--color-completed)",
    },
  ];

  const activityRadarData = [
    {
      metric: "Emergencies",
      value: analytics.emergencies.total,
    },
    {
      metric: "Dispatches",
      value: analytics.dispatches.total,
    },
    {
      metric: "Ambulances",
      value: analytics.resources.availableAmbulances,
    },
    {
      metric: "Drivers",
      value: analytics.resources.availableDrivers,
    },
    {
      metric: "Units Ready",
      value: analytics.resources.dispatchableDrivers,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">
          Dispatcher Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitor emergencies, manage dispatches, and coordinate resources
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Emergencies
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.emergencies.total}
            </div>
            <p className="text-xs text-muted-foreground">
              All emergency requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Dispatches
            </CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.dispatches.total}
            </div>
            <p className="text-xs text-muted-foreground">
              All dispatch operations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Units
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.resources.dispatchableDrivers}
            </div>
            <p className="text-xs text-muted-foreground">Ready for dispatch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Actions
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.emergencies.pending}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting dispatch</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Emergency Status - Pie */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Emergency Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer
              config={emergencyConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel nameKey="key" />}
                />
                <Pie data={emergencyStatusData} dataKey="value" nameKey="key" />
                <ChartLegend content={<ChartLegendContent nameKey="key" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Dispatch Status - Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Dispatch Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={dispatchConfig}
              className="h-[300px] w-full"
            >
              <BarChart data={dispatchStatusData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="key"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(v) =>
                    dispatchConfig[v as keyof typeof dispatchConfig].label
                  }
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel nameKey="key" />}
                />
                <Bar dataKey="value" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Resources - Donut */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Resource Availability
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer
              config={{
                value: { label: "Resources" },
                ambulances: {
                  label: "Ambulances",
                  color: "var(--chart-1)",
                },
                drivers: {
                  label: "Drivers",
                  color: "var(--chart-2)",
                },
                units: {
                  label: "Ready Units",
                  color: "var(--chart-3)",
                },
              }}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel nameKey="key" />}
                />
                <Pie
                  data={[
                    {
                      key: "ambulances",
                      value: analytics.resources.availableAmbulances,
                      fill: "var(--color-ambulances)",
                    },
                    {
                      key: "drivers",
                      value: analytics.resources.availableDrivers,
                      fill: "var(--color-drivers)",
                    },
                    {
                      key: "units",
                      value: analytics.resources.dispatchableDrivers,
                      fill: "var(--color-units)",
                    },
                  ]}
                  dataKey="value"
                  nameKey="key"
                  innerRadius={65}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        const total =
                          analytics.resources.availableAmbulances +
                          analytics.resources.availableDrivers +
                          analytics.resources.dispatchableDrivers;
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {total}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground text-xs"
                            >
                              Total
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="key" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Activity Overview - Radar */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Dispatch Activity Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer
              config={radarConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <RadarChart data={activityRadarData}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <PolarAngleAxis dataKey="metric" />
                <PolarGrid />
                <Radar
                  dataKey="value"
                  fill="var(--color-value)"
                  fillOpacity={0.6}
                  dot={{ r: 4, fillOpacity: 1 }}
                />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Emergency Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Emergency Status Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Pending Emergencies</p>
                  <p className="text-xs text-muted-foreground">
                    Awaiting dispatch
                  </p>
                </div>
              </div>
              <span className="text-2xl font-bold text-orange-600">
                {analytics.emergencies.pending}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <Send className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Assigned Emergencies</p>
                  <p className="text-xs text-muted-foreground">
                    Dispatched ambulances
                  </p>
                </div>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {analytics.emergencies.assigned}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Completed Emergencies</p>
                  <p className="text-xs text-muted-foreground">
                    Successfully resolved
                  </p>
                </div>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {analytics.emergencies.completed}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Dispatch Details - Horizontal Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Dispatch Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={dispatchConfig}
              className="h-[280px] w-full"
            >
              <BarChart
                data={dispatchStatusData}
                layout="vertical"
                accessibilityLayer
                margin={{ left: 0 }}
              >
                <XAxis dataKey="value" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel nameKey="key" />}
                />
                <Bar dataKey="value" radius={5} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alert Banner if low resources */}
      {(analytics.resources.dispatchableDrivers === 0 ||
        analytics.emergencies.pending >
          analytics.resources.dispatchableDrivers) && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-destructive">
                Resource Alert
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {analytics.resources.dispatchableDrivers === 0
                  ? "No dispatchable units currently available. Check driver and ambulance availability."
                  : "Pending emergencies exceed available dispatchable units. Consider allocating more resources."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

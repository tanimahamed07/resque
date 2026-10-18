"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Users,
  AlertCircle,
  Ambulance,
  UserCheck,
  DollarSign,
  TrendingUp,
  Activity,
  FileCheck,
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
  YAxis,
} from "recharts";
import { getAdminDashboard } from "@/api";
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

// Tailwind v3 (old shadcn) hole "var(--chart-N)" er jaygay "hsl(var(--chart-N))" use koro
const roleConfig = {
  value: { label: "Users" },
  admins: { label: "Admins", color: "var(--chart-1)" },
  dispatchers: { label: "Dispatchers", color: "var(--chart-2)" },
  drivers: { label: "Drivers", color: "var(--chart-3)" },
  callers: { label: "Callers", color: "var(--chart-4)" },
} satisfies ChartConfig;

const emergencyConfig = {
  value: { label: "Emergencies" },
  pending: { label: "Pending", color: "var(--chart-1)" },
  completed: { label: "Completed", color: "var(--chart-2)" },
} satisfies ChartConfig;

const ambulanceConfig = {
  value: { label: "Ambulances" },
  available: { label: "Available", color: "var(--chart-2)" },
  onTrip: { label: "On Trip", color: "var(--chart-1)" },
} satisfies ChartConfig;

const radarConfig = {
  value: { label: "Current", color: "var(--chart-1)" },
} satisfies ChartConfig;

export default function AdminPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
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

  const userRoleData = [
    {
      key: "admins",
      value: analytics.users.admins,
      fill: "var(--color-admins)",
    },
    {
      key: "dispatchers",
      value: analytics.users.dispatchers,
      fill: "var(--color-dispatchers)",
    },
    {
      key: "drivers",
      value: analytics.users.drivers,
      fill: "var(--color-drivers)",
    },
    {
      key: "callers",
      value: analytics.users.callers,
      fill: "var(--color-callers)",
    },
  ];

  const emergencyStatusData = [
    {
      key: "pending",
      value: analytics.emergencies.pending,
      fill: "var(--color-pending)",
    },
    {
      key: "completed",
      value: analytics.emergencies.completed,
      fill: "var(--color-completed)",
    },
  ];

  const ambulanceStatusData = [
    {
      key: "available",
      value: analytics.ambulances.available,
      fill: "var(--color-available)",
    },
    {
      key: "onTrip",
      value: analytics.ambulances.onTrip,
      fill: "var(--color-onTrip)",
    },
  ];

  const activityRadarData = [
    { metric: "Users", value: analytics.users.total },
    { metric: "Emergencies", value: analytics.emergencies.total },
    { metric: "Ambulances", value: analytics.ambulances.total },
    { metric: "Drivers", value: analytics.drivers.approved },
    {
      metric: "Revenue (K)",
      value: Math.round(Number(analytics.revenue.total) / 1000),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Overview of platform analytics and system statistics
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.users.total}</div>
            <p className="text-xs text-muted-foreground">
              All registered users
            </p>
          </CardContent>
        </Card>

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
              Total Ambulances
            </CardTitle>
            <Ambulance className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.ambulances.total}
            </div>
            <p className="text-xs text-muted-foreground">Fleet size</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{Number(analytics.revenue.total).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.revenue.completedPayments} payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Roles - Pie */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Roles Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer
              config={roleConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel nameKey="key" />}
                />
                <Pie data={userRoleData} dataKey="value" nameKey="key" />
                <ChartLegend content={<ChartLegendContent nameKey="key" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Emergency Status - Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Emergency Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={emergencyConfig}
              className="h-[300px] w-full"
            >
              <BarChart data={emergencyStatusData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="key"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(v) =>
                    emergencyConfig[v as keyof typeof emergencyConfig].label
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

        {/* Ambulance Fleet - Donut */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ambulance className="h-5 w-5" />
              Ambulance Fleet Status
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer
              config={ambulanceConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel nameKey="key" />}
                />
                <Pie
                  data={ambulanceStatusData}
                  dataKey="value"
                  nameKey="key"
                  innerRadius={65}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
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
                              {analytics.ambulances.total}
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

        {/* Platform Activity - Radar */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Platform Activity Overview
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
        {/* Driver Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Driver Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <UserCheck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Approved Drivers</p>
                  <p className="text-xs text-muted-foreground">
                    Active certified drivers
                  </p>
                </div>
              </div>
              <span className="text-2xl font-bold">
                {analytics.drivers.approved}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <FileCheck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Pending Applications</p>
                  <p className="text-xs text-muted-foreground">
                    Awaiting approval
                  </p>
                </div>
              </div>
              <span className="text-2xl font-bold text-destructive">
                {analytics.drivers.pendingApplications}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* User Distribution - Horizontal Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              User Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={roleConfig} className="h-[200px] w-full">
              <BarChart
                data={userRoleData}
                layout="vertical"
                accessibilityLayer
                margin={{ left: 0 }}
              >
                <YAxis
                  dataKey="key"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(v) =>
                    roleConfig[v as keyof typeof roleConfig].label
                  }
                />
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
    </div>
  );
}

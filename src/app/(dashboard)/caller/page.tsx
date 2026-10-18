"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  Plus,
  List,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Car,
  DollarSign,
  Wallet,
  CreditCard,
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
import { getCallerDashboard } from "@/api";
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
  value: { label: "Requests" },
  pending: { label: "Pending", color: "var(--chart-1)" },
  completed: { label: "Completed", color: "var(--chart-2)" },
  cancelled: { label: "Cancelled", color: "var(--chart-3)" },
} satisfies ChartConfig;

const tripConfig = {
  value: { label: "Trips" },
  total: { label: "Total", color: "var(--chart-1)" },
  completed: { label: "Completed", color: "var(--chart-2)" },
} satisfies ChartConfig;

const radarConfig = {
  value: { label: "Count", color: "var(--chart-1)" },
} satisfies ChartConfig;

export default function CallerPage() {
  const {
    data: analytics,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["caller-dashboard"],
    queryFn: getCallerDashboard,
    staleTime: 0,
    refetchOnMount: "always",
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (isError || !analytics?.data) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">
          Failed to load dashboard data
        </p>
      </div>
    );
  }

  const stats = analytics.data;

  // Safely merge stats with defaults
  const dashboardStats = {
    emergencies: {
      total: stats?.emergencies?.total ?? 0,
      pending: stats?.emergencies?.pending ?? 0,
      completed: stats?.emergencies?.completed ?? 0,
      cancelled: stats?.emergencies?.cancelled ?? 0,
    },
    trips: {
      total: stats?.trips?.total ?? 0,
      completed: stats?.trips?.completed ?? 0,
    },
    payments: {
      totalSpending: stats?.payments?.totalSpending ?? 0,
      completedPayments: stats?.payments?.completedPayments ?? 0,
      pendingPayments: stats?.payments?.pendingPayments ?? 0,
    },
  };

  const emergencyStatusData = [
    {
      key: "pending",
      value: dashboardStats.emergencies.pending,
      fill: "var(--color-pending)",
    },
    {
      key: "completed",
      value: dashboardStats.emergencies.completed,
      fill: "var(--color-completed)",
    },
    {
      key: "cancelled",
      value: dashboardStats.emergencies.cancelled,
      fill: "var(--color-cancelled)",
    },
  ];

  const tripStatusData = [
    {
      key: "total",
      value: dashboardStats.trips.total,
      fill: "var(--color-total)",
    },
    {
      key: "completed",
      value: dashboardStats.trips.completed,
      fill: "var(--color-completed)",
    },
  ];

  const activityRadarData = [
    {
      metric: "Emergencies",
      value: dashboardStats.emergencies.total,
    },
    {
      metric: "Completed",
      value: dashboardStats.emergencies.completed,
    },
    {
      metric: "Trips",
      value: dashboardStats.trips.total,
    },
    {
      metric: "Payments",
      value: dashboardStats.payments.completedPayments,
    },
    {
      metric: "Spending (K)",
      value: Math.round(dashboardStats.payments.totalSpending / 1000),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">
          Caller Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Request emergency ambulance services and track your requests
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/caller/request"
          className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:border-destructive/50 hover:shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-destructive text-destructive-foreground">
              <Plus className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">Request Ambulance</h3>
              <p className="text-sm text-muted-foreground">
                Submit a new emergency ambulance request
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/caller/my-emergencies"
          className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <List className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">My Emergency Requests</h3>
              <p className="text-sm text-muted-foreground">
                View and track all your emergency requests
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.emergencies.total}
            </div>
            <p className="text-xs text-muted-foreground">
              All emergency requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.trips.total}
            </div>
            <p className="text-xs text-muted-foreground">All ambulance trips</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Spending
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{dashboardStats.payments.totalSpending.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.payments.completedPayments} payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {dashboardStats.payments.pendingPayments}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
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
              className="mx-auto aspect-square max-h-75"
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

        {/* Trip Status - Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Trip Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={tripConfig} className="h-75 w-full">
              <BarChart data={tripStatusData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="key"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(v) =>
                    tripConfig[v as keyof typeof tripConfig].label
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

        {/* Payment Overview - Donut */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Payment Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer
              config={{
                value: { label: "Payments" },
                completed: {
                  label: "Completed",
                  color: "var(--chart-2)",
                },
                pending: {
                  label: "Pending",
                  color: "var(--chart-1)",
                },
              }}
              className="mx-auto aspect-square max-h-75"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel nameKey="key" />}
                />
                <Pie
                  data={[
                    {
                      key: "completed",
                      value: dashboardStats.payments.completedPayments,
                      fill: "var(--color-completed)",
                    },
                    {
                      key: "pending",
                      value: dashboardStats.payments.pendingPayments,
                      fill: "var(--color-pending)",
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
                              {dashboardStats.payments.completedPayments +
                                dashboardStats.payments.pendingPayments}
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
              Activity Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer
              config={radarConfig}
              className="mx-auto aspect-square max-h-75"
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
              Emergency Request Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Pending Requests</p>
                  <p className="text-xs text-muted-foreground">
                    Awaiting response
                  </p>
                </div>
              </div>
              <span className="text-2xl font-bold text-orange-600">
                {dashboardStats.emergencies.pending}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Completed Requests</p>
                  <p className="text-xs text-muted-foreground">
                    Successfully resolved
                  </p>
                </div>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {dashboardStats.emergencies.completed}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Cancelled Requests</p>
                  <p className="text-xs text-muted-foreground">Not completed</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-red-600">
                {dashboardStats.emergencies.cancelled}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details - Horizontal Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Amount" },
                completed: {
                  label: "Completed Payments",
                  color: "var(--chart-2)",
                },
                pending: {
                  label: "Pending Payments",
                  color: "var(--chart-1)",
                },
              }}
              className="h-[280px] w-full"
            >
              <BarChart
                data={[
                  {
                    key: "completed",
                    value: dashboardStats.payments.completedPayments,
                    fill: "var(--color-completed)",
                  },
                  {
                    key: "pending",
                    value: dashboardStats.payments.pendingPayments,
                    fill: "var(--color-pending)",
                  },
                ]}
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

      {/* Info Section */}
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
        <div className="flex items-start gap-3">
          <Activity className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-destructive">
              Emergency Hotline: 999
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              In case of life-threatening emergency, call 999 immediately while
              submitting an ambulance request through this platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

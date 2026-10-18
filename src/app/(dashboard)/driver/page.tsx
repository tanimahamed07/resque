"use client";

import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  XCircle,
  Activity,
  Car,
  DollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
  ThumbsUp,
  Send,
  FileText,
  Ambulance,
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
import {
  useGetDriverProfile,
  useDriverStatusUpdate,
} from "@/hooks/driver.hooks";
import { getDriverDashboard } from "@/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const dispatchConfig = {
  value: { label: "Dispatches" },
  completed: { label: "Completed", color: "var(--chart-2)" },
  accepted: { label: "Accepted", color: "var(--chart-1)" },
  pending: { label: "Pending", color: "var(--chart-3)" },
} satisfies ChartConfig;

const radarConfig = {
  value: { label: "Performance", color: "var(--chart-1)" },
} satisfies ChartConfig;

export default function DriverPage() {
  const { data: driverProfile, isLoading: profileLoading } =
    useGetDriverProfile();
  const statusUpdate = useDriverStatusUpdate();

  const {
    data: analytics,
    isLoading: analyticsLoading,
    isError,
  } = useQuery({
    queryKey: ["driver-dashboard"],
    queryFn: getDriverDashboard,
  });

  const driver = driverProfile?.data;
  const isAvailable = driver?.isAvailable ?? false;
  const stats = analytics?.data;

  // Safely merge stats with defaults - matching actual API structure
  const dashboardStats = {
    trips: {
      total: stats?.trips?.total ?? 0,
      completed: stats?.trips?.completed ?? 0,
    },
    dispatches: {
      total: stats?.dispatches?.total ?? 0,
      pending: stats?.dispatches?.pending ?? 0,
      accepted: stats?.dispatches?.accepted ?? 0,
      completed: stats?.dispatches?.completed ?? 0,
    },
    earnings: {
      total: Number(stats?.earnings?.total ?? 0),
      completedPayments: stats?.earnings?.completedPayments ?? 0,
    },
    profile: {
      hasAmbulance: stats?.profile?.hasAmbulance ?? false,
      isAvailable: stats?.profile?.isAvailable ?? false,
      approvalStatus: stats?.profile?.approvalStatus ?? "PENDING",
      ambulance: stats?.profile?.ambulance ?? null,
    },
  };

  // Calculate additional metrics
  const completionRate =
    dashboardStats.trips.total > 0
      ? (dashboardStats.trips.completed / dashboardStats.trips.total) * 100
      : 0;

  const acceptanceRate =
    dashboardStats.dispatches.total > 0
      ? ((dashboardStats.dispatches.accepted +
          dashboardStats.dispatches.completed) /
          dashboardStats.dispatches.total) *
        100
      : 0;

  const inProgressTrips =
    dashboardStats.trips.total - dashboardStats.trips.completed;

  const dispatchStatusData = [
    {
      key: "completed",
      value: dashboardStats.dispatches.completed,
      fill: "var(--color-completed)",
    },
    {
      key: "accepted",
      value: dashboardStats.dispatches.accepted,
      fill: "var(--color-accepted)",
    },
    {
      key: "pending",
      value: dashboardStats.dispatches.pending,
      fill: "var(--color-pending)",
    },
  ];

  const performanceRadarData = [
    {
      metric: "Acceptance",
      value: acceptanceRate,
    },
    {
      metric: "Completion",
      value: completionRate,
    },
    {
      metric: "Total Trips",
      value: Math.min((dashboardStats.trips.total / 20) * 100, 100),
    },
    {
      metric: "Completed",
      value: Math.min((dashboardStats.trips.completed / 20) * 100, 100),
    },
    {
      metric: "Earnings (K)",
      value: Math.min((dashboardStats.earnings.total / 50000) * 100, 100),
    },
  ];

  const handleStatusToggle = async () => {
    try {
      await statusUpdate.mutateAsync(!isAvailable);
      toast.add({
        type: "success",
        title: "Status Updated",
        description: `You are now ${!isAvailable ? "available" : "unavailable"} for duty`,
      });
    } catch (error: any) {
      toast.add({
        type: "error",
        title: "Update Failed",
        description: error?.message || "Failed to update duty status",
      });
    }
  };

  if (analyticsLoading || profileLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">
          Driver Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your duty status, track trips, and monitor your performance
        </p>
      </div>

      {/* Duty Status Card */}
      {!profileLoading && driver && (
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                  isAvailable
                    ? "bg-green-500/10 text-green-600"
                    : "bg-gray-500/10 text-gray-600"
                }`}
              >
                {isAvailable ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <XCircle className="h-6 w-6" />
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Duty Status</h3>
                  <Badge variant={isAvailable ? "success" : "secondary"}>
                    {isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {isAvailable
                    ? "You are currently available for emergency assignments"
                    : "You are currently unavailable for emergency assignments"}
                </p>
              </div>
            </div>
            <Button
              onClick={handleStatusToggle}
              disabled={statusUpdate.isPending}
              variant={isAvailable ? "outline" : "default"}
              className="sm:shrink-0"
            >
              {statusUpdate.isPending
                ? "Updating..."
                : isAvailable
                  ? "Go Off Duty"
                  : "Go On Duty"}
            </Button>
          </div>
        </div>
      )}

      {/* Ambulance Info Card */}
      {!profileLoading && dashboardStats.profile.ambulance && (
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
              <Ambulance className="h-6 w-6" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Assigned Ambulance</h3>
                <Badge
                  variant={
                    dashboardStats.profile.ambulance.status === "AVAILABLE"
                      ? "success"
                      : "secondary"
                  }
                >
                  {dashboardStats.profile.ambulance.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Ambulance Number</p>
                  <p className="font-medium">
                    {dashboardStats.profile.ambulance.ambulanceNumber}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Vehicle Type</p>
                  <p className="font-medium">
                    {dashboardStats.profile.ambulance.vehicleType}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border p-12">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-muted-foreground">
            Failed to load dashboard analytics
          </p>
        </div>
      )}

      {/* Analytics Sections */}
      {!isError && (
        <>
          {/* Quick Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Trips
                </CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardStats.trips.total}
                </div>
                <p className="text-xs text-muted-foreground">All time trips</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Trips
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {dashboardStats.trips.completed}
                </div>
                <p className="text-xs text-muted-foreground">
                  Successfully finished
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Earnings
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ৳{dashboardStats.earnings.total.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  All time earnings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Payments
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {dashboardStats.earnings.completedPayments}
                </div>
                <p className="text-xs text-muted-foreground">
                  Successful transactions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Dispatch Status - Pie */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Dispatch Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <ChartContainer
                  config={dispatchConfig}
                  className="mx-auto aspect-square max-h-[300px]"
                >
                  <PieChart>
                    <ChartTooltip
                      content={<ChartTooltipContent hideLabel nameKey="key" />}
                    />
                    <Pie
                      data={dispatchStatusData}
                      dataKey="value"
                      nameKey="key"
                    />
                    <ChartLegend
                      content={<ChartLegendContent nameKey="key" />}
                    />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Dispatch Status - Bar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Dispatch Statistics
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

            {/* Trips - Donut */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Trip Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <ChartContainer
                  config={{
                    value: { label: "Trips" },
                    completed: {
                      label: "Completed",
                      color: "var(--chart-2)",
                    },
                    inProgress: {
                      label: "In Progress",
                      color: "var(--chart-1)",
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
                          key: "completed",
                          value: dashboardStats.trips.completed,
                          fill: "var(--color-completed)",
                        },
                        {
                          key: "inProgress",
                          value: inProgressTrips,
                          fill: "var(--color-inProgress)",
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
                                  {dashboardStats.trips.total}
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
                    <ChartLegend
                      content={<ChartLegendContent nameKey="key" />}
                    />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Performance - Radar */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <ChartContainer
                  config={radarConfig}
                  className="mx-auto aspect-square max-h-[300px]"
                >
                  <RadarChart data={performanceRadarData}>
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
            {/* Dispatch Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Dispatch Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">
                        Completed Dispatches
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Finished trips
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {dashboardStats.dispatches.completed}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
                  <div className="flex items-center gap-3">
                    <ThumbsUp className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Accepted Dispatches</p>
                      <p className="text-xs text-muted-foreground">
                        Confirmed trips
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {dashboardStats.dispatches.accepted}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium">Pending Dispatches</p>
                      <p className="text-xs text-muted-foreground">
                        Awaiting response
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-orange-600">
                    {dashboardStats.dispatches.pending}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: { label: "Rate" },
                    acceptance: {
                      label: "Acceptance Rate",
                      color: "var(--chart-2)",
                    },
                    completion: {
                      label: "Completion Rate",
                      color: "var(--chart-1)",
                    },
                  }}
                  className="h-[280px] w-full"
                >
                  <BarChart
                    data={[
                      {
                        key: "acceptance",
                        value: acceptanceRate,
                        fill: "var(--color-acceptance)",
                      },
                      {
                        key: "completion",
                        value: completionRate,
                        fill: "var(--color-completion)",
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

          {/* Performance Alert */}
          {(acceptanceRate < 50 || completionRate < 70) &&
            dashboardStats.dispatches.total > 0 && (
              <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 text-orange-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">
                      Performance Alert
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {acceptanceRate < 50 &&
                        "Your acceptance rate is below 50%. Consider accepting more dispatch requests to improve your standing."}
                      {completionRate < 70 &&
                        acceptanceRate >= 50 &&
                        "Your completion rate is below 70%. Focus on completing accepted trips to maintain good standing."}
                    </p>
                  </div>
                </div>
              </div>
            )}
        </>
      )}
    </div>
  );
}

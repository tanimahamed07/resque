"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TablePagination from "@/components/ui/table-pagination";
import EmergenciesTable from "@/components/models/emergencies/emergencies-table";

import { useGetMyEmergencies } from "@/hooks/emergency.hooks";
import useDebounce from "@/hooks/debounce.hook";
import type {
  EmergencyQueryParams,
  EmergencyStatus,
} from "@/types/emergency.type";

const LIMIT = 10;

const STATUS_TABS: { value: EmergencyStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Status" },
  { value: "PENDING", label: "Pending" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "EN_ROUTE", label: "En Route" },
  { value: "PICKED_UP", label: "Picked Up" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function MyEmergenciesPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<EmergencyStatus | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const params: EmergencyQueryParams = { page, limit: LIMIT };
  if (status !== "ALL") params.status = status;
  if (debouncedSearchTerm) params.searchTerm = debouncedSearchTerm;

  const {
    data: response,
    isLoading,
    isFetching,
    error,
  } = useGetMyEmergencies(params);

  const emergencies = response?.data?.data ?? [];
  const meta = response?.data?.meta;

  const handleStatusChange = (value: EmergencyStatus | "ALL" | null) => {
    if (value === null) return;
    setStatus(value as EmergencyStatus | "ALL");
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            My Emergency Requests
          </h1>
          <p className="text-sm text-muted-foreground">
            Track and manage your ambulance requests
          </p>
        </div>

        <Button className="w-full sm:w-auto">
          <Link href="/caller/request">Request New Ambulance</Link>
        </Button>
      </div>

      {/* Filter Options: Mobile (Select Dropdown) vs Desktop (Tabs) */}
      <div>
        {/* Mobile View: Select Dropdown */}
        <div className="sm:hidden space-y-1.5">
          <Label>Filter by Status</Label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_TABS.map((tab) => (
                <SelectItem key={tab.value} value={tab.value}>
                  {tab.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop View: Tabs */}
        <div className="hidden sm:block">
          <Tabs
            value={status}
            onValueChange={handleStatusChange}
            className="w-full"
          >
            <TabsList className="grid h-auto w-full max-w-4xl grid-cols-7">
              {STATUS_TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label.replace(" Status", "")}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Search Input */}
      <div className="space-y-2 max-w-md">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search by patient name, phone number..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            type="search"
          />
        </div>
      </div>

      {/* Content */}
      {isLoading && (
        <div className="flex justify-center rounded-lg border p-12">
          <Spinner className="h-8 w-8" />
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center text-sm text-destructive">
          Failed to load emergencies. Please try again.
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* Show filtering spinner when tab changes or search */}
          {isFetching && (
            <div className="flex items-center justify-center gap-2 rounded-lg border bg-muted/30 p-4">
              <Spinner className="h-4 w-4" />
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          )}

          {!isFetching && (
            <>
              <EmergenciesTable
                basePath="my-emergencies/"
                emergencies={emergencies}
              />

              {meta && meta.totalPages > 0 && (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground text-center sm:text-left">
                    Showing {emergencies.length} of {meta.total} results
                  </p>

                  <TablePagination
                    page={page}
                    totalPages={meta.totalPages}
                    handlePageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useGetMe } from "@/hooks";
import type { UserRole } from "@/types/user.types";
import AccessDenied from "./access-denied";
import AuthLoading from "./auth-loading";

interface IProps {
  children: ReactNode;
  roles: UserRole[];
}

export default function RoleGuard({ children, roles }: IProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data, isPending, isError } = useGetMe();

  console.log("RoleGuard data:", data);

  const user = data?.data;
  const isAuthorized = !!user && roles.includes(user.role);

  useEffect(() => {
    if (isPending) {
      return;
    }
    if (isError || !user) {
      // Build the full URL including search params to redirect back after login
      const queryString = searchParams.toString();
      const fullPath = queryString ? `${pathname}?${queryString}` : pathname;
      const loginUrl = `/login?callbackUrl=${encodeURIComponent(fullPath)}`;

      console.log("RoleGuard redirect:", {
        pathname,
        queryString,
        fullPath,
        loginUrl,
      });

      router.replace(loginUrl);
    }
  }, [isPending, isError, user, router, pathname, searchParams]);

  if (isPending) {
    return <AuthLoading />;
  }

  if (isError || !user) {
    return <AuthLoading label="Redirecting..." />;
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return <AccessDenied />;
}

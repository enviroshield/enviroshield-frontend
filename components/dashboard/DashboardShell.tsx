"use client";

import type { ReactNode } from "react";

import { authClient } from "@/lib/auth-client";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import type {
  DashboardNavItem,
  DashboardRole,
} from "@/config/dashboard/navigation";

import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";

interface DashboardShellProps {
  children: ReactNode;
  role: DashboardRole;
  user: {
    name: string;
    email: string;
    image?: string | null;
    role?: string | null;
  };
  navigation: DashboardNavItem[];
}

export function DashboardShell({
  children,
  role,
  user: initialUser,
  navigation,
}: DashboardShellProps) {
  const { data: session } = authClient.useSession();

  const user = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
        role: session.user.role ?? role,
      }
    : {
        ...initialUser,
        role: initialUser.role ?? role,
      };

  return (
    <SidebarProvider>
      <DashboardSidebar
        role={role}
        user={user}
        navigation={navigation}
      />

      <SidebarInset className="min-w-0 bg-mist">
        <DashboardHeader user={user} />

        <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-mist">
          {/* Subtle Enviroshield visual texture */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(1,110,220,0.06),transparent)]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-96 bg-[radial-gradient(circle_at_top_right,rgba(0,51,78,0.03),transparent_70%)]"
          />

          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

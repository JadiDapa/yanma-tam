"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User } from "@/generated/prisma";
import { overviewItems, settingsItems } from "@/lib/sidebar-menu";
import { PanelRightOpen, ChevronRight, LogOut } from "lucide-react";

// Menu items.

export default function DashboardSidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const { signOut } = useClerk();
  const router = useRouter();

  const visibleOverviewItems = overviewItems;

  const visibleSettingsItems = settingsItems;

  const handleSignOut = async () => {
    await signOut();
    router.replace("/sign-in");
  };

  return (
    <Sidebar className="p-2 border-none bg-none">
      <SidebarContent className="bg-none">
        <ScrollArea className="h-screen px-5 bg-card rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center justify-between gap-3 py-4 mb-4 pt-4">
            <div className="">
              <p className="text-3xl font-bold text-primary tracking-wider">
                YANMA
              </p>
              <p className="text-xs text-muted-foreground tracking-wider">
                Taruna Anugerah Mandiri
              </p>
            </div>
            <PanelRightOpen
              onClick={toggleSidebar}
              className=""
              strokeWidth={1.4}
            />
          </div>
          {/* Overview */}
          <SidebarGroup className="pt-1 p-0">
            <SidebarGroupLabel className="font-semibold text-sm">
              MENU
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleOverviewItems.map((item) => {
                  const active = pathname === item.url;

                  if (item.submenu) {
                    return (
                      <Collapsible
                        key={item.title}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem className="p-0 ">
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="flex h-10 items-center gap-4  cursor-pointer">
                              <item.icon className="size-5" />
                              <span
                                className={`${
                                  active
                                    ? "font-medium text-primary "
                                    : "text-foreground"
                                } text-base`}
                              >
                                {item.title}
                              </span>

                              <ChevronRight className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.submenu.map((sub) => {
                                const subActive = pathname === sub.url;
                                return (
                                  <SidebarMenuSubItem
                                    key={sub.title}
                                    className="ms-1 h-9 hover:bg-accent rounded-e-md flex"
                                  >
                                    <Link
                                      href={sub.url}
                                      className={`flex items-center gap-3 pl-6 pr-1 rounded-md transition-colors ${
                                        subActive
                                          ? "text-primary font-semibold"
                                          : "text-foreground"
                                      }`}
                                    >
                                      <span>{sub.title}</span>
                                    </Link>
                                  </SidebarMenuSubItem>
                                );
                              })}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }

                  return (
                    <SidebarMenuItem
                      key={item.title}
                      className="relative p-0 rounded-none"
                    >
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url || "#"}
                          className="flex h-10 items-center gap-x-4"
                        >
                          <item.icon
                            className={`${
                              active
                                ? "font-medium text-primary "
                                : "text-foreground"
                            } text-base size-5`}
                          />
                          <span
                            className={`${
                              active
                                ? "font-medium text-primary "
                                : "text-foreground"
                            } text-base`}
                          >
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* SETTINGS pinned to bottom */}
          <SidebarGroup className="mt-auto p-0 pt-6  pb-6">
            <SidebarGroupLabel className="font-semibold text-sm">
              GENERAL
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {visibleSettingsItems.map((item) => {
                  return (
                    <SidebarMenuItem
                      key={item.title}
                      className="relative p-0 rounded-none"
                    >
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          className="flex h-10 items-center gap-x-4 "
                        >
                          <item.icon className="size-5" />
                          <span className="text-base">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
                <SidebarMenuItem className="relative p-0 rounded-none">
                  <SidebarMenuButton asChild>
                    <div
                      onClick={handleSignOut}
                      className="flex cursor-pointer h-10 items-center gap-x-4 "
                    >
                      <LogOut className="size-5" />
                      <span className="text-base">Log Out</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}

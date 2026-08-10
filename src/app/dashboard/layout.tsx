import React from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup, SidebarGroupContent,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar";
import {LayoutDashboard} from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <div>
            <SidebarProvider>
                <Sidebar>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <Link href={'/dashboard'}> <SidebarMenuButton> <LayoutDashboard /> 대시보드</SidebarMenuButton> </Link>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>
                <main className={'flex-1 relative'}>
                    <SidebarTrigger className={'absolute z-50'}/>
                    {children}
                </main>
            </SidebarProvider>
        </div>
    )
}
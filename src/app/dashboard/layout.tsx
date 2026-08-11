import React from "react";
import {
    SidebarTrigger
} from "@/components/ui/sidebar";

export default function DashboardLayout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <main className={'flex-1 relative'}>
            <SidebarTrigger className={'absolute z-50'}/>
            {children}
        </main>
    )
}
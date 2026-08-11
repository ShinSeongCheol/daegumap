import React from "react";
import {SidebarTrigger} from "@/components/ui/sidebar";

export default function CommercialLayout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <main className={'flex-1'}>
            <SidebarTrigger className={''}/>
            {children}
        </main>
    )
}
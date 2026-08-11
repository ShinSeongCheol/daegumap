import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import React from "react";
import Link from "next/link";
import {LayoutDashboard, Store} from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daegu Map",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
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

                  <SidebarMenu>
                    <SidebarMenuItem>
                      <Link href={'/businesses'}> <SidebarMenuButton> <Store /> 상권정보</SidebarMenuButton> </Link>
                    </SidebarMenuItem>
                  </SidebarMenu>

                </SidebarGroupContent>
              </SidebarGroup>

            </SidebarContent>
          </Sidebar>

          {children}

        </SidebarProvider>
      </body>
    </html>
  );
}

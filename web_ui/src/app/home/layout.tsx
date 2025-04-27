"use client"

import '@ant-design/v5-patch-for-react-19';
import styles from "./layout.module.css"
import HomeSidebar from "@/app/home/components/home-sidebar/HomeSidebar";
import HomeTitleBar from "@/app/home/components/home-titlebar/HomeTitleBar";
import React, {useState} from "react";
import {SidebarChildVO} from "@/app/home/components/home-sidebar/HomeSidebarChild";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function HomeLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const [title, setTitle] = useState<string>("")
    const onSelectedChange = (child: SidebarChildVO) => {
        setTitle(child.name)
    }

    return (
    <SidebarProvider className={styles.homeLayoutContainer}>
     <HomeSidebar
             onSelectedChange={onSelectedChange}
            />

      <main className={styles.main}>
      <HomeTitleBar title={title}/>
      <div className={styles.mainContent}>
        {children}
        </div>
      </main>
    </SidebarProvider>
    )
}

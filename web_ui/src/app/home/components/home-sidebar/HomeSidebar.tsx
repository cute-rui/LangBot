"use client"

import styles from "./HomeSidebar.module.css"
import {useEffect, useState} from "react";
import {SidebarChildVO} from "@/app/home/components/home-sidebar/HomeSidebarChild";
import {useRouter, usePathname, useSearchParams} from "next/navigation";
import {sidebarConfigList} from "@/app/home/components/home-sidebar/sidbarConfigList";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";

// TODO 侧边导航栏要加动画
export default function HomeSidebar({
    onSelectedChange
}: {
    onSelectedChange: (sidebarChild: SidebarChildVO) => void
}) {
    // 路由相关
    const router = useRouter()
    const pathname = usePathname();
    const searchParams = useSearchParams();
    // 路由被动变化时处理
    useEffect(() => {
        handleRouteChange(pathname)
    }, [pathname, searchParams]);

    const [selectedChild, setSelectedChild] = useState<SidebarChildVO>(sidebarConfigList[0])

    useEffect(() => {
        console.log('HomeSidebar挂载完成');
        initSelect()
        return () => console.log('HomeSidebar卸载');
    }, []);

    const items = [
        {
          title: "Home",
          url: "#",
        },
        {
          title: "Inbox",
          url: "#",
        },
        {
          title: "Calendar",
          url: "#",
        },
        {
          title: "Search",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ]

    function handleChildClick(child: SidebarChildVO) {
        setSelectedChild(child)
        handleRoute(child)
        onSelectedChange(child)
    }

    function initSelect() {
        handleChildClick(sidebarConfigList[0])
    }

    function handleRoute(child: SidebarChildVO) {
        console.log(child)
        router.push(`${child.route}`)
    }

    function handleRouteChange(pathname: string) {
        // TODO 这段逻辑并不好，未来router封装好后改掉
        // 判断在home下，并且路由更改的是自己的路由子组件则更新UI
        const routeList = pathname.split('/')
        if (
            routeList[1] === "home" &&
            sidebarConfigList.find(childConfig =>
                childConfig.route === pathname
            )
        ) {
            console.log("find success")
            const routeSelectChild = sidebarConfigList.find(childConfig =>
                childConfig.route === pathname
            )
            if (routeSelectChild) {
                setSelectedChild(routeSelectChild)
            }
        }
    }

    return (
        <Sidebar variant="sidebar" collapsible="none"  className={styles.sidebarContainer}>
       {/* LangBot、ICON区域 */}
       <SidebarHeader className={styles.langbotIconContainer}>
                        {/* icon */}
                        <div className={styles.langbotIcon}>
                            L
                        </div>
                        <div className={styles.langbotText}>
                            Langbot
                        </div>
                    </SidebarHeader>
                    
                    {/* 菜单列表 */}
                    <SidebarContent>
                        <SidebarMenu>
                            {sidebarConfigList.map(config => (
                                <SidebarMenuItem key={config.id}>
                                    <SidebarMenuButton 
                                        isActive={selectedChild.id === config.id}
                                        onClick={() => {
                                            console.log('click:', config.id)
                                            handleChildClick(config)
                                        }}
                                        className={`${selectedChild.id === config.id ? styles.sidebarSelected : styles.sidebarUnselected}`}
                                    >
                                        <div className={styles.sidebarChildIcon}/>
                                        <div>{config.name}</div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarContent>
    </Sidebar>
                
    );
}


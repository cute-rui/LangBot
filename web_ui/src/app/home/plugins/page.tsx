"use client"
import { useState } from "react";
import PluginInstalledComponent from "@/app/home/plugins/plugin-installed/PluginInstalledComponent";
import PluginMarketComponent from "@/app/home/plugins/plugin-market/PluginMarketComponent";
import styles from './plugins.module.css'
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PluginConfigPage() {
    enum PageType {
        INSTALLED = "installed",
        MARKET = 'market'
    }

    const [nowPageType, setNowPageType] = useState<PageType>(PageType.INSTALLED);

    return (
        <div>
            <div className="flex w-full mb-4 bg-muted p-1 rounded-md">
                <Button 
                    onClick={() => setNowPageType(PageType.INSTALLED)}
                    className={cn(
                        "flex-1 rounded-md", 
                        nowPageType === PageType.INSTALLED 
                            ? "bg-background shadow" 
                            : "bg-transparent hover:bg-background/50"
                    )}
                    variant="ghost"
                >
                    已安装
                </Button>
                <Button 
                    onClick={() => setNowPageType(PageType.MARKET)}
                    className={cn(
                        "flex-1 rounded-md", 
                        nowPageType === PageType.MARKET 
                            ? "bg-background shadow" 
                            : "bg-transparent hover:bg-background/50"
                    )}
                    variant="ghost"
                >
                    插件市场
                </Button>
            </div>

            <div>
                {nowPageType === PageType.INSTALLED && <PluginInstalledComponent />}
                {nowPageType === PageType.MARKET && <PluginMarketComponent />}
            </div>
        </div>
    );
}

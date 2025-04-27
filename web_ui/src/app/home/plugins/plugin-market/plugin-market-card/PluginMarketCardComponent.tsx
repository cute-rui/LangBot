import {GithubOutlined, StarOutlined} from '@ant-design/icons';
import {PluginMarketCardVO} from "@/app/home/plugins/plugin-market/plugin-market-card/PluginMarketCardVO";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from "@/components/ui/card";

export default function PluginMarketCardComponent({
     cardVO
}: {
    cardVO: PluginMarketCardVO
}) {
    function handleInstallClick (pluginId: string) {
        console.log("Install plugin: ", pluginId)
    }

    return (
        <Card className="w-[360px] h-[140px] shadow-sm overflow-hidden flex flex-col p-0 gap-0">
            <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between">
                <div className="text-[#6C6C6C] text-sm">{cardVO.author}</div>
                <GithubOutlined
                    style={{fontSize: '26px'}}
                    type="setting"
                />
            </CardHeader>
            <CardContent className="p-3 pt-1 pb-0 flex-grow">
                <div className="text-xl font-bold">{cardVO.name}</div>
                <div className="text-[#6C6C6C] text-sm">{cardVO.description}</div>
            </CardContent>
            <CardFooter className="p-3 pt-0 mt-auto flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-blue-600">
                        <StarOutlined
                            style={{fontSize: '22px'}}
                        />
                        <span>{cardVO.starCount}</span>
                    </div>
                </div>
                <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                        handleInstallClick(cardVO.pluginId)
                    }}
                >
                    安装
                </Button>
            </CardFooter>
        </Card>
    );
}

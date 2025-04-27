import {PluginCardVO} from "@/app/home/plugins/plugin-installed/PluginCardVO";
import {GithubOutlined, LinkOutlined, ToolOutlined} from '@ant-design/icons';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PluginCardComponent({
    cardVO
}: {
    cardVO: PluginCardVO
}) {
    return (
        <Card className="w-[360px] h-[140px] shadow-sm overflow-hidden flex flex-col p-0 gap-0">
            <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between">
                <span className="text-[#6C6C6C] text-sm">{cardVO.author}</span>
                <div className="flex items-center justify-between w-[90px]">
                    <GithubOutlined 
                        style={{fontSize: '26px'}} 
                    />
                    <Badge variant="secondary" className="bg-[#108ee9] text-white">
                        v{cardVO.version}
                    </Badge>
                </div>
            </CardHeader>
            
            <CardContent className="p-3 pt-1 pb-0 flex-grow">
                <CardTitle className="text-xl font-bold">{cardVO.name}</CardTitle>
                <CardDescription className="text-[#6C6C6C] text-sm">{cardVO.description}</CardDescription>
            </CardContent>
            
            <CardFooter className="p-3 pt-0 mt-auto">
                <div className="w-[80px] flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <LinkOutlined style={{fontSize: '22px'}} />
                        <span>1</span>
                    </div>
                    <Button variant="ghost" size="icon" className="p-0 h-auto">
                        <ToolOutlined style={{fontSize: '22px'}} />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

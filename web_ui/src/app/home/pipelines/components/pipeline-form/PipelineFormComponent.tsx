"use client"

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./pipelineFormStyle.module.css";
import { 
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// 定义表单类型
interface FormLabel {
    label: string;
    name: string;
}

export default function PipelineFormComponent({
    onFinish,
    onCancel,
}: {
    onFinish: () => void;
    onCancel: () => void;
}) {
    const [nowFormIndex, setNowFormIndex] = useState<number>(0);
    
    // 表单分类列表
    const formLabelList: FormLabel[] = [
        {label: "AI能力", name: "ai"},
        {label: "触发条件", name: "trigger"},
        {label: "安全能力", name: "safety"},
        {label: "输出处理", name: "output"},
    ];

    // 定义表单验证模式
    const formSchema = z.object({
        runner: z.object({
            runner: z.string().optional()
        }).optional(),
        "local-agent": z.object({
            model: z.string().optional(),
            "max-round": z.number().optional(),
            prompt: z.string().optional()
        }).optional(),
        "dify-service-api": z.object({
            "base-url": z.string().optional(),
            "app-type": z.string().optional(),
            "api-key": z.string().optional(),
            "thinking-convert": z.string().optional()
        }).optional(),
        "dashscope-app-api": z.object({
            "app-type": z.string().optional(),
            "api-key": z.string().optional(),
            "app-id": z.string().optional(),
            "references_quote": z.string().optional()
        }).optional(),
        "group-respond-rules": z.object({
            at: z.boolean().optional(),
            prefix: z.string().optional(),
            regexp: z.string().optional(),
            random: z.number().optional()
        }).optional(),
        "access-control": z.object({
            mode: z.string().optional(),
            blacklist: z.string().optional(),
            whitelist: z.string().optional()
        }).optional(),
        "ignore-rules": z.object({
            whitelist: z.string().optional(),
            regexp: z.string().optional()
        }).optional(),
        "content-filter": z.object({
            scope: z.string().optional(),
            "check-sensitive-words": z.boolean().optional()
        }).optional(),
        "rate-limit": z.object({
            "window-length": z.number().optional(),
            limitation: z.number().optional(),
            strategy: z.string().optional()
        }).optional(),
        "long-text-processing": z.object({
            threshold: z.number().optional(),
            strategy: z.string().optional(),
            "font-path": z.string().optional()
        }).optional(),
        "force-delay": z.object({
            min: z.number().optional(),
            max: z.number().optional()
        }).optional(),
        misc: z.object({
            "hide-exception": z.boolean().optional(),
            "at-sender": z.boolean().optional(),
            "quote-origin": z.boolean().optional(),
            "track-function-calls": z.boolean().optional()
        }).optional()
    });

    // 创建表单实例
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {}
    });

    // 获取当前表单标签
    function getNowFormLabel() {
        return formLabelList[nowFormIndex];
    }

    // 获取上一个表单标签
    function getPreFormLabel(): FormLabel | undefined {
        if (nowFormIndex > 0) {
            return formLabelList[nowFormIndex - 1];
        }
        return undefined;
    }

    // 获取下一个表单标签
    function getNextFormLabel(): FormLabel | undefined {
        if (nowFormIndex < formLabelList.length - 1) {
            return formLabelList[nowFormIndex + 1];
        }
        return undefined;
    }

    // 切换到下一个表单
    function addFormLabelIndex() {
        if (nowFormIndex < formLabelList.length - 1) {
            setNowFormIndex(nowFormIndex + 1);
        }
    }

    // 切换到上一个表单
    function reduceFormLabelIndex() {
        if (nowFormIndex > 0) {
            setNowFormIndex(nowFormIndex - 1);
        }
    }

    // 提交表单
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        onFinish();
    }

    // 渲染AI能力表单
    const renderAIForm = () => {
        if (getNowFormLabel().name !== "ai") return null;
        
        return (
            <div>
                {/* Runner 配置区块 */}
                <div className={styles.formItemSubtitle}>运行器</div>
                <FormField
                    control={form.control}
                    name="runner.runner"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>运行器</FormLabel>
                            <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="请选择运行器" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="local-agent">内置 Agent</SelectItem>
                                    <SelectItem value="dify-service-api">Dify 服务 API</SelectItem>
                                    <SelectItem value="dashscope-app-api">阿里云百炼平台 API</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* 内置 Agent 配置区块 */}
                <div className={styles.formItemSubtitle}>配置内置Agent</div>
                <FormField
                    control={form.control}
                    name="local-agent.model"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>模型</FormLabel>
                            <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="请选择语言模型" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {/* 这里需要填充模型选项 */}
                                </SelectContent>
                            </Select>
                            <FormDescription>从模型库中选择</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="local-agent.max-round"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>最大回合数</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    value={field.value?.toString() || ""}
                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="local-agent.prompt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>提示词</FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={4}
                                    placeholder={`示例结构：{ "role": "user", "content": "你好" } `}
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>按JSON格式输入</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Dify 服务 API 区块 */}
                <div className={styles.formItemSubtitle}>配置Dify服务API</div>
                <FormField
                    control={form.control}
                    name="dify-service-api.base-url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>基础 URL</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="dify-service-api.app-type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>应用类型</FormLabel>
                            <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value || "chat"}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择应用类型" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="chat">聊天（包括Chatflow）</SelectItem>
                                    <SelectItem value="agent">Agent</SelectItem>
                                    <SelectItem value="workflow">工作流</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="dify-service-api.api-key"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>API 密钥</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="dify-service-api.thinking-convert"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>思维链转换</FormLabel>
                            <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择转换方式" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="plain">转换成 {`<think>...</think>`}</SelectItem>
                                    <SelectItem value="original">原始</SelectItem>
                                    <SelectItem value="remove">移除</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* 阿里云百炼区块 */}
                <div className={styles.formItemSubtitle}>配置阿里云百炼平台 API</div>
                <FormField
                    control={form.control}
                    name="dashscope-app-api.app-type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>应用类型</FormLabel>
                            <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择应用类型" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="agent">Agent</SelectItem>
                                    <SelectItem value="workflow">工作流</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="dashscope-app-api.api-key"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>API 密钥</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="dashscope-app-api.app-id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>应用 ID</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="dashscope-app-api.references_quote"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>引用文本</FormLabel>
                            <FormControl>
                                <Textarea rows={2} defaultValue="参考资料来自:" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        );
    };

    // 渲染触发条件表单
    const renderTriggerForm = () => {
        if (getNowFormLabel().name !== "trigger") return null;
        
        return (
            <div>
                {/* 群响应规则块 */}
                <div className={styles.formItemSubtitle}>群响应规则</div>
                <FormField
                    control={form.control}
                    name="group-respond-rules.at"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                            <FormLabel>是否在消息@机器人时触发</FormLabel>
                            <FormControl>
                                <Switch 
                                    checked={field.value} 
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="group-respond-rules.prefix"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>消息前缀</FormLabel>
                            <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择前缀" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value={`"type": "string"`}>&quot;type&quot;: &quot;string&quot;</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="group-respond-rules.regexp"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>正则表达式</FormLabel>
                            <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择正则表达式" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {/* 这里需要填充正则表达式选项 */}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="group-respond-rules.random"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>随机</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    value={field.value?.toString() || ""}
                                    onChange={e => field.onChange(parseFloat(e.target.value))}
                                    max={1}
                                    min={0}
                                    step={0.05}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className={styles.formItemSubtitle}>访问控制</div>
                <FormField
                    control={form.control}
                    name="access-control.mode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>模式</FormLabel>
                            <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择访问控制模式" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="blacklist">黑名单</SelectItem>
                                    <SelectItem value="Whitelist">白名单</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="access-control.blacklist"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>黑名单</FormLabel>
                            <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择黑名单" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {/* 这里需要填充黑名单选项 */}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="access-control.whitelist"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>白名单</FormLabel>
                            <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择白名单" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {/* 这里需要填充白名单选项 */}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className={styles.formItemSubtitle}>消息忽略规则</div>

                <FormField
                    control={form.control}
                    name="ignore-rules.whitelist"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>前缀</FormLabel>
                            <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择前缀" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {/* 这里需要填充前缀选项 */}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="ignore-rules.regexp"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>正则表达式</FormLabel>
                            <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择正则表达式" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {/* 这里需要填充正则表达式选项 */}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        );
    };

    // 渲染安全控制表单
    const renderSafetyForm = () => {
        if (getNowFormLabel().name !== "safety") return null;
        
        return (
            <div>
                {/* 内容过滤块 */}
                <div className={styles.formItemSubtitle}>内容过滤</div>
                <FormField
                    control={form.control}
                    name="content-filter.scope"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>检查范围</FormLabel>
                            <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择检查范围" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="all">全部</SelectItem>
                                    <SelectItem value="income-msg">传入消息（用户消息）</SelectItem>
                                    <SelectItem value="output-msg">传出消息（机器人消息）</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content-filter.check-sensitive-words"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                            <FormLabel>检查敏感词</FormLabel>
                            <FormControl>
                                <Switch 
                                    checked={field.value} 
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* 速率限制块 */}
                <div className={styles.formItemSubtitle}>速率限制</div>
                <FormField
                    control={form.control}
                    name="rate-limit.window-length"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>窗口长度（秒）</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    value={field.value?.toString() || ""}
                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                    max={60}
                                    min={0}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="rate-limit.limitation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>限制次数</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    value={field.value?.toString() || ""}
                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                    max={60}
                                    min={0}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="rate-limit.strategy"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>策略</FormLabel>
                            <FormControl>
                                <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="选择策略" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="drop">丢弃</SelectItem>
                                        <SelectItem value="wait">等待</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        );
    };

    // 渲染输出处理表单
    const renderOutputForm = () => {
        if (getNowFormLabel().name !== "output") return null;
        
        return (
            <div>
                {/* 长文本处理区块 */}
                <div className={styles.formItemSubtitle}>长文本处理</div>
                <FormField
                    control={form.control}
                    name="long-text-processing.threshold"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>阈值</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    value={field.value?.toString() || ""}
                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="long-text-processing.strategy"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>策略</FormLabel>
                            <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择策略" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="forward">转发消息组件</SelectItem>
                                    <SelectItem value="image">转换为图片</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="long-text-processing.font-path"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>字体路径</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* 强制延迟区块 */}
                <div className={styles.formItemSubtitle}>强制延迟</div>
                <FormField
                    control={form.control}
                    name="force-delay.min"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>最小秒数</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    value={field.value?.toString() || ""}
                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="force-delay.max"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>最大秒数</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    value={field.value?.toString() || ""}
                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* 杂项区块 */}
                <div className={styles.formItemSubtitle}>杂项</div>
                <FormField
                    control={form.control}
                    name="misc.hide-exception"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                            <FormLabel>不输出异常信息给用户</FormLabel>
                            <FormControl>
                                <Switch 
                                    checked={field.value} 
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="misc.at-sender"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                            <FormLabel>在回复中@发送者</FormLabel>
                            <FormControl>
                                <Switch 
                                    checked={field.value} 
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="misc.quote-origin"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                            <FormLabel>引用原文</FormLabel>
                            <FormControl>
                                <Switch 
                                    checked={field.value} 
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="misc.track-function-calls"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                            <FormLabel>跟踪函数调用</FormLabel>
                            <FormControl>
                                <Switch 
                                    checked={field.value} 
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        );
    };

    return (
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <h1 className="text-xl font-bold mb-4">
                {getNowFormLabel().label}
            </h1>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {renderAIForm()}
                    {renderTriggerForm()}
                    {renderSafetyForm()}
                    {renderOutputForm()}
                </form>
            </Form>

            <div className={`${styles.changeFormButtonGroupContainer} mt-6 flex justify-between`}>
                <Button
                    variant="outline"
                    onClick={reduceFormLabelIndex}
                    disabled={!getPreFormLabel()}
                >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    {getPreFormLabel()?.label || "暂无更多"}
                </Button>
                
                <div className="flex gap-2">
                    <Button
                        variant="outline" 
                        onClick={onCancel}
                    >
                        取消
                    </Button>
                    
                    {nowFormIndex === formLabelList.length - 1 ? (
                        <Button 
                            onClick={form.handleSubmit(onSubmit)}
                        >
                            提交
                        </Button>
                    ) : (
                        <Button
                            onClick={addFormLabelIndex}
                            disabled={!getNextFormLabel()}
                        >
                            {getNextFormLabel()?.label || "暂无更多"}
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}


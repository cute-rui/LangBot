import styles from "@/app/home/models/LLMConfig.module.css";
import {ICreateLLMField} from "@/app/home/models/ICreateLLMField";
import {useEffect, useState} from "react";
import {IChooseRequesterEntity} from "@/app/home/models/component/llm-form/ChooseAdapterEntity";
import { httpClient } from "@/app/infra/http/HttpClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// 定义表单验证Schema
const formSchema = z.object({
    name: z.string().min(1, "模型名称为必填项"),
    model_provider: z.string().min(1, "模型供应商为必填项"),
    url: z.string().min(1, "请求URL为必填项"),
    api_key: z.string().optional(),
    abilities: z.array(z.string()).optional(),
    extra_args: z.array(z.string()).optional(),
});

export default function LLMForm({
    editMode,
    initLLMId,
    onFormSubmit,
    onFormCancel,
}: {
    editMode: boolean;
    initLLMId?: string;
    onFormSubmit: (value: ICreateLLMField) => void;
    onFormCancel: (value: ICreateLLMField) => void;
}) {
    const [requesterNameList, setRequesterNameList] = useState<IChooseRequesterEntity[]>([]);
    const [abilitiesList, setAbilitiesList] = useState<string[]>([]);
    const [extraArgsList, setExtraArgsList] = useState<string[]>([]);

    // 使用react-hook-form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            model_provider: "",
            url: "",
            api_key: "",
            abilities: [],
            extra_args: [],
        },
    });

    const abilityOptions = [
        { label: '函数调用', value: 'func_call' },
        { label: '图像识别', value: 'vision' },
    ];

    useEffect(() => {
        initLLMModelFormComponent();
        if (editMode && initLLMId) {
            getLLMConfig(initLLMId).then(val => {
                form.reset(val);
                if (val.abilities) setAbilitiesList(val.abilities);
                if (val.extra_args) setExtraArgsList(val.extra_args);
            });
        } else {
            form.reset();
            setAbilitiesList([]);
            setExtraArgsList([]);
        }
    }, [editMode, initLLMId, form]);

    async function initLLMModelFormComponent() {
        try {
            const requesterNameList = await httpClient.getProviderRequesters();
            setRequesterNameList(requesterNameList.requesters.map(item => {
                return {
                    label: item.label.zh_CN,
                    value: item.name
                };
            }));
        } catch (error) {
            toast.error("获取模型供应商列表失败");
        }
    }

    async function getLLMConfig(id: string): Promise<ICreateLLMField> {
        return {
            name: id,
            model_provider: "OpenAI",
            url: "www.aaa.com",
            api_key: "",
            abilities: [],
            extra_args: [],
        };
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = values as ICreateLLMField;
        
        if (editMode) {
            onSaveEdit(formData);
        } else {
            onCreateLLM(formData);
        }
        
        onFormSubmit(formData);
        form.reset();
    }

    function onSaveEdit(value: ICreateLLMField) {
        console.log("edit save", value);
    }

    function onCreateLLM(value: ICreateLLMField) {
        console.log("create llm", value);
    }

    function handleCancel() {
        const currentValues = form.getValues() as ICreateLLMField;
        onFormCancel(currentValues);
        form.reset();
    }

    return (
        <div className={styles.modalContainer}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>模型名称</FormLabel>
                                <FormControl>
                                    <Input placeholder="为自己的大模型取个好听的名字～" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="model_provider"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>模型供应商</FormLabel>
                                <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="选择模型供应商" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {requesterNameList.map((item) => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>请求URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="请求地址，一般是API提供商提供的URL" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Note: abilities and extra_args应该使用多选组件，但因为shadcn没有直接提供tag模式的Select
                         这里简化处理，实际项目应该自定义一个多标签输入组件 */}
                    <FormField
                        control={form.control}
                        name="abilities"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>开启能力</FormLabel>
                                <FormControl>
                                    {/* TODO  INPUT WITH TAGS */}
                                    <Input 
                                        placeholder="输入能力名称后按回车添加" 
                                        value={field.value?.join(',')} 
                                        onChange={(e) => {
                                            const values = e.target.value.split(',');
                                            field.onChange(values);
                                        }} 
                                    />
                                </FormControl>
                                <FormDescription>
                                    例如: func_call,vision
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="extra_args"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>其他参数</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="输入参数后按回车添加" 
                                        value={field.value?.join(',')} 
                                        onChange={(e) => {
                                            const values = e.target.value.split(',');
                                            field.onChange(values);
                                        }} 
                                    />
                                </FormControl>
                                <FormDescription>
                                    例如: key:value
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" type="button" onClick={handleCancel}>
                            取消
                        </Button>
                        <Button type="submit">
                            {editMode ? "保存" : "提交"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
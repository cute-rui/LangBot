import {BotFormEntity, IBotFormEntity} from "@/app/home/bots/components/bot-form/BotFormEntity";
import {useEffect, useState} from "react";
import {IChooseAdapterEntity} from "@/app/home/bots/components/bot-form/ChooseAdapterEntity";
import {
    DynamicFormItemConfig,
    IDynamicFormItemConfig,
    parseDynamicFormItemType
} from "@/app/home/components/dynamic-form/DynamicFormItemConfig";
import {UUID} from 'uuidjs'
import DynamicFormComponent from "@/app/home/components/dynamic-form/DynamicFormComponent";
import {ICreateLLMField} from "@/app/home/models/ICreateLLMField";
import {httpClient} from "@/app/infra/http/HttpClient";
import { Bot } from "@/app/infra/api/api-types";
import { toast } from "sonner";
import { useForm } from "react-hook-form";


//TODO: Refactored but not validated
// Shadcn UI导入
import { 
    Form, 
    FormControl, 
    FormDescription, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";


export default function BotForm({
    initBotId,
    onFormSubmit,
    onFormCancel,
}: {
    initBotId?: string;
    onFormSubmit: (value: IBotFormEntity) => void;
    onFormCancel: (value: IBotFormEntity) => void;
}) {
    const [adapterNameToDynamicConfigMap, setAdapterNameToDynamicConfigMap] = useState(new Map<string, IDynamicFormItemConfig[]>())
    const form = useForm<IBotFormEntity>({
        defaultValues: {
            name: "",
            description: "",
            adapter: ""
        }
    });
    const [showDynamicForm, setShowDynamicForm] = useState<boolean>(false)
    const dynamicForm = useForm();
    const [adapterNameList, setAdapterNameList] = useState<IChooseAdapterEntity[]>([])
    const [dynamicFormConfigList, setDynamicFormConfigList] = useState<IDynamicFormItemConfig[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        initBotFormComponent()
        if (initBotId) {
            onEditMode()
        } else {
            onCreateMode()
        }
    }, [])

    async function initBotFormComponent() {
        // 拉取adapter
        const rawAdapterList = await httpClient.getAdapters()
        // 初始化适配器选择列表
        setAdapterNameList(
            rawAdapterList.adapters.map(item => {
                return {
                    label: item.label.zh_CN,
                    value: item.name
                }
            })
        )
        // 初始化适配器表单map
        rawAdapterList.adapters.forEach(rawAdapter => {
            adapterNameToDynamicConfigMap.set(
                rawAdapter.name,
                rawAdapter.spec.config.map(item =>
                    new DynamicFormItemConfig({
                        default: item.default,
                        id: UUID.generate(),
                        label: item.label,
                        name: item.name,
                        required: item.required,
                        type: parseDynamicFormItemType(item.type)
                    })
                )
            )
        })
        // 拉取初始化表单信息
        if (initBotId) {
            getBotFieldById(initBotId).then(val => {
                form.setValue("name", val.name);
                form.setValue("description", val.description);
                form.setValue("adapter", val.adapter);
                // TODO 这里有个bug，adapter config 并没有被设置到表单中，表单一直都只显示默认值
                handleAdapterSelect(val.adapter)
            })
        } else {
            form.reset();
        }
        setAdapterNameToDynamicConfigMap(adapterNameToDynamicConfigMap)
    }

    async function onCreateMode() {

    }

    function onEditMode() {

    }

    async function getBotFieldById(botId: string): Promise<IBotFormEntity> {
        const bot = (await httpClient.getBot(botId)).bot
        let botFormEntity = new BotFormEntity({
            adapter: bot.adapter,
            description: bot.description,
            name: bot.name,
            adapter_config: bot.adapter_config
        })
        return botFormEntity
    }

    function handleAdapterSelect(adapterName: string) {
        if (adapterName) {
            const dynamicFormConfigList = adapterNameToDynamicConfigMap.get(adapterName)
            if (dynamicFormConfigList) {
                setDynamicFormConfigList(dynamicFormConfigList)
            }
            setShowDynamicForm(true)
        } else {
            setShowDynamicForm(false)
        }
    }

    function handleSubmitButton() {
        form.handleSubmit(handleFormFinish)();
    }

    function handleFormFinish(value: IBotFormEntity) {
        dynamicForm.handleSubmit(onDynamicFormSubmit)();
    }

    // 只有通过外层固定表单验证才会走到这里，真正的提交逻辑在这里
    function onDynamicFormSubmit(value: object) {
        setIsLoading(true)
        console.log('setloading',  true)
        if (initBotId) {
            // 编辑提交
            console.log('submit edit', form.getValues() ,value)
            let updateBot: Bot = {
                uuid: initBotId,
                name: form.getValues().name,
                description: form.getValues().description,
                adapter: form.getValues().adapter,
                adapter_config: value
            }
            httpClient.updateBot(initBotId, updateBot).then(res => {
                toast.success("更新成功", {
                    description: "机器人更新成功"
                });
            }).catch(err => {
                toast.error("更新失败", {
                    description: "机器人更新失败"
                });
            }).finally(() => {
                setIsLoading(false)
                form.reset();
                dynamicForm.reset();
            })
        } else {
            // 创建提交
            console.log('submit create', form.getValues() ,value)
            let newBot: Bot = {
                name: form.getValues().name,
                description: form.getValues().description,
                adapter: form.getValues().adapter,
                adapter_config: value
            }
            httpClient.createBot(newBot).then(res => {
                toast.success("创建成功", {
                    description: "机器人创建成功"
                });
                console.log(res)
            }).catch(err => {
                toast.error("创建失败", {
                    description: "机器人创建失败"
                });
            }).finally(() => {
                setIsLoading(false)
                form.reset();
                dynamicForm.reset();
            })
        }
        onFormSubmit(form.getValues())
        setShowDynamicForm(false)
        console.log('setloading',  false)
        // TODO 刷新bot列表
        // TODO 关闭当前弹窗 Already closed @setShowDynamicForm(false)?
    }

    function handleSaveButton() {
        form.handleSubmit(handleFormFinish)();
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormFinish)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        rules={{ required: "该项为必填项哦～" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>机器人名称</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="为机器人取个好听的名字吧～" 
                                        className="w-[260px]" 
                                        {...field} 
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        rules={{ required: "该项为必填项哦～" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>描述</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="简单描述一下这个机器人" 
                                        {...field} 
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="adapter"
                        rules={{ required: "该项为必填项哦～" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>平台/适配器选择</FormLabel>
                                <Select 
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        handleAdapterSelect(value);
                                    }}
                                    value={field.value}
                                    disabled={isLoading}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-[220px]">
                                            <SelectValue placeholder="选择一个适配器" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {adapterNameList.length > 0 && adapterNameList.map((item) => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                        {adapterNameList.length === 0 && (
                                            <SelectItem value="no-adapter">
                                                暂无适配器
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
            {
                showDynamicForm &&
                <DynamicFormComponent
                    form={dynamicForm}
                    itemConfigList={dynamicFormConfigList}
                    onSubmit={onDynamicFormSubmit}
                />
            }
            <div className="flex gap-2 mt-6">
                {
                    !initBotId &&
                    <Button
                        type="submit"
                        onClick={handleSubmitButton}
                        disabled={isLoading}
                    >
                        提交
                    </Button>
                }
                {
                    initBotId &&
                    <Button
                        type="submit"
                        onClick={handleSaveButton}
                        disabled={isLoading}
                    >
                        保存
                    </Button>
                }
                <Button 
                    variant="outline" 
                    onClick={() => {
                        onFormCancel(form.getValues())
                    }} 
                    disabled={isLoading}
                >
                    取消
                </Button>
            </div>
        </div>
    )
}
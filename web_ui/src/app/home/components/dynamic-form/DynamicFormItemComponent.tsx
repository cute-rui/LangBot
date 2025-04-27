import {DynamicFormItemType, IDynamicFormItemConfig} from "@/app/home/components/dynamic-form/DynamicFormItemConfig";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function DynamicFormItemComponent({
    config,
    form
}: {
    config: IDynamicFormItemConfig,
    form: UseFormReturn<any>
}) {
    return (
        <FormField
            control={form.control}
            name={config.name}
            defaultValue={config.default}
            rules={{ required: config.required ? "该项为必填项哦～" : false }}
            render={({ field }) => (
                <FormItem className="mt-4">
                    <FormLabel>{config.label.zh_CN}</FormLabel>
                    <FormControl>
                        {config.type === DynamicFormItemType.INT && (
                            <Input 
                                type="number" 
                                {...field} 
                                value={field.value || config.default || ''}
                                onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            />
                        )}
                        
                        {config.type === DynamicFormItemType.STRING && (
                            <Input 
                                {...field} 
                                value={field.value || config.default || ''}
                            />
                        )}
                        
                        {config.type === DynamicFormItemType.BOOLEAN && (
                            <Switch 
                                checked={field.value === undefined ? !!config.default : field.value}
                                onCheckedChange={field.onChange}
                            />
                        )}
                        
                        {config.type === DynamicFormItemType.STRING_ARRAY && (
                            <Select 
                                value={field.value || config.default || ''}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="请选择" />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* 这里需要根据实际数据填充选项 */}
                                </SelectContent>
                            </Select>
                        )}
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
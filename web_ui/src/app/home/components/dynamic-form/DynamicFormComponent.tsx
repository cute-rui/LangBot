import {IDynamicFormItemConfig} from "@/app/home/components/dynamic-form/DynamicFormItemConfig";
import DynamicFormItemComponent from "@/app/home/components/dynamic-form/DynamicFormItemComponent";
import { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";

export default function DynamicFormComponent({
    form,
    itemConfigList,
    onSubmit,
}: {
    form: UseFormReturn<any>
    itemConfigList: IDynamicFormItemConfig[]
    onSubmit?: (val: object) => unknown
}) {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit || (() => {}))}>
                {
                    itemConfigList.map(config =>
                        <DynamicFormItemComponent
                            key={config.id}
                            config={config}
                            form={form}
                        />
                    )
                }
            </form>
        </Form>
    )
}
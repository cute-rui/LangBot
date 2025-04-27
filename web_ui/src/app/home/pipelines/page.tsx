"use client"
import { useState } from "react";
import CreateCardComponent from "@/app/infra/basic-component/create-card-component/CreateCardComponent";
import PipelineFormComponent from "./components/pipeline-form/PipelineFormComponent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PluginConfigPage() {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [isEditForm, setIsEditForm] = useState(false);

    return (
        <div className={``}>
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>{isEditForm ? "编辑流水线" : "创建流水线"}</DialogTitle>
                    </DialogHeader>
                    <PipelineFormComponent 
                        onFinish={() => {
                            setModalOpen(false);
                        }} 
                        onCancel={() => {
                            setModalOpen(false);
                        }}
                    />
                </DialogContent>
            </Dialog>

            <CreateCardComponent width={360} height={200} plusSize={90} onClick={() => {setModalOpen(true)}}/>
        </div>
    );
}

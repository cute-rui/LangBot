"use client"

import {useEffect, useState} from "react";
import styles from "./botConfig.module.css";
import EmptyAndCreateComponent from "@/app/home/components/empty-and-create-component/EmptyAndCreateComponent";
import {useRouter} from "next/navigation";
import {BotCardVO} from "@/app/home/bots/components/bot-card/BotCardVO";
import BotForm from "@/app/home/bots/components/bot-form/BotForm";
import BotCard from "@/app/home/bots/components/bot-card/BotCard";
import CreateCardComponent from "@/app/infra/basic-component/create-card-component/CreateCardComponent"
import {httpClient} from "@/app/infra/http/HttpClient";
import { Bot } from "@/app/infra/api/api-types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function BotConfigPage() {
    const router = useRouter();
    const [pageShowRule, setPageShowRule] = useState<BotConfigPageShowRule>(BotConfigPageShowRule.NO_BOT)
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [botList, setBotList] = useState<BotCardVO[]>([])
    const [isEditForm, setIsEditForm] = useState(false)
    const [nowSelectedBotCard, setNowSelectedBotCard] = useState<BotCardVO>()
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        setIsLoading(true)
        checkHasLLM().then((hasLLM) => {
            if (hasLLM) {
                getBotList().then((botList) => {
                    if (botList.length === 0) {
                        setPageShowRule(BotConfigPageShowRule.NO_BOT)
                    } else {
                    setPageShowRule(BotConfigPageShowRule.HAVE_BOT)
                    }
                    setBotList(botList)
                }).catch((err) => {
                    toast.error("获取机器人列表失败", {
                        description: err.message,
                    })
                }).finally(() => {
                    setIsLoading(false)
                })
            } else {
                setPageShowRule(BotConfigPageShowRule.NO_LLM)
                setIsLoading(false)
            }
        })
    }, [])

    async function checkHasLLM(): Promise<boolean> {
        // NOT IMPL
        return true
    }

    function getBotList(): Promise<BotCardVO[]> {

        return new Promise((resolve, reject) => {
            httpClient.getBots().then((resp) => {
                const botList: BotCardVO[] = resp.bots.map((bot: Bot) => {
                    return new BotCardVO({
                        adapter: bot.adapter,
                        description: bot.description,
                        id: bot.uuid || "",
                        name: bot.name,
                        updateTime: bot.updated_at || "",
                        pipelineName: bot.use_pipeline_name || "",
                    })
                })
                resolve(botList)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    function handleCreateBotClick() {
        setIsEditForm(false)
        setNowSelectedCard(undefined)
        setDialogOpen(true);
    }

    function setNowSelectedCard(cardVO: BotCardVO | undefined) {
        setNowSelectedBotCard(cardVO)
    }

    function selectBot(cardVO: BotCardVO) {
        setIsEditForm(true)
        setNowSelectedCard(cardVO)
        console.log("set now vo", cardVO)
        setDialogOpen(true)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center w-full h-[50vh]">
                <div className="space-y-4">
                    <Skeleton className="h-12 w-48" />
                    <div className="flex space-x-4">
                        <Skeleton className="h-32 w-32" />
                        <Skeleton className="h-32 w-32" />
                        <Skeleton className="h-32 w-32" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.configPageContainer}>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>{isEditForm ? "编辑机器人" : "创建机器人"}</DialogTitle>
                    </DialogHeader>
                    <BotForm
                        initBotId={nowSelectedBotCard?.id}
                        onFormSubmit={() => setIsEditForm(false)}
                        onFormCancel={() => setDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
            {pageShowRule === BotConfigPageShowRule.NO_LLM &&
                <EmptyAndCreateComponent
                    title={"需要先创建大模型才能配置机器人哦～"}
                    subTitle={"快去创建一个吧！"}
                    buttonText={"创建大模型 GO！"}
                    onButtonClick={() => {
                        router.push("/home/models");
                    }}
                />
            }

            {pageShowRule === BotConfigPageShowRule.NO_BOT &&
                 <EmptyAndCreateComponent
                     title={"您还未配置机器人哦～"}
                     subTitle={"快去创建一个吧！"}
                     buttonText={"创建机器人 +"}
                     onButtonClick={handleCreateBotClick}
                 />
            }

            {pageShowRule === BotConfigPageShowRule.HAVE_BOT &&
             <div className={`${styles.botListContainer}`}
             >
                 {botList.map(cardVO => {
                     return (
                     <div
                         key={cardVO.id}
                         onClick={() => {selectBot(cardVO)}}
                     >
                        <BotCard botCardVO={cardVO} />
                     </div>)
                 })}
                 <CreateCardComponent
                     width={360}
                     height={200}
                     plusSize={90}
                     onClick={handleCreateBotClick}
                 />
             </div>
            }
        </div>
    )
}

enum BotConfigPageShowRule {
    NO_LLM,
    NO_BOT,
    HAVE_BOT,
}
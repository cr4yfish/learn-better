"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import {Skeleton} from "@nextui-org/skeleton";
import { Switch } from "@nextui-org/switch";
import { useTheme } from "next-themes";

import { SessionState } from "@/types/auth";
import { Button } from "@/components/utils/Button";
import {  Settings } from "@/types/db";
import Icon from "../utils/Icon";
import { upsertSettings } from "@/utils/supabase/settings";

export default function EditSettingsCard({ sessionState } : { sessionState: SessionState }) {
    const [settings, setSettings] = useState<Settings>(sessionState.settings);
    const [isSaveLoading, setIsSaveLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const { setTheme } = useTheme();

    useEffect(() => {
        setSettings(sessionState.settings);
    }, [sessionState])

    const handleSaveSettings = async () => {
        if(!settings) return;

        setIsSaveLoading(true);
        setIsSaved(false);
        const res = await upsertSettings({
            ...settings,
            user: sessionState.user
        });
        if(res) {
            setIsSaved(true);
        }
        setIsSaveLoading(false);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSettingsChange = (key: string, value: any) => {
        if(!settings) return;
        setSettings({...settings, [key]: value});
    }

    const handleThemeChange = (value: boolean) => {
        setTheme(value ? "dark" : "light");
        handleSettingsChange("theme_is_dark", value);
    }

    return (
        <>
        <Card className=" text-black dark:text-white ">
            <CardHeader className=" font-bold">Settings</CardHeader>
            <CardBody className="flex flex-col gap-4">

                <Skeleton
                    isLoaded={!!settings}
                    className=" rounded-xl"
                >
                    <Input 
                        value={settings.gemini_api_key} 
                        label="Gemini API Key" 
                        type="password"
                        endContent={<div className=" h-full flex items-center justify-center"><Icon filled >key</Icon></div>} 
                        onChange={e => setSettings({...settings, gemini_api_key: e.target.value})}
                        isDisabled
                        description="The API is still stored in plain text. I'm working on a secure way to store it."
                    />
                </Skeleton>
                <Switch classNames={{ label: "text-black dark:text-white" }} isSelected={settings.theme_is_dark} onValueChange={handleThemeChange}  >Dark Mode</Switch>
            </CardBody>
            <CardFooter className="flex flex-row gap-4 items-center">
                <div className="flex flex-col gap-1">
                    <Button
                        isLoading={isSaveLoading}
                        isDisabled={!settings}
                        color="primary"
                        onClick={handleSaveSettings}
                    >
                        {isSaved ? "Saved" : "Save"}
                    </Button>
                    {isSaved && <span className="text-tiny">Refresh app to see effect</span>  }             
                </div>

            </CardFooter>
        </Card>
        </>
    )
}
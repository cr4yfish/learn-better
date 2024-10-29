
import { Switch } from "@nextui-org/switch";

import { Question } from "@/types/db";
import { cn } from "@/lib/utils";


export default function EditBoolean(
    { question, handleUpdateValue } 
    : 
    { question: Question, handleUpdateValue: (key: keyof Question, value: string | string[]) => void }
) {

    return (
        <>
        <div className="flex flex-col gap-1">
            <Switch
                isSelected={question.answers_correct?.includes("true") ?? false}
                onValueChange={(isTrue) => handleUpdateValue("answers_correct", isTrue ? ["true"] : ["false"])}
                classNames={{
                    base: cn(
                    "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
                    "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                    "data-[selected=true]:border-primary",
                    ),
                    wrapper: "p-0 h-4 overflow-visible",
                    thumb: cn("w-6 h-6 border-2 shadow-lg",
                    "group-data-[hover=true]:border-primary",
                    //selected
                    "group-data-[selected=true]:ml-6",
                    // pressed
                    "group-data-[pressed=true]:w-7",
                    "group-data-[selected]:group-data-[pressed]:ml-4",
                    ),
                }}
                >
                <div className="flex flex-col gap-1">
                    <p className="text-medium">Is it true?</p>
                    <p className="text-tiny text-default-400">
                        Select wether the Question Statement is True or False.
                    </p>
                </div>
                </Switch>

        </div>
        </>
    )
}
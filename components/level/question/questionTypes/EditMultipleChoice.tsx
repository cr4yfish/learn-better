
import { Input } from "@nextui-org/input";

import { Button } from "@/components/utils/Button";
import Icon from "@/components/ui/Icon";

import { Question } from "@/types/db";


export default function EditMultipleChoice(
    { question, handleUpdateValue, handleOptionValueChange } 
    : 
    { question: Question, handleUpdateValue: (key: keyof Question, value: string | string[]) => void, handleOptionValueChange: (value: string, index: number) => void }
) {

    return (
        <>
        <div className="flex flex-col gap-1">
            <span className=" font-semibold">Options</span>
            {question.answer_options?.map((option, index) => (
                <Input 
                    key={index} 
                    label={`Option ${index + 1}`} 
                    placeholder="Enter the option" 
                    value={option} 
                    onValueChange={(value) => handleOptionValueChange(value, index)}
                    description={question.answers_correct.includes(option) ? "Selected as correct answer" : ""}
                    endContent={(
                        <div className="flex flex-row items-center gap-1">
                            { question.answers_correct.includes(option) ? 
                                <Button 
                                    color="success" 
                                    variant="light" 
                                    isIconOnly
                                    onClick={() => handleUpdateValue("answers_correct", question.answers_correct.filter((o) => o != option))}
                                >
                                    <Icon filled color="success">check_circle</Icon> 
                                </Button> :
                                <Button 
                                    color="success" 
                                    variant="light" 
                                    isIconOnly
                                    onClick={() => handleUpdateValue("answers_correct", [...question.answers_correct, option])}
                                >
                                    <Icon color="success">check_circle</Icon>
                                </Button>
                            }
                            <Button 
                                color="danger" 
                                variant="light" 
                                isIconOnly
                                onClick={() => handleUpdateValue("answer_options", question.answer_options.filter((o, i) => i != index))}
                            >
                                <Icon color="danger">delete</Icon>
                            </Button>
                        </div>
                    )}
                />
            ))}
            <div className="mt-1">
                <Button 
                    color="warning" 
                    variant="light" 
                    startContent={<Icon color="warning" filled>add</Icon>}
                    onClick={() => handleUpdateValue("answer_options", question.answer_options ? [...question.answer_options, ""] : [""])}
                >
                    Add an option
                </Button>
            </div>
        </div>
        </>
    )
}
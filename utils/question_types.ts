import { Question_Type } from "@/types/db";


export const QuestionTypes: Record<"multiple_choice" | "boolean" | "fill_in_the_blank" | "match_the_words", Question_Type> = {
    "multiple_choice": {
        id: "5570443a-63bb-4158-b86a-a2cef3457cf0",
        title: "Multiple Choice",
        description: "Select the correct answers from a list of options.",
    },
    "boolean": {
        id: "33b2c6e5-df24-4812-a042-b5bed4583bc0",
        title: "Boolean",
        description: "True or False?",
    },
    "fill_in_the_blank": {
        id: "6335b9a6-2722-4ece-a142-4749f57e6fed",
        title: "Fill in the blank",
        description: "Fill in the blank with the correct answer.",
    },
    "match_the_words": {
        id: "7babe7ed-3e4c-408d-87e2-0420877d34c9",
        title: "Match the Cards",
        description: "Match Cards"
    }
}

import { QuestionTypes } from "@/utils/constants/question_types";
import { z } from "zod";

const multiple_choice_question = z.object({
    answers_correct: z.array(z.string().describe("A correct answer option, needs to match one of the answer options")).max(3).describe("The correct answer options. Choose between 1 and 3 options. Diversify the amount!"),
    answer_options: z.array(z.string()).describe("The answer options").max(4).min(2).describe("The answer options. Choose between 2 and 4 options."),
})

const true_false_question = z.object({
    answer_correct: z.boolean().describe("The correct answer")
})

const match_the_cards_question = z.object({
    answers_correct: 
        z.array(
            z.string()
            .describe("A match option")
        )
        .describe("The correct answer options. They cannot be the same as the answer options but have to match, logically, exactly one.")
        .max(5)
        .min(3),
    answer_options: 
        z.array(
            z.string()
            .describe("A match option")
        )
        .describe("The answer options. The index of each option should match the index of the matching answer. There should be less answer options than answers correct array elements.")
        .max(5)
        .min(3)
})

const fill_in_the_blank_question = z.object({
    answers_correct: 
        z.array(
            z.string().describe("A single word")
        )
        .min(4)
        .describe("The complete answer sentence. Seperated by word, each of which is one element in the array."),
    answer_options: 
        z.array(
            z.string().describe("A single word")
        )
        .min(4)
        .describe("The blanked out words in the answers_correct array. Each word is one element in the array and will be a blank to be filled out for the user."),
}).describe("A fill in the blank question. The answer options are the words that are blanked out in the answers_correct array.")

export const questionSchema = z.object({
    question_type: z.enum(Object.keys(QuestionTypes) as [string, ...string[]]).describe("The type of question. Choose the Question Type that best suits the Question."),
    title: z.string().describe("The title of the question"),
    question: z.string().describe("The question"),
    multiple_choice: multiple_choice_question.optional().describe("A multiple choice question"),
    true_false: true_false_question.optional().describe("A true false question"),
    match_card: match_the_cards_question.optional().describe("A match card question"),
    fill_in_the_blank: fill_in_the_blank_question.optional().describe("A fill in the blank question")
})


export const levelSchema = z.object({
    title: z.string().describe("The title of the level (DO NOT INCLUDE A LEVEL NUMBER)"),
    description: z.string().describe("The description of the level"),
    questions: z.array(questionSchema).describe("The questions in the level. Be as diverse as possible, utilizing all options in the schemas.")
})

export const courseSectionSchema = z.object({
    title: z.string().describe("The title of the course section"),
    description: z.string().describe("The description of the course section"),
    order: z.number().describe("The order of the course section"),
    levels: z.array(levelSchema).describe("The levels in the course section")
})

export const multipleLevelSchema = z.array(courseSectionSchema).describe("The course sections")
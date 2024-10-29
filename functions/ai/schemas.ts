
import { z } from "zod";

const multiple_choice_question = z.object({
    answers_correct: z.array(z.string().describe("A correct answer option, needs to match one of the answer options")).max(3).describe("The correct answer options. Choose between 1 and 3 options. Diversify the amount!"),
    answer_options: z.array(z.string()).describe("The answer options").max(4).min(2).describe("The answer options. Choose between 2 and 4 options."),
})

const true_false_question = z.object({
    answer_correct: z.boolean().describe("The correct answer")
})

export const questionSchema = z.object({
    question_type: z.enum(["multiple_choice", "true_false"]).describe("The type of question. Diversify the types."),
    title: z.string().describe("The title of the question"),
    question: z.string().describe("The question"),
    multiple_choice: multiple_choice_question.optional().describe("The multiple choice question"),
    true_false: true_false_question.optional().describe("The true false question"),
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
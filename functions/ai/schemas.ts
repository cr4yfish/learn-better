
import { z } from "zod";

export const questionSchema = z.object({
    title: z.string().describe("The title of the question"),
    question: z.string().describe("The question"),
    answer_correct: z.string().describe("The correct answer, needs to match one of the answer options"),
    answer_options: z.array(z.string()).describe("The answer options"),
})

export const levelSchema = z.object({
    title: z.string().describe("The title of the level (DO NOT INCLUDE A LEVEL NUMBER)"),
    description: z.string().describe("The description of the level"),
    questions: z.array(questionSchema).describe("The questions in the level")
})

export const courseSectionSchema = z.object({
    title: z.string().describe("The title of the course section"),
    description: z.string().describe("The description of the course section"),
    order: z.number().describe("The order of the course section"),
    levels: z.array(levelSchema).describe("The levels in the course section")
})

export const multipleLevelSchema = z.array(courseSectionSchema).describe("The course sections")
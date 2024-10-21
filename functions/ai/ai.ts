


import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createMistral } from "@ai-sdk/mistral";
import { convertToCoreMessages, Message, streamObject, streamText } from "ai"; 
import { downloadObject } from "../supabase/storage";
import { multipleLevelSchema } from "./schemas";

export async function createLevelFromPDF(
    { docName, apiKey, numLevels, courseSectionTitle, courseSectionDescription }: 
    { docName: string, apiKey: string, numLevels: number, courseSectionTitle: string, courseSectionDescription: string }) 
    {
    
    const hasCourseSection = courseSectionTitle.length > 0 && courseSectionDescription.length > 0;

    // Step 1: Download the PDF and get a buffer from it
    const blob = await downloadObject({ filename: docName, path: "/", bucketName: "documents" });
    const arrayBuffer = await blob.arrayBuffer();
    
    // Step 2: call the model and pass the PDF
    //const openai = createOpenAI({ apiKey: apiKey });
    const gooogle = createGoogleGenerativeAI({ apiKey: apiKey });

    const newCourseSectionsPrompt = `
    "Create as many course sections as needed and assign each level to a section. A Course Section SHOULD HAVE multiple levels.
    `

    const existingCourseSectionsPrompt = `
    "Only create levels for the the given course section title and description. Ignore everything else in the source document.

    Course Section Title: ${courseSectionTitle}.
    Course Section Description: ${courseSectionDescription}.
    `
    
    const result = await streamObject({ 
        model: gooogle("gemini-1.5-flash"),
        schema: multipleLevelSchema,
        messages: [
            {
                role: "user",
                content: [
                    { 
                        type: "text", 
                        text: `
                        Create exactly ${numLevels} unique Levels and at least 4 Questions per Level based solely on the provided document. 
                        Do not include duplicate levels. 
                        ${hasCourseSection ? existingCourseSectionsPrompt : newCourseSectionsPrompt}
                        `
                    },
                    {
                        type: "file",
                        mimeType: "application/pdf",
                        data: arrayBuffer
                    }
                ]
            }
        ]
    })
    

    return result
}

export async function explainAnswer({
    apiKey, messages
} : {
    apiKey: string; messages: Message[]
}) {

    const mistral = createMistral({ apiKey: apiKey });

    const result = await streamText({
        model: mistral("open-mistral-7b"),
        system: "You are a helpful teacher, explaining why the correct answer is correct and why the incorrect answer by the user is incorrect. You can only answer in 1-2 short sentences.",
        messages: convertToCoreMessages(messages)
    })

    return result;
}
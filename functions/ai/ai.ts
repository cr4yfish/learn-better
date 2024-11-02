/* eslint-disable @typescript-eslint/no-explicit-any */



import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createMistral } from "@ai-sdk/mistral";
import { convertToCoreMessages, Message, streamObject, streamText, UserContent } from "ai"; 
import { downloadObject } from "../../utils/supabase/storage";
import { multipleLevelSchema } from "./schemas";

function createLevelPrompt({ hasCourseSection, title, description } : { hasCourseSection: boolean, title: string, description: string }) {
    const newCourseSectionsPrompt = `
    "Create as many course sections as needed and assign each level to a section. A Course Section SHOULD HAVE multiple levels.
    `

    const existingCourseSectionsPrompt = `
    "Only create levels for the the given course section title and description. Ignore everything else in the source document.

    Course Section Title: ${title}.
    Course Section Description: ${description}.
    `

    if(hasCourseSection) {
        return existingCourseSectionsPrompt;
    } else {
        return newCourseSectionsPrompt;
    }
}

const pdfUserMessage = (numLevels: number, courseSectionsPrompt: string) => {
    return { 
        type: "text", 
        text: `
        Create exactly ${numLevels} unique Levels and at least 4 Questions per Level based solely on the provided document. 
        Do not include duplicate levels. Include a diverse set of questions, utilizing multiple question types.
        ${courseSectionsPrompt}
        `
    }
}

const pdfAttatchment = (arrayBuffer: ArrayBuffer) => {
    return {
        type: "file",
        mimeType: "application/pdf",
        data: arrayBuffer
    }
}

const htmlUserMessage = (numLevels: number, courseSectionsPrompt: string, html: string) => {
    return { 
        type: "text", 
        text: `
        Create exactly ${numLevels} unique Levels and at least 4 Questions per Level based solely on the provided document. 
        Do not include duplicate levels. 
        ${courseSectionsPrompt}
        
        This is the document:
        ${html}
        `
    }
}

export async function createLevelFromDocument(
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

    const courseSectionsPrompt = createLevelPrompt({ hasCourseSection, title: courseSectionTitle, description: courseSectionDescription });
    
    const isPDF = docName.endsWith(".pdf");

    const content: UserContent = [];

    if(isPDF) {
        content.push(pdfUserMessage(numLevels, courseSectionsPrompt) as any);
        content.push(pdfAttatchment(arrayBuffer) as any);
    } else {
        const html = await blob.text();
        content.push(htmlUserMessage(numLevels, courseSectionsPrompt, html) as any);
    }

    const result = await streamObject({ 
        model: gooogle("gemini-1.5-flash"),
        schema: multipleLevelSchema,
        messages: [
            {
                role: "user",
                content: content
            }
        ]
    })
    

    return result;
}

export async function explainAnswer({
    apiKey, messages
} : {
    apiKey: string; messages: Message[]
}) {

    const mistral = createMistral({ apiKey: apiKey });

    const result = await streamText({
        model: mistral("open-mistral-nemo"),
        system: "You are a helpful teacher, explaining why the correct answer is correct and why the incorrect answer by the user is incorrect. You can only answer in 1-2 short sentences. Answer in Markdown format only.",
        messages: convertToCoreMessages(messages)
    })

    return result;
}
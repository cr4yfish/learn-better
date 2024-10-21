


import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamObject } from "ai"; 
import { downloadObject } from "../supabase/storage";
import { multipleLevelSchema } from "./schemas";

export async function createLevelFromPDF(
    { docName, apiKey, numLevels } : 
    { docName: string, apiKey: string, numLevels: number }) 
    {
    
    // Step 1: Download the PDF and get a buffer from it
    const blob = await downloadObject({ filename: docName, path: "/", bucketName: "documents" });
    const arrayBuffer = await blob.arrayBuffer();
    
    // Step 2: call the model and pass the PDF
    //const openai = createOpenAI({ apiKey: apiKey });
    const gooogle = createGoogleGenerativeAI({ apiKey: apiKey });
    
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
                        Create exactly ${numLevels} unique Levels and Questions based solely on the provided document. 
                        Do not include duplicate levels. Create as many course sections as needed and assign each level to a section. 
                        A Course Section SHOULD HAVE multiple levels.
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
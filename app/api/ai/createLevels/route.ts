
import { createLevelFromPDF } from "@/functions/ai/ai";

export async function POST(req: Request) {
    const context = await req.json();

    // headers
    const apiKey = req.headers.get("X-api-key");
    const docName = req.headers.get("X-doc-name");
    const numLevels = req.headers.get("X-num-levels");

    console.log("AI:",apiKey, docName, context);

    if(apiKey === null || docName === null || apiKey.length == 0 || docName.length == 0) {
        return {
            status: 400,
            body: "Missing required headers"
        }
    }

    const result = await createLevelFromPDF({
        docName: docName,
        apiKey: apiKey,
        numLevels: numLevels ? parseInt(numLevels) : 1
    });


    return result.toTextStreamResponse();
}
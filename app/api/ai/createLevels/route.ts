
import { createLevelFromPDF } from "@/functions/ai/ai";

export async function POST(req: Request) {
    //const context = await req.json();

    // headers
    const apiKey = req.headers.get("X-api-key");
    const docName = req.headers.get("X-doc-name");
    const numLevels = req.headers.get("X-num-levels");
    const courseSectionTitle = req.headers.get("X-course-section-title");
    const courseSectionDescription = req.headers.get("X-course-section-description");

    if(apiKey === null || docName === null || apiKey.length == 0 || docName.length == 0) {
        return new Response("Missing API key or doc name", {status: 400});
    }

    const result = await createLevelFromPDF({
        docName: docName,
        apiKey: apiKey,
        numLevels: numLevels ? parseInt(numLevels) : 1,
        courseSectionTitle: courseSectionTitle || "",
        courseSectionDescription: courseSectionDescription || ""
    });


    return result.toTextStreamResponse();
}
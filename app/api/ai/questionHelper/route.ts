
import { explainAnswer } from "@/utils/functions/ai/ai";

export async function POST(req: Request) {
    const {messages} = await req.json();

    // headers
    //const apiKey = req.headers.get("X-api-key");
    const apiKey = process.env.MISTRAL_API_KEY!;

    const result = await explainAnswer({
        apiKey: apiKey,
        messages: messages
    });

    return result.toDataStreamResponse();
}
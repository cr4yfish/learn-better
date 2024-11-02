
import { createMistral } from '@ai-sdk/mistral';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const apiKey = process.env.MISTRAL_API_KEY!;
  const mistral = createMistral({ apiKey: apiKey });

  const result = await streamText({
      model: mistral("open-mistral-nemo"),
      system: "You are a helpful teacher. You only answer questions related to the course. Your answer has to be in markdown format.",
      messages
  })

  return result.toDataStreamResponse();
}
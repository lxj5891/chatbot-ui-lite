import { Message } from "@/types";
import { OpenAIStream } from "@/utils";

export const config = {
  runtime: "edge"
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { messages } = (await req.json()) as {
      messages: Message[];
    };

    const timesLimit = 10;
    const charLimit = 1200;
    let charCount = 0;
    let messagesToSend = [];
    if (messages.length > timesLimit) {
      return new Response("您已经体验超过10次。", { status: 500 });
    }

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      if (charCount + message.content.length > charLimit) {
        return new Response("您已经体验超过10次。", { status: 500 });
      }
      
      charCount += message.content.length;
      messagesToSend.push(message);
    }

    const stream = await OpenAIStream(messagesToSend);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

export default handler;

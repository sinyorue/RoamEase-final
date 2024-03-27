import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import openai, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import { OpenAIStream, StreamingTextResponse } from "ai";

/**
 * Handles a POST request to the chat API route.
 *
 * Receives chat messages in the request body, queries Pinecone
 * for relevant notes using the message embedding, retrieves
 * the notes from the database, constructs a system message
 * with the notes, sends the messages to OpenAI for completion,
 * and returns the OpenAI response as a stream.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;

    const messagesTruncated = messages.slice(-10);

    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n"),
    );

    const { userId } = auth();

    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 1,
      filter: { userId },
    });
    const releventNotes = await prisma.note.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((match) => match.id),
        },
      },
    });

    console.log("relevant notes found :", releventNotes);

    const systemMessage: ChatCompletionMessage = {
      role: "assistant",
      content:
        "You are a Traveling advisor, you answer user questions based on your knowledge of the world and existing notes. " +
        "the relevent notes for this query are:\n " +
        releventNotes
          .map((note) => `Title: ${note.title}\n\n${note.content}`)
          .join("\n\n"),
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "internal server error" }, { status: 500 });
  }
}

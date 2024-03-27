import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/validation/note";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import { getEmbedding } from "@/lib/openai";
import { notesIndex } from "@/lib/db/pinecone";

/**
 * Updates a note by ID.
 *
 * Validates the update request body against the updateNoteSchema.
 * Checks that the note exists and belongs to the authenticated user.
 * Updates the note title and content in the database.
 * Generates a new embedding for the updated note and indexes it in Pinecone.
 *
 * Returns 200 if successful, or an error status code.
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const parseResults = await updateNoteSchema.safeParse(body);

    if (!parseResults.success) {
      console.error(parseResults.error);
      return new Response(JSON.stringify({ error: "invalid input" }), {
        status: 400,
      });
    }

    const { id, title, content } = parseResults.data;

    const note = await prisma.note.findUnique({ where: { id } });
    if (!note) {
      return Response.json({ error: "note not found" }, { status: 404 });
    }

    const { userId } = auth();

    if (!userId || userId !== note.userId) {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }

    const embedding = await getEmbeddingForNote(title, content);
    const updatedNote = await prisma.$transaction(async (tx) => {
      const updatedNote = await tx.note.update({
        where: { id },
        data: {
          title,
          content,
        },
      });

      await notesIndex.upsert([
        {
          id,
          values: embedding,
          metadata: { userId },
        },
      ]);
      return updatedNote;
    });

    return Response.json({ updatedNote }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "internal server error" }, { status: 500 });
  }
}
/**
 * Deletes a note by ID.
 *
 * Validates the delete request body, checks that the note exists and belongs to the authenticated user,
 * deletes the note from the database, removes it from search indexing, and returns a 200 response.
 *
 * Returns 404 if note not found, 401 if not authorized, 400 on invalid input, or 500 on any other error.
 */
export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    const parseResults = await deleteNoteSchema.safeParse(body);

    if (!parseResults.success) {
      console.error(parseResults.error);
      return Response.json({ error: "invalid input" }, { status: 400 });
    }

    const { id } = parseResults.data;

    const note = await prisma.note.findUnique({ where: { id } });
    if (!note) {
      return Response.json({ error: "note not found" }, { status: 404 });
    }

    const { userId } = auth();

    if (!userId || userId !== note.userId) {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.note.delete({ where: { id } });

      await notesIndex.deleteOne(id);
    });

    return Response.json({ message: "Note Deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "internal server error" }, { status: 500 });
  }
}

/**
 * Gets an embedding vector for the given note title and content.
 *
 * Combines the title and content into a single string, and generates
 * an embedding vector for that string using the getEmbedding() function.
 * Handles undefined content by converting to empty string.
 */
async function getEmbeddingForNote(title: string, content: string | undefined) {
  return getEmbedding(title + "\n\n" + content ?? "");
}

import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/validation/note";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import { getEmbedding } from "@/lib/openai";
import { notesIndex } from "@/lib/db/pinecone";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parseResults = await createNoteSchema.safeParse(body);

    if (!parseResults.success) {
      console.error(parseResults.error);
      return Response.json({ error: "invalid input" }), { status: 400 };
    }

    const { title, content } = parseResults.data;

    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }

    const embedding = await getEmbeddingForNote(title, content);

    const note = await prisma.$transaction(async (tx) => {
      const note = await tx.note.create({
        data: {
          title,
          content,
          userId,
        },
      });
      await notesIndex.upsert([
        {
          id: note.id,
          values: embedding,
          metadata: { userId },
        },
      ]);
      return note;
    });

    return Response.json({ note });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "internal server error" }, { status: 500 });
  }
}
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const parseResults = await updateNoteSchema.safeParse(body);

    if (!parseResults.success) {
      console.error(parseResults.error);
      return Response.json({ error: "invalid input" }), { status: 400 };
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
export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    const parseResults = await deleteNoteSchema.safeParse(body);

    if (!parseResults.success) {
      console.error(parseResults.error);
      return Response.json({ error: "invalid input" }), { status: 400 };
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

async function getEmbeddingForNote(title: string, content: string | undefined) {
  return getEmbedding(title + "\n\n" + content ?? "");
}

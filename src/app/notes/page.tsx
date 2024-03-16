import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import Note from "@/components/Note";

export default async function NavBar() {
  const { userId } = auth();

  if (!userId) {
    throw Error("userID undefined");
  }

  const allNotes = await prisma.note.findMany({ where: { userId } });
  return (
    <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {allNotes.map((note) => (
        <Note note={note} key={note.id} />
      ))}
      {allNotes.length === 0 && (
        <div className="col-span-full text-center">
          you have no holiday plans press at add note to add one
        </div>
      )}
    </div>
  );
}

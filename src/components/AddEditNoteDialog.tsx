import { CreateNoteSchema, createNoteSchema } from "@/lib/validation/note";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import LoadingButton from "./ui/loading-button";
import { useRouter } from "next/navigation";
import { set } from "zod";
import { Note } from "@prisma/client";
import { useState } from "react";

/**
 * Props for the AddEditNoteDialog component.
 *
 * open: Whether the dialog is open.
 * setOpen: Callback to update open state.
 * noteToEdit: Optional note being edited.
 */
interface AddEditNoteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  noteToEdit?: Note;
}

export default function AddEditNoteDialog({
  open,
  setOpen,
  noteToEdit,
}: AddEditNoteDialogProps) {
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const router = useRouter();

  /**
   * Initialize the form state with the zod resolver and default values.
   * If noteToEdit is provided, default to its title and content.
   */
  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: noteToEdit?.title || "",
      content: noteToEdit?.content || "",
    },
  });

  /**
   * Submits the form data to the API to create or update a note.
   * On success, refreshes the router and closes the dialog.
   * On failure, displays an error alert.
   */
  async function onSubmit(input: CreateNoteSchema) {
    try {
      if (noteToEdit) {
        const response = await fetch("/api/notes", {
          method: "PUT",
          body: JSON.stringify({
            id: noteToEdit.id,
            ...input,
          }),
        });
        if (!response.ok) throw Error("Status code:" + response.status);
      } else {
        const response = await fetch("/api/notes", {
          method: "POST",
          body: JSON.stringify(input),
        });

        if (!response.ok) throw Error("Status code:" + response.status);
        form.reset();
      }

      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong please try again later");
    }
  }
  /**
   * Deletes the note being edited.
   * Sets deleteInProgress to true, makes a DELETE request to the API,
   * and refreshes the router on success.
   * Handles errors by logging to console and showing alert.
   * Finally sets deleteInProgress back to false.
   */
  async function deleteNote() {
    if (!noteToEdit) return;
    setDeleteInProgress(true);
    try {
      const response = await fetch("/api/notes", {
        method: "DELETE",
        body: JSON.stringify({
          id: noteToEdit.id,
        }),
      });
      if (!response.ok) throw Error("Status code:" + response.status);
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong please try again later");
    } finally {
      setDeleteInProgress(false);
    }
  }

  /**
   * Renders a dialog containing a form to add or edit a note.
   * The dialog is opened/closed based on the `open` prop.
   * The form handles submitting to add a new note or update an existing one based on if
   * `noteToEdit` is passed.
   * Deleting notes is also handled if `noteToEdit` is present.
   * Form submission is wrapped in try/catch to handle errors.
   * The router is refreshed on successful submit or delete.
   */
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{noteToEdit ? "Edit Plan" : "Add Plan"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tittle</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plans</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Plan Content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-1 sm:gap-0">
              {noteToEdit && (
                <LoadingButton
                  type="button"
                  variant={"destructive"}
                  onClick={deleteNote}
                  loading={deleteInProgress}
                  disabled={form.formState.isSubmitting}
                >
                  Delete
                </LoadingButton>
              )}
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
                disabled={deleteInProgress}
              >
                Save
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

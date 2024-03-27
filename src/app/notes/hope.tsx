"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo-1.png";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddNoteDialog from "@/components/AddEditNoteDialog";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import AIChatButton from "@/components/AIChatButton";

/**
 * Renders the main app UI with header, buttons, and add note dialog.
 * - Uses Clerk for authentication.
 * - Has buttons to navigate to different pages.
 * - Shows add note dialog when add button clicked.
 * - Has theme toggle button.
 */
export default function HopeNV() {
  const { theme } = useTheme();
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  return (
    <>
      <div className=" p-4 shadow">
        <div className="flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link href="/search" className="flex items-center gap-1">
            <Image src={logo} alt="RoamEase" width={40} height={40} />
            <span className="font-bold"> RoamEase</span>
          </Link>
          <div className="flex place-items-end gap-1">
            <ThemeToggleButton />
            <Button>
              <Link href="/maps">Map</Link>
            </Button>
            <Button>
              <Link href="/search">Search</Link>
            </Button>

            <Button onClick={() => setShowAddEditNoteDialog(true)}>
              <Plus size={20} className="mr-2" />
              Add Plans
            </Button>
            <AIChatButton />
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                baseTheme: theme === "dark" ? dark : undefined,
                elements: { avatarBox: { width: "2.5rem", height: "2.5em" } },
              }}
            />
          </div>
        </div>
      </div>
      <AddNoteDialog
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
      />
    </>
  );
}

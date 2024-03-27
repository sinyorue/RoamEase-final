import Image from "next/image";
import logo from "@/assets/logo-1.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

/**
 * Renders the home page.
 *
 * If the user is authenticated, redirects to the /search page.
 * Otherwise, renders the home page with:
 * - Logo and title
 * - Description text
 * - Navigation buttons to the /maps, /search, and /notes pages
 */
export default function Home() {
  const { userId } = auth();

  if (userId) redirect("/search");
  return (
    <main className="flex h-screen flex-col items-center justify-center shadow">
      <div className=" flex items-center justify-center">
        <Image src={logo} alt="RoamEase" width={200} height={200} />
        <span className="text-5xl font-extrabold tracking-tight sm:text-4xl lg:text-6xl">
          RoamEase
        </span>
      </div>
      <p className="max-w-prose text-center">
        This is a AI traveling notes app.
      </p>
      <div className="inline-flex items-center gap-4">
        <Button size="lg" asChild>
          <Link href="/maps">Map</Link>
        </Button>
        <Button size="lg" asChild>
          <Link href="/search">Search</Link>
        </Button>
        <Button size="lg" asChild>
          <Link href="/notes">Holiday Plans</Link>
        </Button>
      </div>
    </main>
  );
}

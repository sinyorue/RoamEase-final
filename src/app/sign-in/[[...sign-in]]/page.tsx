import { SignIn } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "RoamEase - Sign in",
};

/**
 * Renders the SignInPage component, which displays a Clerk SignIn component
 * with custom styling.
 */
export default function SignInPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignIn appearance={{ variables: { colorPrimary: "#F17619" } }} />
    </div>
  );
}

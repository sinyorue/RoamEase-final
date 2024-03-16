import type { Metadata } from "next";
import { Raleway } from "next/font/google";

import HopeNV from "./hope";

const raleway = Raleway({ subsets: ["latin"] });

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HopeNV />

      <main className="m-auto max-w-7xl p-4 ">{children}</main>
    </>
  );
}

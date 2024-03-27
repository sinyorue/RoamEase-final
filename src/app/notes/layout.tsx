import HopeNV from "./hope";

/**
 * Default layout component.
 * Wraps the page content in a header, footer, and centers content.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HopeNV />

      <main className="m-auto max-w-7xl p-4 ">{children}</main>
    </>
  );
}

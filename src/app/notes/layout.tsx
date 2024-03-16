import HopeNV from "./hope";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HopeNV />

      <main className="m-auto max-w-7xl p-4 ">{children}</main>
    </>
  );
}

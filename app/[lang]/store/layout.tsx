import { tajawal } from "@/app/fonts";
import StoreHeader from "./_components/store-header";

export default async function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={tajawal.className}>
      <StoreHeader />
      {children}
    </main>
  );
}

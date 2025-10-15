import { tajawal } from "@/app/fonts";
import StoreHeader from "./_components/store-header";
import { getDictionary } from "../dictionaries";

export default async function StoreLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: any;
}>) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <main className={tajawal.className}>
      <StoreHeader dict={dict} lang={lang} />
      {children}
    </main>
  );
}

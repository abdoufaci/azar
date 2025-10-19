import { tajawal } from "@/app/fonts";
import StoreHeader from "./_components/store-header";
import { getDictionary } from "../dictionaries";
import NextTopLoader from "nextjs-toploader";

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
      <NextTopLoader
        color="#F2BA05"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={true}
        easing="ease"
        speed={200}
        shadow="0 0 10px #F2BA05,0 0 5px #F2BA05"
      />
      <StoreHeader dict={dict} lang={lang} />
      {children}
    </main>
  );
}

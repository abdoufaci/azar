import { getDictionary } from "../../dictionaries";
import FiltersBar from "../_components/filters-bar";
import ProductsFeed from "../_components/products-feed";

async function SalonPage({ params }: any) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="space-y-10 pt-20">
      <div
        dir={lang === "ar" ? "rtl" : "ltr"}
        className="flex flex-col items-center gap-7">
        <h1 className="text-2xl font-bold text-[#272727]">
          {dict?.storeHeader.chair}
        </h1>
        <FiltersBar lang={lang} dict={dict} />
      </div>
      <ProductsFeed lang={lang} dict={dict} key={"CHAIR"} type="CHAIR" />
    </div>
  );
}

export default SalonPage;

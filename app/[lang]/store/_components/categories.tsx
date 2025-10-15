import { getProducts } from "@/actions/queries/products/get-products";
import CategoryProducts from "./category-products";
import { getStoreProducts } from "@/actions/queries/products/get-store-products";

interface Props {
  dict: any;
  lang: any;
}

async function Categories({ dict, lang }: Props) {
  const products = await getStoreProducts();

  return (
    <div className="container mx-auto space-y-16 !mb-40">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold text-[#272727]">
          {dict.categories.title}
        </h1>
        <p className="text-lg md:text-xl text-[#747474] max-w-4xl mx-auto leading-relaxed">
          {dict.categories.subTitle}
        </p>
      </div>
      <div className="space-y-12">
        <CategoryProducts
          title={lang === "ar" ? "صالونات" : "Salons"}
          products={products}
          dict={dict}
          lang={lang}
        />
        <CategoryProducts
          title={lang === "ar" ? "كراسي" : "Chaises"}
          products={products}
          dict={dict}
          lang={lang}
        />
      </div>
    </div>
  );
}

export default Categories;

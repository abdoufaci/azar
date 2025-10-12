import { getProducts } from "@/actions/queries/products/get-products";
import CategoryProducts from "./category-products";
import { getStoreProducts } from "@/actions/queries/products/get-store-products";

async function Categories() {
  const products = await getStoreProducts();

  return (
    <div className="container mx-auto space-y-16 !mb-40">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold text-[#272727]">
          القطعة المناسبة لكل ركن في منزلك
        </h1>
        <p className="text-lg md:text-xl text-[#747474] max-w-4xl mx-auto leading-relaxed">
          من الأرائك الأنيقة إلى طاولات الطعام المتينة، نقدم مجموعات تناسب جميع
          الأذواق وأنماط الحياة.
        </p>
      </div>
      <div className="space-y-12">
        <CategoryProducts title="صالونات" products={products} />
        <CategoryProducts title="كراسي" products={products} />
      </div>
    </div>
  );
}

export default Categories;

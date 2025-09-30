import { getDictionary } from "../dictionaries";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import StoreHeader from "./_components/store-header";
import Banner from "./_components/banner";
import Products from "./_components/products";
import FurnitureShowcase from "./_components/show-case";
import Footer from "./_components/footer";
import { cn } from "@/lib/utils";
import { tajawal } from "@/app/fonts";
import ProductsNavigation from "./_components/products-navigation";
import Slogan from "./_components/slogan";
import CategoryProducts from "./_components/category-products";
import Categories from "./_components/categories";

async function StorePage({ params }: any) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return (
    <div className={cn("space-y-20", tajawal.className)}>
      <div className="md:!-mb-40">
        <Banner />
        <ProductsNavigation />
      </div>
      <Products />
      <Categories />
      <div className="-space-y-20">
        <FurnitureShowcase />
        <Slogan />
      </div>
      <Footer />
    </div>
  );
}

export default StorePage;

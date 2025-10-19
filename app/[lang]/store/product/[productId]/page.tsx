import { getProductById } from "@/actions/queries/products/get-product-by-id";
import Footer from "../../_components/footer";
import ProductDetails from "./_components/product-details";
import { getTissues } from "@/actions/queries/products/get-tissues";
import { getDictionary } from "@/app/[lang]/dictionaries";

interface Props {
  params: { lang: string; productId: string };
}

async function ProductPage({ params: { lang, productId } }: Props) {
  const dict = await getDictionary(lang);
  const product = await getProductById(productId);
  const tissues = await getTissues();

  return (
    <div>
      <ProductDetails
        product={product}
        tissues={tissues}
        dict={dict}
        lang={lang}
      />
      <Footer dict={dict} lang={lang} />
    </div>
  );
}

export default ProductPage;

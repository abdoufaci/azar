import { getProductById } from "@/actions/queries/products/get-product-by-id";
import Footer from "../../_components/footer";
import ProductDetails from "./_components/product-details";
import { getTissues } from "@/actions/queries/products/get-tissues";

interface Props {
  params: { lang: string; productId: string };
}

async function ProductPage({ params: { lang, productId } }: Props) {
  const product = await getProductById(productId);
  const tissues = await getTissues();

  return (
    <div>
      <ProductDetails product={product} tissues={tissues} />
      <Footer />
    </div>
  );
}

export default ProductPage;

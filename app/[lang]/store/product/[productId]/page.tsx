import ProductDetails from "./_components/product-details";

interface Props {
  params: { lang: string; productId: string };
}

function ProductPage({ params: { lang, productId } }: Props) {
  return (
    <div>
      <ProductDetails />
    </div>
  );
}

export default ProductPage;

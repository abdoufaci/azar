import CategoryProducts from "./category-products";

function Categories() {
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
        <CategoryProducts
          title="صالونات"
          products={[
            {
              id: 1,
              name: "Florence",
              image: "/product.png",
              price: "140 000 Da",
              startingFrom: "ابتداءً من",
            },
            {
              id: 2,
              name: "Milano",
              image: "/product.png",
              price: "140 000 Da",
              startingFrom: "ابتداءً من",
            },
            {
              id: 3,
              name: "Roma",
              image: "/product.png",
              price: "140 000 Da",
              startingFrom: "ابتداءً من",
            },
            {
              id: 4,
              name: "Venice",
              image: "/product.png",
              price: "140 000 Da",
              startingFrom: "ابتداءً من",
            },
          ]}
        />
        <CategoryProducts
          title="طاولات"
          products={[
            {
              id: 1,
              name: "Florence",
              image: "/product.png",
              price: "140 000 Da",
              startingFrom: "ابتداءً من",
            },
            {
              id: 2,
              name: "Milano",
              image: "/product.png",
              price: "140 000 Da",
              startingFrom: "ابتداءً من",
            },
            {
              id: 3,
              name: "Roma",
              image: "/product.png",
              price: "140 000 Da",
              startingFrom: "ابتداءً من",
            },
            {
              id: 4,
              name: "Venice",
              image: "/product.png",
              price: "140 000 Da",
              startingFrom: "ابتداءً من",
            },
          ]}
        />
        <CategoryProducts
          title="كراسي"
          products={[
            {
              id: 1,
              name: "Florence",
              image: "/product.png",
              price: "140 000 Da",
              startingFrom: "ابتداءً من",
            },
            {
              id: 2,
              name: "Milano",
              image: "/product.png",
              price: "140 000 Da",
              startingFrom: "ابتداءً من",
            },
            {
              id: 3,
              name: "Roma",
              image: "/product.png",
              price: "140 000 Da",
              startingFrom: "ابتداءً من",
            },
            {
              id: 4,
              name: "Venice",
              image: "/product.png",
              price: "140 000 Da",
              startingFrom: "ابتداءً من",
            },
          ]}
        />
      </div>
    </div>
  );
}

export default Categories;

import React from "react";

function ProductsNavigation() {
  return (
    <section className="flex items-center justify-center transform md:!-translate-y-3/4 w-full z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Living Room */}
          <div className="relative group cursor-pointer">
            <div className="aspect-[4/4] overflow-hidden shadow-2xl">
              <img
                src="/salon.png"
                alt="صالون عصري"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
            <div className="absolute bottom-6 right-6">
              <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                صالون
              </h3>
            </div>
          </div>

          {/* Tables */}
          <div className="relative group cursor-pointer">
            <div className="aspect-[4/4]  overflow-hidden shadow-2xl">
              <img
                src="/tables.png"
                alt="طاولات عصرية"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
            <div className="absolute bottom-6 right-6">
              <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                طاولات
              </h3>
            </div>
          </div>

          {/* Chairs */}
          <div className="relative group cursor-pointer">
            <div className="aspect-[4/4]  overflow-hidden shadow-2xl">
              <img
                src="/chair.png"
                alt="كراسي عصرية"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
            <div className="absolute bottom-6 right-6">
              <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                كراسي
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductsNavigation;

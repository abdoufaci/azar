import Image from "next/image";

export default function FurnitureShowcase() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f9f7ef" }}>
      <div className="container mx-auto py-28 pb-72">
        {/* Header Section */}
        <div className="text-center">
          <p className="text-lg mb-2" style={{ color: "#616161" }}>
            Share your setup with
          </p>
          <h1 className="text-4xl font-bold">
            <span className="text-[#F2BA05]">#Azar</span>
            <span style={{ color: "#3a3a3a" }}>Furniture</span>
          </h1>
        </div>
        <Image
          alt="show-case"
          src={"/show-case.svg"}
          height={500}
          width={500}
          className="w-full aspect-auto object-cover"
        />
      </div>
    </div>
  );
}

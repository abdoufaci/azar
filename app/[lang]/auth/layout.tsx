import Image from "next/image";
import React from "react";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full flex flex-col items-center">
      <div className="w-full flex justify-center h-20">
        <Image
          alt="logo"
          src={"/logo.svg"}
          height={150}
          width={250}
          className="object-contain"
        />
      </div>
      <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] gap-10 w-[90%] mx-auto">
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;

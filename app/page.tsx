import { currentUser } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    redirect("/auth/login");
  }

  redirect("/management");
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
  );
}

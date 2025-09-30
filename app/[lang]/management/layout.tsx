import { poppins } from "@/app/fonts";
import ManagementHeader from "@/components/management-header";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/data/user";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}

export default async function RootLayout({ children }: Props) {
  const auth = await currentUser();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className={poppins.className}>
        <ManagementHeader user={auth} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

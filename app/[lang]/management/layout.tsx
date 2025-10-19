import { poppins } from "@/app/fonts";
import ManagementHeader from "@/components/management-header";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { currentUser } from "@/lib/auth";
import NextTopLoader from "nextjs-toploader";

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
        <NextTopLoader
          color="#1E78FF"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #1E78FF,0 0 5px #1E78FF"
        />
        <ManagementHeader user={auth} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

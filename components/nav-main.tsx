"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon | (() => React.JSX.Element);
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const type = searchParams.get("type");
  const MainPartLink = pathname.slice(3);
  const categoryLink = `${MainPartLink}?category=${category}`;
  const typeLink = `${MainPartLink}?category=${category}`;

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item, idx) =>
          item.items ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.url === MainPartLink}
              className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          className={cn(
                            "",
                            (subItem.url === categoryLink ||
                              subItem.url === typeLink) &&
                              "bg-[#0582FE0F] hover:bg-[#0582FE0F] text-[#182233] font-medium"
                          )}
                          asChild>
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={idx}>
              <SidebarMenuButton
                className={cn(
                  "",
                  item.url === MainPartLink &&
                    "bg-[#0582FE0F] hover:bg-[#0582FE0F] text-[#182233] font-medium"
                )}
                tooltip={item.title}
                asChild>
                <Link href={item.url}>
                  {item.icon && (
                    <item.icon
                      className={cn(
                        "",
                        item.url === MainPartLink && "text-brand"
                      )}
                    />
                  )}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

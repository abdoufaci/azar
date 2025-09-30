import { Commands } from "@/components/svgs/commands";
import { Demands } from "@/components/svgs/demands";
import { Production } from "@/components/svgs/production";
import { Workshop } from "@/components/svgs/workshop";
import {
  Building2,
  Landmark,
  LayoutDashboard,
  ListTodo,
  Menu,
  Settings,
  Tag,
  User2,
  UsersRound,
} from "lucide-react";

export const AdminNav = [
  {
    title: "Dashboard",
    url: "/management",
    icon: LayoutDashboard,
  },
  {
    title: "Produits",
    url: "/management/products",
    icon: Tag,
  },
  {
    title: "Command Client",
    url: "/management/orders",
    icon: Commands,
  },
  {
    title: "Production",
    url: "/management/production",
    icon: Production,
  },
  {
    title: "Demands",
    url: "/management/demands",
    icon: Demands,
  },
  {
    title: "L’atelier",
    url: "/management/workshops",
    icon: Workshop,
  },
  {
    title: "Members",
    url: "/management/members",
    icon: UsersRound,
  },
  {
    title: "Settings",
    url: "/management/settings",
    icon: Settings,
  },
];

export const ClientDashboardNav = [
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: ListTodo,
  },
  {
    title: "Payment",
    url: "/dashboard/payments",
    icon: Landmark,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export const companiesNav = (dict: any) => [
  {
    title: "All Categories",
    url: "/companies",
    icon: Menu,
    items: [
      {
        title: `${dict?.company?.clothes}`,
        url: "/companies?category=clothes",
      },
      {
        title: `${dict?.company?.makeup}`,
        url: "/companies?category=makeup",
      },
      {
        title: `${dict?.company?.food}`,
        url: "/companies?category=food",
      },
    ],
  },
];

import SearchFilter from "@/components/filters/search-filter";
import WorkShopFilter from "@/components/filters/workshop-filter";
import TypeFilter from "@/components/filters/type-filter";
import PriorityFilter from "@/components/filters/priority-filter";
import StatusFilter from "@/components/filters/status-filter";
import { OpenDialogButton } from "@/components/open-dialog-button";
import { OrdersTable } from "./_components/orders-table";

export default async function DemandesPage({
  searchParams,
}: {
  params: any;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  return (
    <div className="min-h-screen p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-medium text-[#06191D]">
            Command De Client
          </h1>
        </div>
        <div className="flex items-center justify-between gap-5 flex-wrap">
          <div className="flex items-center gap-4 flex-1">
            <SearchFilter
              url="/management/orders"
              searchParams={await searchParams}
            />
          </div>
          <div className="flex items-center gap-3">
            <WorkShopFilter
              url="/management/orders"
              searchParams={await searchParams}
            />
            <TypeFilter
              url="/management/orders"
              searchParams={await searchParams}
            />
            <PriorityFilter
              url="/management/orders"
              searchParams={await searchParams}
            />
            <StatusFilter
              url="/management/orders"
              searchParams={await searchParams}
            />
          </div>
        </div>
        <OrdersTable />
      </div>
    </div>
  );
}

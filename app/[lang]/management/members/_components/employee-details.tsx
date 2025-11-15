import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SheetClose } from "@/components/ui/sheet";
import { useModal } from "@/hooks/use-modal-store";
import { months } from "@/lib/months";
import { years } from "@/lib/years";
import { UserInTable } from "@/types/types";
import axios from "axios";
import { format } from "date-fns";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";

interface Props {
  employee: UserInTable;
}

function EmployeeDetails({ employee }: Props) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isPending, startTransition] = useTransition();

  const { onOpen } = useModal();

  const employeeOrders =
    employee.employeeRole === "CUTTER"
      ? employee.cutterOrders
      : employee.employeeRole === "TAILOR"
      ? employee.tailorOrders
      : employee.employeeRole === "MANCHEUR"
      ? employee.mancheurOrders
      : employee.tapisierOrders;

  const selectedOrders = employeeOrders.filter(
    (order) =>
      order.acceptedAt?.getFullYear() === selectedYear &&
      order.acceptedAt.getMonth() === selectedMonth
  );

  const selectedInvoice = employee.invoices.find(
    (invoice) =>
      invoice.createdAt.getFullYear() === selectedYear &&
      invoice.createdAt.getMonth() === selectedMonth
  );

  const thisMonthTotal = selectedOrders.reduce(
    (acc, order) =>
      acc +
      (employee.employeeRole === "CUTTER"
        ? order.pricing?.cutterPrice || 0
        : employee.employeeRole === "TAILOR"
        ? order.pricing?.tailorPrice || 0
        : employee.employeeRole === "MANCHEUR"
        ? order.pricing?.mancheurPrice || 0
        : order.pricing?.tapisierPrice || 0),
    0
  );

  const generateInvoice = async () => {
    startTransition(async () => {
      try {
        const response = await axios.post(
          "https://server-xjlv.onrender.com/generate-invoice-pdf",
          {
            name: employee.name,
            atelier: employee.workShop?.name,
            role:
              employee.employeeRole === "CHEF"
                ? "chef"
                : employee.employeeRole === "CUTTER"
                ? "Decoupeur"
                : employee.employeeRole === "TAILOR"
                ? "Couteur"
                : employee.employeeRole === "MANCHEUR"
                ? "Mancheur"
                : "Tapisier",
            year: selectedYear,
            month: months[selectedMonth],
            assuranceAmount: selectedInvoice?.assurance || 0,
            versementAmount: selectedInvoice?.payment || 0,
            acompteAmount: selectedInvoice?.deposit || 0,
            autreAmount: selectedInvoice?.other || 0,
            items: selectedOrders.map((order) => ({
              id: order.orderId,
              model: order.variant?.name,
              type: order.subType?.name,
              date: format(order.createdAt, "yyyy-MM-dd"),
              payment:
                employee.employeeRole === "CUTTER"
                  ? order.pricing?.cutterPrice || 0
                  : employee.employeeRole === "TAILOR"
                  ? order.pricing?.tailorPrice || 0
                  : employee.employeeRole === "MANCHEUR"
                  ? order.pricing?.mancheurPrice || 0
                  : order.pricing?.tapisierPrice || 0,
            })),
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhemFyLWRldmVsb3BlcnMiLCJpc3MiOiJodHRwczovL3NlcnZlci14amx2Lm9ucmVuZGVyLmNvbSIsImlkIjoiYXphckRldmVsb3BlcnMifQ.K3U8pcye9g4W6KpCPKEcdRbY2L5QlOW5P6g1DGO3Trk",
            },
            responseType: "arraybuffer",
          }
        );

        // Example: download PDF in browser
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "invoice.pdf";
        a.click();
        URL.revokeObjectURL(url);

        console.log("PDF downloaded successfully.");
      } catch (error: any) {
        console.log({ error });
      }
    });
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-1">
        <SheetClose>
          <ChevronLeft className="h-5 w-5 text-[#576070]" />
        </SheetClose>
        <h1 className="text-[#182233]">Les informations de l’employé</h1>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-12">
          <h3 className="text-[#576070]">Nom</h3>
          <h1 className="text-[#182233]">{employee.name}</h1>
        </div>
        <div className="flex items-start gap-12">
          <h3 className="text-[#576070]">Atelier</h3>
          <div className="flex items-center justify-center gap-1.5">
            <Image
              alt="workshop"
              src={employee.workShop?.image || "/workshop1.svg"}
              width={25}
              height={25}
              className="rounded-lg object-cover -mb-2"
            />
            <h1>{employee.workShop?.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-12">
          <h3 className="text-[#576070]">Email</h3>
          <h1 className="text-[#182233]">{employee.email}</h1>
        </div>
        <div className="flex items-center gap-12">
          <h3 className="text-[#576070]">Psuedo</h3>
          <h1 className="text-[#182233]">{employee.username}</h1>
        </div>
        <div className="flex items-center gap-12">
          <h3 className="text-[#576070]">Numero</h3>
          <h1 className="text-[#182233]">{employee.phone}</h1>
        </div>
      </div>
      <div className="space-y-5">
        <Separator className="w-full" />
        <h1 className="text-xl font-semibold text-[#232626]">Travail</h1>
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <h1 className="text-[#576070]">
              Les gains pour{" "}
              <span className="font-medium">{months[selectedMonth]}</span> est
            </h1>
            <h3 className="text-brand font-semibold">{thisMonthTotal}da</h3>
          </div>
          <Popover>
            <PopoverTrigger>
              <div className="h-10 w-10 rounded-[5px] cursor-pointer flex items-center justify-center bg-[#E7F1F8]">
                <svg
                  width="22"
                  height="20"
                  viewBox="0 0 22 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18 1H4C2.586 1 1.879 1 1.44 1.412C1.001 1.824 1 2.488 1 3.815V4.505C1 5.542 1 6.061 1.26 6.491C1.52 6.921 1.993 7.189 2.942 7.723L5.855 9.363C6.491 9.721 6.81 9.9 7.038 10.098C7.512 10.509 7.804 10.993 7.936 11.588C8 11.872 8 12.206 8 12.873V15.543C8 16.452 8 16.907 8.252 17.261C8.504 17.616 8.952 17.791 9.846 18.141C11.725 18.875 12.664 19.242 13.332 18.824C14 18.406 14 17.452 14 15.542V12.872C14 12.206 14 11.872 14.064 11.587C14.1896 11.0042 14.5059 10.4798 14.963 10.097C15.19 9.9 15.509 9.721 16.145 9.362L19.058 7.722C20.006 7.189 20.481 6.922 20.74 6.492C21 6.062 21 5.542 21 4.504V3.814C21 2.488 21 1.824 20.56 1.412C20.122 1 19.415 1 18 1Z"
                    stroke="#576070"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </PopoverTrigger>
            <PopoverContent className="space-y-4">
              <Select
                onValueChange={(year) => {
                  setSelectedYear(Number(year));
                }}
                defaultValue={`${selectedYear}`}>
                <SelectTrigger>
                  <SelectValue placeholder="Année" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={`${year}`}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(month) => {
                  setSelectedMonth(Number(month));
                }}
                defaultValue={`${selectedMonth}`}>
                <SelectTrigger>
                  <SelectValue placeholder="Mois" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(months).map((month) => (
                    <SelectItem key={month} value={`${month}`}>
                      {months[Number(month)]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center">
          <Button
            disabled={isPending}
            onClick={generateInvoice}
            variant={"brandOutline"}
            className="bg-[#056BE412] hover:bg-[#056BE412] hover:text-brand w-full relative rounded-none border-r-0 rounded-l-md">
            Facture
            <svg
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.3383 1.14893C15.3892 1.14893 14.6191 3.42615 14.6191 6.23579H16.3383C17.1672 6.23579 17.5808 6.23579 17.8374 5.95177C18.0933 5.66691 18.0489 5.29218 17.9602 4.54356C17.7232 2.56477 17.087 1.14893 16.3383 1.14893Z"
                stroke="#1E78FF"
                strokeWidth="1.27172"
              />
              <path
                d="M14.6187 6.28157V15.2616C14.6187 16.5426 14.6187 17.1836 14.2247 17.4362C13.5809 17.8483 12.5857 16.9835 12.0851 16.6698C11.6716 16.4104 11.4652 16.2815 11.2358 16.2739C10.9877 16.2654 10.777 16.39 10.3302 16.6698L8.70056 17.6914C8.26054 17.9669 8.04138 18.1051 7.79664 18.1051C7.5519 18.1051 7.33189 17.9669 6.89272 17.6914L5.26396 16.6698C4.84953 16.4104 4.64316 16.2815 4.41377 16.2739C4.16562 16.2654 3.95499 16.39 3.50814 16.6698C3.00758 16.9835 2.01241 17.8483 1.36773 17.4362C0.974609 17.1836 0.974609 16.5435 0.974609 15.2616V6.28157C0.974609 3.86192 0.974609 2.65294 1.72418 1.90093C2.4729 1.14893 3.67955 1.14893 6.09114 1.14893H16.3242M4.38563 4.54017H11.2077M6.09114 7.93141H4.38563"
                stroke="#1E78FF"
                strokeWidth="1.27172"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.92952 8.67323C9.22344 8.67323 8.65039 9.17174 8.65039 9.78641C8.65039 10.4002 9.22344 10.8987 9.92952 10.8987C10.6356 10.8987 11.2087 11.3972 11.2087 12.0119C11.2087 12.6257 10.6356 13.1242 9.92952 13.1242M9.92952 8.67323C10.4864 8.67323 10.9605 8.98268 11.1362 9.41507M9.92952 8.67323V7.9314M9.92952 13.1242C9.37267 13.1242 8.89854 12.8148 8.72287 12.3824M9.92952 13.1242V13.8661"
                stroke="#1E78FF"
                strokeWidth="1.27172"
                strokeLinecap="round"
              />
            </svg>
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpen("manageInvoice", {
                user: employee,
                invoice: selectedInvoice,
                date: new Date(selectedYear, selectedMonth),
              });
            }}
            disabled={isPending}
            variant={"brandOutline"}
            className="bg-[#056BE412] hover:bg-[#056BE412] border-l-0 rounded-none rounded-r-md">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 19H19"
                stroke="#1E78FF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 15V11L15 1L19 5L9 15H5Z"
                stroke="#1E78FF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 4L16 8"
                stroke="#1E78FF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>

        {employeeOrders.map((order) => (
          <Card key={order.id} className="space-y-0">
            <CardHeader className="p-4 space-y-2">
              <div className="flex items-center justify-between gap-5 text-[#A2ABBD]">
                <h3 className="text-xs">{order.orderId}</h3>
                <h3 className="text-xs">
                  {format(order.createdAt, "dd/MM/yyyy")}
                </h3>
              </div>
              <div className="flex items-center gap-5">
                <div
                  style={{
                    backgroundColor: `${order.variant?.color}33`,
                    color: `${order.variant?.color}`,
                  }}
                  className="rounded-full px-4 py-1.5 text-xs font-medium">
                  {order.variant?.name}
                </div>
                <h1 className="text-[#182233] font-medium">
                  {order.subType?.name}
                </h1>
              </div>
            </CardHeader>
            <CardFooter className="flex items-center justify-end pb-2 px-4">
              <div className="flex flex-col items-center gap-1">
                <h3 className="text-[#A2ABBD] text-xs">Paiement</h3>
                <h1 className="text-[#182233] font-semibold">
                  {employee.employeeRole === "CUTTER"
                    ? order.pricing?.cutterPrice
                    : employee.employeeRole === "TAILOR"
                    ? order.pricing?.tailorPrice
                    : order.pricing?.tapisierPrice}
                  da
                </h1>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default EmployeeDetails;

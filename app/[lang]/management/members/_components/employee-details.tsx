import { SheetClose } from "@/components/ui/sheet";
import { UserWithWorkshop } from "@/types/types";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

interface Props {
  employee: UserWithWorkshop;
}

function EmployeeDetails({ employee }: Props) {
  return (
    <div className="space-y-10">
      <div className="flex items-center gap-1">
        <SheetClose>
          <ChevronLeft className="h-5 w-5 text-[#576070]" />
        </SheetClose>
        <h1 className="text-[#182233]">Les informations de l’employé</h1>
      </div>
      <div>
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
      </div>
    </div>
  );
}

export default EmployeeDetails;

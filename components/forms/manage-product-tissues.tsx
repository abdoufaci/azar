import { addProductSubtype } from "@/actions/mutations/products/add-product-sub-type";
import { ProductCategory, ProductSubtype, Tissu } from "@prisma/client";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { ChevronDown, Plus } from "lucide-react";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { addTissu } from "@/actions/mutations/products/add-tissu";

interface Props {
  onChange: (item: { id: string; name: string }[]) => void;
  tissues: Tissu[];
  setTissuesToRemove: Dispatch<
    SetStateAction<
      {
        id: string;
        name: string;
      }[]
    >
  >;
  selectedTissues: {
    id: string;
    name: string;
  }[];
}

function ManageProductTissues({
  onChange,
  setTissuesToRemove,
  tissues: intialTissues,
  selectedTissues,
}: Props) {
  const [tissues, setTissues] = useState(intialTissues || []);
  const [newTissuInput, setNewTissuInput] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [isAddingTissuePending, startAddingTissue] = useTransition();
  const handleAddTissue = () => {
    startAddingTissue(() => {
      addTissu({ name: newTissuInput })
        .then((res) => {
          setTissues((prev) => [res, ...prev]);
          setNewTissuInput("");
          setShowAdd(false);
          toast.success("created !");
        })
        .catch(() => toast.error("Erreur ."));
    });
  };

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <div className="h-fit relative w-full max-w-full min-w-fit border border-[#CFCFCF] cursor-pointer rounded-lg bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none flex justify-between items-center">
            <div className="flex flex-col items-end space-y-1">
              <span
                className={cn(
                  !!selectedTissues.length ? "" : "text-[#A2ABBD]"
                )}>
                {!!selectedTissues.length
                  ? `${selectedTissues.length} tissues`
                  : "choissez les tissues disponible"}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 sm:!w-[280px] w-full" align="start">
          <div className="space-y-2">
            <div className="space-y-1">
              {tissues
                .map((type) => ({ id: type.id, name: type.name }))
                .map((type) => {
                  const isChecked = selectedTissues
                    ?.map((item) => item.id)
                    .includes(type.id);
                  return (
                    <div
                      key={type.id}
                      onClick={() => {
                        if (!!isChecked) {
                          setTissuesToRemove((prev) => [...prev, type]);
                        }

                        if (!isChecked) {
                          setTissuesToRemove((prev) =>
                            prev.filter((item) => item.id !== type.id)
                          );
                        }
                        return !isChecked
                          ? onChange([...selectedTissues, type])
                          : onChange(
                              selectedTissues?.filter(
                                (value) => value.name !== type.name
                              )
                            );
                      }}
                      className="flex items-center gap-2 border-b p-4 cursor-pointer">
                      <Checkbox
                        className="cursor-pointer data-[state=checked]:bg-brand data-[state=checked]:border-brand 
                                border border-[#0000006B] rounded-full"
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          if (!!isChecked) {
                            setTissuesToRemove((prev) => [...prev, type]);
                          }

                          if (!isChecked) {
                            setTissuesToRemove((prev) =>
                              prev.filter((item) => item.id !== type.id)
                            );
                          }
                          return !isChecked
                            ? onChange([...selectedTissues, type])
                            : onChange(
                                selectedTissues?.filter(
                                  (value) => value.name !== type.name
                                )
                              );
                        }}
                      />
                      <h1 className="text-[#232323]">{type.name}</h1>
                    </div>
                  );
                })}
            </div>
            <div className="px-4 pb-2">
              {showAdd ? (
                <Input
                  className="mb-2"
                  disabled={isAddingTissuePending}
                  type="text"
                  placeholder="ex: Tissius56416"
                  value={newTissuInput}
                  onChange={(e) => setNewTissuInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent form submission on Enter for this input
                      handleAddTissue();
                    }
                  }}
                />
              ) : (
                <Button
                  type="button"
                  onClick={() => setShowAdd(true)}
                  variant="brand_link"
                  className="!p-0">
                  <Plus className="h-4 w-4" />
                  Ajouter Tissue
                </Button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ManageProductTissues;

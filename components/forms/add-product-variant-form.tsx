import { ProductSubtype, ProductCategory } from "@prisma/client";
import { ArrowRight, ChevronDown, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { addProductSubtype } from "@/actions/mutations/products/add-product-sub-type";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { addProductVariant } from "@/actions/mutations/products/add-product-variant";

interface Props {
  selectedCategory: ProductCategory;
  types: ProductSubtype[];
  categoryLabel: string;
  handleCancel: () => void;
  onContinue: () => void;
  setTypesToRemove: Dispatch<
    SetStateAction<
      {
        id: string;
        name: string;
      }[]
    >
  >;
}

function AddProductVariantForm({
  selectedCategory,
  types,
  categoryLabel,
  handleCancel,
  setTypesToRemove,
  onContinue,
}: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [model, setModel] = useState("");
  const [newTypeInput, setNewTypeInput] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);
  const [showAdd, setShowAdd] = useState(false);
  const [isAddingTypePending, startAddingType] = useTransition();
  const [isAddingProductModelPending, startAddingProductModel] =
    useTransition();
  const [prices, setPrices] = useState<
    {
      type: {
        id: string;
        name: string;
      };
      cutterPrice: number;
      tailorPrice: number;
      tapisierPrice: number;
    }[]
  >([]);
  const handleAddType = (type: ProductCategory) => {
    startAddingType(() => {
      addProductSubtype({ name: newTypeInput, category: type })
        .then(() => {
          setNewTypeInput("");
          setShowAdd(false);
          toast.success("created !");
        })
        .catch(() => toast.error("Erreur ."));
    });
  };

  const onAddProductVariant = async () => {
    startAddingProductModel(() => {
      addProductVariant({ category: selectedCategory, name: model, prices })
        .then(() => {
          setModel("");
          setStep(1);
          onContinue();
          toast.success("created !");
        })
        .catch(() => toast.error("Erreur"));
    });
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <div className="mb-8">
            <div className="text-brand text-sm font-medium mb-2">B2B</div>
            <h1 className="text-3xl font-medium text-[#000000]">
              Les Informations de <span className="text-brand">{model}</span>
            </h1>
          </div>
          <div className="space-y-5">
            {prices.map((price, idx) => (
              <div key={idx} className="space-y-4">
                <h1 className="text-lg text-brand">{price.type.name}</h1>
                <div className="space-y-2">
                  <h3>Decop</h3>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Montant dû de decop pour le type 3+2"
                      value={`${price.cutterPrice}`}
                      onChange={(e) => {
                        const newPrices = [...prices];
                        newPrices[idx] = {
                          ...newPrices[idx],
                          cutterPrice: e.target.valueAsNumber,
                        };
                        setPrices(newPrices);
                      }}
                      className=""
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3>Couteur</h3>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Montant dû de couture pour le type 3+2"
                      value={price.tailorPrice}
                      onChange={(e) => {
                        const newPrices = [...prices];
                        newPrices[idx] = {
                          ...newPrices[idx],
                          tailorPrice: e.target.valueAsNumber,
                        };
                        setPrices(newPrices);
                      }}
                      className=""
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3>Tapisier</h3>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Montant dû de tapisier pour le type 3+2"
                      value={`${price.tapisierPrice}`}
                      onChange={(e) => {
                        const newPrices = [...prices];
                        newPrices[idx] = {
                          ...newPrices[idx],
                          tapisierPrice: e.target.valueAsNumber,
                        };
                        setPrices(newPrices);
                      }}
                      className=""
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between w-full gap-5">
              <Button
                onClick={handleCancel}
                type="button"
                variant={"link"}
                className="underline">
                Cancel
              </Button>
              <Button
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onAddProductVariant();
                }}
                disabled={
                  isAddingProductModelPending ||
                  prices.some(
                    (price) =>
                      price.cutterPrice === 0 ||
                      price.tailorPrice === 0 ||
                      price.tapisierPrice === 0
                  )
                }
                variant={"brand"}
                className="rounded-full px-12 h-fit py-2">
                créer le salon
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="mb-8">
          <div className="text-brand text-sm font-medium mb-2">B2B</div>
          <h1 className="text-3xl font-medium text-[#000000]">
            Les Informations de{" "}
            <span className="text-brand">{categoryLabel}</span>
          </h1>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <h3>Nom</h3>
            <div className="relative">
              <Input
                placeholder="Nom de Salon"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className=""
              />
            </div>
          </div>
          <div className="space-y-2">
            <h3>Types</h3>
            <div className="relative">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="h-fit relative w-full max-w-full min-w-fit border border-[#CFCFCF] cursor-pointer rounded-lg bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none flex justify-between items-center">
                    <div className="flex flex-col items-end space-y-1">
                      <span
                        className={cn(
                          !!selectedTypes.length ? "" : "text-[#A2ABBD]"
                        )}>
                        {!!selectedTypes.length
                          ? `${selectedTypes.length} types`
                          : "choissez les types disponible"}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="p-0 sm:!w-[576px] w-full"
                  align="start">
                  <div className="space-y-2">
                    <div className="space-y-1">
                      {types
                        .filter((type) => type.category === selectedCategory)
                        .map((type) => ({ id: type.id, name: type.name }))
                        .map((type) => {
                          const isChecked = selectedTypes
                            ?.map((item) => item.id)
                            .includes(type.id);
                          return (
                            <div
                              key={type.id}
                              onClick={() => {
                                if (isChecked) {
                                  setTypesToRemove((prev) => [...prev, type]);
                                }

                                if (!isChecked) {
                                  setTypesToRemove((prev) =>
                                    prev.filter((item) => item.id !== type.id)
                                  );
                                }
                                return !isChecked
                                  ? setSelectedTypes((prev) => [...prev, type])
                                  : setSelectedTypes((prev) =>
                                      prev?.filter(
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
                                  if (isChecked) {
                                    setTypesToRemove((prev) => [...prev, type]);
                                  }

                                  if (!isChecked) {
                                    setTypesToRemove((prev) =>
                                      prev.filter((item) => item.id !== type.id)
                                    );
                                  }
                                  return !isChecked
                                    ? setSelectedTypes((prev) => [
                                        ...prev,
                                        type,
                                      ])
                                    : setSelectedTypes((prev) =>
                                        prev?.filter(
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
                          disabled={isAddingTypePending}
                          type="text"
                          placeholder="nom de l'hotel"
                          value={newTypeInput}
                          onChange={(e) => setNewTypeInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault(); // Prevent form submission on Enter for this input
                              handleAddType(selectedCategory);
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
                          Ajouter Type
                        </Button>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex items-center justify-between w-full gap-5">
            <Button
              onClick={handleCancel}
              type="button"
              variant={"link"}
              className="underline">
              Cancel
            </Button>
            <Button
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setPrices(() =>
                  selectedTypes.map((type) => ({
                    type,
                    cutterPrice: 0,
                    tailorPrice: 0,
                    tapisierPrice: 0,
                  }))
                );
                setStep(2);
              }}
              disabled={
                isAddingProductModelPending ||
                model === "" ||
                !selectedTypes.length
              }
              variant={"brand"}
              className="rounded-full px-12 h-fit py-2">
              Continue
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProductVariantForm;

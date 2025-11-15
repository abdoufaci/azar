"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect } from "react";
import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import { useFilterModal } from "@/hooks/use-filter-modal-store";

const FormSchema = z.object({
  Date: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .optional(),
});

interface Props {
  url?: string;
  searchParams?: Record<string, string | string[] | undefined>;
}

export function DateFilter({ url: pathname, searchParams }: Props) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { onSearch, admin, desk } = useFilterModal();

  const { dateFrom, dateTo, ...rest } = desk;

  const router = useRouter();

  const Date = form.watch("Date");

  useEffect(() => {
    if (Date) {
      form.handleSubmit(onSubmit)();
    }
  }, [Date, form.handleSubmit]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    onSearch({
      admin,
      desk: {
        ...rest,
        dateFrom: data.Date?.from.toString(),
        dateTo: data.Date?.to.toString(),
      },
    });
  }

  const handleReset = () => {
    form.setValue("Date", undefined);
    onSearch({
      admin,
      desk: {
        ...rest,
        dateFrom: undefined,
        dateTo: undefined,
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="Date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full max-w-[240px] pl-3 text-left font-normal border bg-transparent border-[#E2E9EB] text-[#A2ABBD]",
                        !field.value && "text-muted-foreground"
                      )}>
                      {field.value?.from ? (
                        field.value.to ? (
                          <>
                            {format(field.value.from, "LLL dd, y")} -{" "}
                            {format(field.value.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(field.value.from, "LLL dd, y")
                        )
                      ) : (
                        <span className="text-[#A2ABBD]">date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-[#A2ABBD]" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={field?.value}
                    onSelect={field.onChange}
                    captionLayout="dropdown"
                  />
                  <div className="px-4 pb-4">
                    <Button
                      disabled={!field.value?.from && !field.value?.to}
                      size={"sm"}
                      className="w-full"
                      onClick={handleReset}>
                      Reset
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import { ChevronsUpDownIcon } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import React, { useState } from "react";
import { useGetExchangeRateData } from "../queries/use-get-exchange-rate-data";

interface IExchangeRateData {
  exchangeRate: {
    rate: number;
    targetCurrency: string;
  };

  setExchangeRate: React.Dispatch<
    React.SetStateAction<{
      rate: number;
      targetCurrency: string;
    }>
  >;
}

function PopoverExchangeRateData({
  exchangeRate,
  setExchangeRate,
}: IExchangeRateData) {
  const [openPopoverBox, setOpenPopoverBox] = useState(false);
  const { data: exchangeRateData = [] } = useGetExchangeRateData();
  const exchangeRateDataWithSingaporeDollars = [
    {
      baseCurrency: "Singapore Dollar",
      targetCurrency: "Singapore Dollar",
      exchangeRate: 1,
    },
    ...exchangeRateData,
  ];
  return (
    <Popover open={openPopoverBox} onOpenChange={setOpenPopoverBox}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={openPopoverBox}
          className="w-[225px] justify-between"
        >
          {exchangeRate.targetCurrency}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[210px] h-[300px] overflow-y-auto">
        <Command>
          <CommandInput placeholder="Select Currency..." />
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
              {exchangeRateDataWithSingaporeDollars.map((exchangeRate) => (
                <CommandItem
                  key={exchangeRate.targetCurrency}
                  value={exchangeRate.targetCurrency}
                  onSelect={(currentValue) => {
                    setExchangeRate({
                      rate: exchangeRate.exchangeRate,
                      targetCurrency: currentValue,
                    });
                    setOpenPopoverBox(false);
                  }}
                >
                  {exchangeRate.targetCurrency}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default PopoverExchangeRateData;

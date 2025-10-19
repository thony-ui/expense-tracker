"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type TView = "monthly" | "yearly" | "weekly" | "daily";

interface ChartFilterProps {
  view: TView;
  onViewChange: (view: TView) => void;
  date: string;
  onDateChange: (date: string) => void;
  showLabel?: boolean;
}

export function ChartFilter({
  view,
  onViewChange,
  date,
  onDateChange,
  showLabel = false,
}: ChartFilterProps) {
  return (
    <div className="flex gap-2 items-end flex-wrap">
      <div className="flex flex-col gap-1">
        {showLabel && (
          <Label
            htmlFor="view-select"
            className="text-xs text-muted-foreground"
          >
            View
          </Label>
        )}
        <Select
          value={view}
          onValueChange={(value) => {
            onViewChange(value as TView);
          }}
        >
          <SelectTrigger
            className="w-[140px] dark:border-gray-500"
            id="view-select"
          >
            <SelectValue placeholder="Monthly" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yearly">Yearly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1">
        {showLabel && (
          <Label htmlFor="date-input" className="text-xs text-muted-foreground">
            Date
          </Label>
        )}
        <Input
          id="date-input"
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          required
          className="w-[160px] dark:border-gray-500"
        />
      </div>
    </div>
  );
}

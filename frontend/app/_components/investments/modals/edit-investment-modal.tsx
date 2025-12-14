"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { useUpdateInvestment } from "@/app/mutations/use-update-investment";
import { invalidateInvestments } from "@/app/queries/use-get-investments";
import { IInvestment } from "@/lib/types";
import { useGetUniqueStocks } from "@/app/queries/use-get-unique-stocks";

const ALLOWED_USERS = ["Anthony", "Albert", "Juliana"] as const;

interface EditInvestmentModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  investment: IInvestment;
}

export function EditInvestmentModal({
  open,
  setOpen,
  investment,
}: EditInvestmentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: investment.userName,
    stock: investment.stock,
    amountInSGD: investment.amountInSGD.toString(),
    date: investment.date,
  });

  const { mutateAsync: updateInvestment } = useUpdateInvestment();
  const { data: uniqueStocks = [] } = useGetUniqueStocks();

  useEffect(() => {
    if (open) {
      setFormData({
        userName: investment.userName,
        stock: investment.stock,
        amountInSGD: investment.amountInSGD.toString(),
        date: investment.date,
      });
    }
  }, [open, investment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateInvestment({
        id: investment.id,
        userName: formData.userName,
        stock: formData.stock,
        amountInSGD: Number.parseFloat(formData.amountInSGD),
        date: formData.date,
      });

      toast("Investment updated successfully!", { type: "success" });
      invalidateInvestments();
      setOpen(false);
    } catch (error) {
      toast("Failed to update investment", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Investment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="edit-userName">User Name</Label>
            <Select
              value={formData.userName}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  userName: value as (typeof ALLOWED_USERS)[number],
                })
              }
            >
              <SelectTrigger className="dark:border-gray-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALLOWED_USERS.map((user) => (
                  <SelectItem key={user} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="edit-stock">Stock</Label>
            <Input
              id="edit-stock"
              type="text"
              placeholder="e.g., AAPL, GOOGL"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              required
              list="edit-stock-suggestions"
            />
            <datalist id="edit-stock-suggestions">
              {uniqueStocks.map((stock) => (
                <option key={stock} value={stock} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-amountInSGD">Amount (SGD)</Label>
              <Input
                id="edit-amountInSGD"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amountInSGD}
                onChange={(e) =>
                  setFormData({ ...formData, amountInSGD: e.target.value })
                }
                required
                className="dark:border-gray-500"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit-date">Date</Label>
            <Input
              id="edit-date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
              className="dark:border-gray-500 w-full"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Investment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

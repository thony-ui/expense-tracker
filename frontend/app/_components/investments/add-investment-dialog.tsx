"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { PlusIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { usePostInvestment } from "@/app/mutations/use-post-investment";
import { invalidateInvestments } from "@/app/queries/use-get-investments";
import { useGetUniqueStocks } from "@/app/queries/use-get-unique-stocks";

const ALLOWED_USERS = ["Anthony", "Albert", "Juliana"] as const;

export function AddInvestmentDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: "" as (typeof ALLOWED_USERS)[number] | "",
    stock: "",
    amountInSGD: "",
    date: new Date().toISOString().split("T")[0],
  });

  const { mutateAsync: postInvestment } = usePostInvestment();
  const { data: uniqueStocks = [] } = useGetUniqueStocks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await postInvestment({
        userName: formData.userName,
        stock: formData.stock,
        amountInSGD: Number.parseFloat(formData.amountInSGD),
        date: formData.date,
      });

      toast("Investment added successfully!", { type: "success" });
      invalidateInvestments();
      setOpen(false);
      setFormData({
        userName: "",
        stock: "",
        amountInSGD: "",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      toast("Failed to add investment", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          <span className="">Add Investment</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Investment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="userName">User Name</Label>
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
                <SelectValue placeholder="Select user" />
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
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="text"
              placeholder="e.g., AAPL, GOOGL"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              required
              className="dark:border-gray-500"
              list="stock-suggestions"
            />
            <datalist id="stock-suggestions">
              {uniqueStocks.map((stock) => (
                <option key={stock} value={stock} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amountInSGD">Amount (SGD)</Label>
              <Input
                id="amountInSGD"
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
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
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
              {isLoading ? "Adding..." : "Add Investment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

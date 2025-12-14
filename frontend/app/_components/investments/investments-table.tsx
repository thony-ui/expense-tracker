"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { IInvestment } from "@/lib/types";
import { InvestmentDropdownMenu } from "./investment-dropdown-menu";
import { useState } from "react";

interface IInvestmentsTableProps {
  title: string;
  investments: IInvestment[];
}

export function InvestmentsTable({
  title,
  investments,
}: IInvestmentsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStock, setFilterStock] = useState<string>("all");
  const [filterUserName, setFilterUserName] = useState<string>("all");

  // Get unique stocks and usernames for filters
  const uniqueStocks = Array.from(new Set(investments.map((inv) => inv.stock)));
  const uniqueUserNames = Array.from(
    new Set(investments.map((inv) => inv.userName))
  );

  // Filter investments
  const filteredInvestments = investments.filter((investment) => {
    const matchesSearch =
      investment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.stock.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStock =
      filterStock === "all" || investment.stock === filterStock;
    const matchesUserName =
      filterUserName === "all" || investment.userName === filterUserName;
    return matchesSearch && matchesStock && matchesUserName;
  });

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex flex-col justify-between items-start sm:items-center gap-3">
          <CardTitle className="text-nowrap">{title}</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="flex items-center border px-[2px] gap-2 rounded-md dark:border-gray-500">
              <Input
                className="w-full sm:w-[190px] placeholder:text-[14px] outline-none ring-0 border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent shadow-none"
                placeholder="Search..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-500 mr-1" />
            </div>
            <Select value={filterUserName} onValueChange={setFilterUserName}>
              <SelectTrigger className="w-full sm:w-[150px] h-[37.5px] dark:border-gray-500">
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {uniqueUserNames.map((userName) => (
                  <SelectItem key={userName} value={userName}>
                    {userName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStock} onValueChange={setFilterStock}>
              <SelectTrigger className="w-full sm:w-[150px] h-[37.5px] dark:border-gray-500">
                <SelectValue placeholder="All Stocks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stocks</SelectItem>
                {uniqueStocks.map((stock) => (
                  <SelectItem key={stock} value={stock}>
                    {stock}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredInvestments.length > 0 ? (
            filteredInvestments.map((investment) => (
              <div
                key={investment.id}
                className="dark:border-gray-500 flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white truncate">
                        {investment.stock}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-400 truncate">
                        User: {investment.userName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(investment.date)}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          SGD: {formatCurrency(investment.amountInSGD)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <InvestmentDropdownMenu investment={investment} />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No investments found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

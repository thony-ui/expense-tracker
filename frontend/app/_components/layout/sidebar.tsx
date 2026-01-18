"use client";

import {
  HomeIcon,
  CreditCardIcon,
  WalletIcon,
  FlagIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Link from "next/link";
import { DarkModeToggle } from "../dark-mode-toggle";
import { UserMenu } from "./user-menu";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon, current: true },
  {
    name: "Transactions",
    href: "/transactions",
    icon: CreditCardIcon,
    current: false,
  },
  {
    name: "Budgets",
    href: "/budgets",
    icon: WalletIcon,
    current: false,
  },
  {
    name: "Savings Goals",
    href: "/savings-goals",
    icon: FlagIcon,
    current: false,
  },
];

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  return (
    <>
      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </div>
    </>
  );
}

function SidebarContent() {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            ExpenseTracker
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Personal Finance
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-1">
          <p className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Menu
          </p>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => {
                navigation.forEach((navItem) => {
                  navItem.current = navItem.name === item.name;
                });
              }}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                item.current
                  ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  item.current
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-400 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
                )}
              />
              <span>{item.name}</span>
              {item.current && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-gray-200 dark:border-gray-800">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Appearance
          </span>
          <DarkModeToggle />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <UserCircleIcon className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                Account
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                Manage settings
              </p>
            </div>
          </div>
          <UserMenu />
        </div>
      </div>
    </div>
  );
}

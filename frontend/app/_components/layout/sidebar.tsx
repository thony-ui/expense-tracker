"use client";

import { HomeIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon, current: true },
  {
    name: "Transactions",
    href: "/transactions",
    icon: CreditCardIcon,
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
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r">
      <div className="flex h-16 shrink-0 items-center">
        <h1 className="text-xl font-bold text-gray-900">ExpenseTracker</h1>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-x-3",
                      item.current
                        ? "bg-gray-50 text-indigo-600"
                        : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                    )}
                    asChild
                    onClick={() => {
                      navigation.forEach((navItem) => {
                        navItem.current = navItem.name === item.name;
                      });
                    }}
                  >
                    <Link href={item.href}>
                      <item.icon
                        className={cn(
                          item.current
                            ? "text-indigo-600"
                            : "text-gray-400 group-hover:text-indigo-600",
                          "h-6 w-6 shrink-0"
                        )}
                      />
                      {item.name}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}

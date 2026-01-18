"use client";

import { useGetBudgets } from "@/app/queries/use-get-budgets";
import { BudgetCard } from "./budget-card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { IBudget } from "@/lib/types";
import { EditBudgetModal } from "./edit-budget-modal";
import DeleteBudgetModal from "./delete-budget-modal";
import { Input } from "@/components/ui/input";

export function BudgetList() {
  const { data: budgets, isLoading } = useGetBudgets();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<IBudget | null>(null);
  const [deletingBudgetId, setDeletingBudgetId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter budgets based on search query
  const filteredBudgets = useMemo(() => {
    if (!budgets) return [];
    if (!searchQuery.trim()) return budgets;

    const query = searchQuery.toLowerCase();
    return budgets.filter((budget) => {
      return (
        budget.name?.toLowerCase().includes(query) ||
        budget.periodType?.toLowerCase().includes(query)
      );
    });
  }, [budgets, searchQuery]);

  const handleDelete = (budgetId: string) => {
    setDeletingBudgetId(budgetId);
    setDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="h-[90vh] w-full flex flex-col items-center justify-center">
        Loading budgets...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Budgets
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
          Track your budgets and manage your finances
        </p>
      </div>

      {budgets && budgets.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search budgets by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {!budgets || budgets.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No budgets created yet</p>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Budget
          </Button>
        </div>
      ) : filteredBudgets.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-2">No budgets found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search query
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBudgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={setEditingBudget}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {editingBudget && (
        <EditBudgetModal
          budget={editingBudget}
          open={!!editingBudget}
          onClose={() => setEditingBudget(null)}
        />
      )}

      {deletingBudgetId && (
        <DeleteBudgetModal
          open={deleteModalOpen}
          setOpen={setDeleteModalOpen}
          budgetId={deletingBudgetId}
        />
      )}
    </div>
  );
}

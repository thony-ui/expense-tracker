"use client";

import { useGetBudgets } from "@/app/queries/use-get-budgets";
import { BudgetCard } from "./budget-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateBudgetModal } from "./create-budget-modal";
import { IBudget } from "@/lib/types";
import { EditBudgetModal } from "./edit-budget-modal";
import DeleteBudgetModal from "./delete-budget-modal";

export function BudgetList() {
  const { data: budgets, isLoading } = useGetBudgets();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<IBudget | null>(null);
  const [deletingBudgetId, setDeletingBudgetId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Budgets</h2>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Budget
        </Button>
      </div>

      {!budgets || budgets.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No budgets created yet</p>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Budget
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => (
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

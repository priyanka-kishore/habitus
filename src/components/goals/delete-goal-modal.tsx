"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Goal, DeleteGoalModalProps } from "@/types/goals"

export function DeleteGoalModal({ isOpen, onClose, onGoalDeleted, goal }: DeleteGoalModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDeleteConfirm = async () => {
    if (!goal) return
    setIsSubmitting(true)
    const { error } = await supabase
      .from("goals")
      .delete()
      .eq("id", goal.id)
    if (!error) {
      onGoalDeleted(goal.id)
      onClose()
    }
    setIsSubmitting(false)
  }

  if (!isOpen || !goal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-8 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold mb-2">Delete Goal</h2>
        <p>Are you sure you want to delete the goal <span className="font-semibold">&quot;{goal.name}&quot;</span>? This action cannot be undone.</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  )
} 
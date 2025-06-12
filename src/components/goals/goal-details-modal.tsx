"use client"

import { Button } from "@/components/ui/button"
import { Goal } from "@/types/goals"
import { Pencil } from "lucide-react"

interface GoalDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  goal: Goal | null
  onEdit?: (goal: Goal) => void
}

export function GoalDetailsModal({ isOpen, onClose, goal, onEdit }: GoalDetailsModalProps) {
  if (!isOpen || !goal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-8 w-full max-w-md space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{goal.name}</h2>
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onEdit(goal)
                onClose()
              }}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
        
        {goal.description && (
          <p className="text-muted-foreground">{goal.description}</p>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <span className={goal.done ? "text-green-600" : "text-yellow-600"}>
              {goal.done ? "Completed" : "In Progress"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Frequency:</span>
            <span>{goal.frequency === "once" ? "One-time" : "Daily"}</span>
          </div>

          {goal.due_date && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Due Date:</span>
              <span>{goal.due_date}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="font-medium">Visibility:</span>
            <span className="capitalize">{goal.visibility || "public"}</span>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
} 
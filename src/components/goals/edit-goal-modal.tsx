"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Goal, EditGoalModalProps } from "@/types/goals"

export function EditGoalModal({ isOpen, onClose, onGoalUpdated, goal }: EditGoalModalProps) {
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    frequency: "once" as "once" | "daily",
    due_date: "",
    visibility: "private" as "public" | "private" | "friends"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form when goal changes
  useEffect(() => {
    if (goal) {
      setEditForm({
        name: goal.name,
        description: goal.description || "",
        frequency: goal.frequency,
        due_date: goal.due_date || "",
        visibility: goal.visibility
      })
    }
  }, [goal])

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!goal) return

    setIsSubmitting(true)
    const { data, error } = await supabase
      .from("goals")
      .update({
        name: editForm.name,
        description: editForm.description || null,
        frequency: editForm.frequency,
        due_date: editForm.due_date || null,
        visibility: editForm.visibility
      })
      .eq("id", goal.id)
      .select()

    if (!error && data) {
      onGoalUpdated(data[0])
      onClose()
    }
    setIsSubmitting(false)
  }

  if (!isOpen || !goal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Goal</h2>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              placeholder="Enter goal name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              placeholder="Enter goal description (optional)"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Frequency</label>
            <Select
              value={editForm.frequency}
              onValueChange={(value: "once" | "daily") => setEditForm({ ...editForm, frequency: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once">One-time</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Due Date</label>
            <Input
              type="date"
              value={editForm.due_date}
              onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Visibility</label>
            <Select
              value={editForm.visibility}
              onValueChange={(value: "public" | "private" | "friends") => setEditForm({ ...editForm, visibility: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 
"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Goal, AddGoalModalProps } from "@/types/goals"

export function AddGoalModal({ isOpen, onClose, onGoalAdded }: AddGoalModalProps) {
  const [newGoal, setNewGoal] = useState({
    name: "",
    description: "",
    frequency: "once" as "once" | "daily",
    due_date: "",
    visibility: "private" as "public" | "private" | "friends"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoal.name.trim()) return

    setIsSubmitting(true)
    const { data, error } = await supabase
      .from("goals")
      .insert([{
        name: newGoal.name,
        description: newGoal.description || undefined,
        frequency: newGoal.frequency,
        due_date: newGoal.due_date || undefined,
        done: false,
        visibility: newGoal.visibility
      }])
      .select()
      .then(response => response)

    if (!error && data) {
      onGoalAdded(data[0])
      onClose()
      setNewGoal({
        name: "",
        description: "",
        frequency: "once",
        due_date: "",
        visibility: "private"
      })
    }
    setIsSubmitting(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Goal</h2>
        <form onSubmit={handleAddGoal} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              placeholder="Enter goal name"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              placeholder="Enter goal description (optional)"
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Frequency</label>
            <Select
              value={newGoal.frequency}
              onValueChange={(value: "once" | "daily") => setNewGoal({ ...newGoal, frequency: value })}
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
              value={newGoal.due_date}
              onChange={(e) => setNewGoal({ ...newGoal, due_date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Visibility</label>
            <Select
              value={newGoal.visibility}
              onValueChange={(value: "public" | "private" | "friends") => setNewGoal({ ...newGoal, visibility: value })}
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
              {isSubmitting ? "Adding..." : "Add Goal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 
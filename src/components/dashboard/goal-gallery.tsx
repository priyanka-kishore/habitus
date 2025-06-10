"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { HamburgerMenuIcon } from "@radix-ui/react-icons"
import confetti from "canvas-confetti"
import { AddGoalButton } from "@/components/goals/add-goal-button"
import { AddGoalModal } from "@/components/goals/add-goal-modal"
import { EditGoalModal } from "@/components/goals/edit-goal-modal"
import { DeleteGoalModal } from "@/components/goals/delete-goal-modal"

interface Goal {
  id: string
  name: string
  description?: string
  frequency: "once" | "daily"
  due_date?: string
  created_at: string
  done: boolean
}

export default function GoalGallery() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    fetchGoals()
  }, [])

  async function fetchGoals() {
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .order("created_at", { ascending: false })
    if (!error && data) setGoals(data)
  }

  async function handleEdit(goal: Goal) {
    setEditingGoal(goal)
    setEditOpen(true)
  }

  function handleDeleteClick(goal: Goal) {
    setDeletingGoal(goal)
    setDeleteOpen(true)
  }

  const handleGoalAdded = (newGoal: Goal) => {
    setGoals([newGoal, ...goals])
  }

  const handleGoalUpdated = (updatedGoal: Goal) => {
    setGoals(goals => goals.map(g => g.id === updatedGoal.id ? updatedGoal : g))
  }

  const handleGoalDeleted = (goalId: string) => {
    setGoals(goals => goals.filter(g => g.id !== goalId))
  }

  return (
    <div>
      <AddGoalButton onClick={() => setIsAddModalOpen(true)} className="mb-8" />

      <AddGoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onGoalAdded={handleGoalAdded}
      />

      <EditGoalModal
        isOpen={editOpen}
        onClose={() => { setEditOpen(false); setEditingGoal(null); }}
        onGoalUpdated={handleGoalUpdated}
        goal={editingGoal}
      />

      <DeleteGoalModal
        isOpen={deleteOpen}
        onClose={() => { setDeleteOpen(false); setDeletingGoal(null); }}
        onGoalDeleted={handleGoalDeleted}
        goal={deletingGoal}
      />

      {/* Gallery of Goal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {goals.map((goal, i) => (
          <div
            key={goal.id}
            ref={el => { cardRefs.current[i] = el }}
            className={
              `rounded-xl p-6 flex flex-col gap-2 border relative transition-all duration-200 ` +
              (goal.done
                ? "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"
                : "bg-white dark:bg-zinc-900")
            }
          >
            {/* More Dropdown */}
            <div className="absolute top-3 right-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none">
                    <HamburgerMenuIcon />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(goal)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={() => handleDeleteClick(goal)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* Checkbox to the left of goal name, no label */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={goal.done}
                onChange={async (e) => {
                  const checked = e.target.checked
                  setGoals(goals => goals.map(g => g.id === goal.id ? { ...g, done: checked } : g))
                  await supabase
                    .from("goals")
                    .update({ done: checked })
                    .eq("id", goal.id)
                  // Only trigger confetti when checking off (not unchecking)
                  if (checked && cardRefs.current[i]) {
                    const rect = cardRefs.current[i]!.getBoundingClientRect()
                    confetti({
                      particleCount: 40,
                      spread: 60,
                      origin: {
                        x: (rect.left + rect.width / 2) / window.innerWidth,
                        y: (rect.top + rect.height / 2) / window.innerHeight
                      },
                      scalar: 0.6
                    })
                  }
                }}
                className="accent-blue-600 w-5 h-5 rounded border border-zinc-300 dark:border-zinc-700"
              />
              <div className="font-bold text-lg">{goal.name}</div>
            </div>
            {goal.description && <div className="text-muted-foreground">{goal.description}</div>}
            <div className="text-xs mt-2">
              <span
                className={
                  `inline-block px-2 py-1 rounded mr-2 ` +
                  (goal.frequency === "once"
                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                    : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200")
                }
              >
                {goal.frequency === "once" ? "One-time" : "Daily"}
              </span>
              {goal.due_date && (
                <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Due: {goal.due_date}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 
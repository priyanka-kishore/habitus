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
import { Goal } from "@/types/goals"
import { GoalDetailsModal } from "@/components/goals/goal-details-modal"
import { mockUsers } from "@/lib/mock-users"
import Image from "next/image"

export default function GoalGallery() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    fetchGoals()
  }, [])

  async function fetchGoals() {
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .order("created_at", { ascending: false })
      .then(response => response)

    console.log('GoalGallery: Fetched data', data);
    console.log('GoalGallery: Error', error);

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

      <GoalDetailsModal
        isOpen={detailsOpen}
        onClose={() => { setDetailsOpen(false); setSelectedGoal(null); }}
        goal={selectedGoal}
      />

      {/* Gallery of Goal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {goals.map((goal, i) => (
          <div
            key={goal.id}
            ref={el => { cardRefs.current[i] = el }}
            onClick={() => {
              setSelectedGoal(goal)
              setDetailsOpen(true)
            }}
            className={
              `rounded-xl p-6 flex flex-col gap-2 border relative transition-all duration-200 cursor-pointer hover:shadow-md ` +
              (goal.done
                ? "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"
                : "bg-white dark:bg-zinc-900")
            }
          >
            {/* More Dropdown */}
            <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
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
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
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
              <span
                className={
                  `inline-block px-2 py-1 rounded ` +
                  ((goal.visibility || "public") === "public"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : (goal.visibility || "public") === "friends"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200")
                }
              >
                {(goal.visibility || "public").charAt(0).toUpperCase() + (goal.visibility || "public").slice(1)}
              </span>
            </div>

            {/* User Avatars */}
            <div className="flex items-center gap-1 mt-2 ml-auto">
              {mockUsers.slice(0, 3).map((user, index) => (
                <div
                  key={user.id}
                  className="relative h-6 w-6 rounded-full overflow-hidden border-2 border-background"
                  style={{ marginLeft: index > 0 ? '-8px' : '0' }}
                >
                  {user.avatar_url ? (
                    <Image
                      src={user.avatar_url}
                      alt={user.full_name}
                      fill
                      sizes="24px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs font-semibold text-muted-foreground bg-secondary">
                      {user.full_name.charAt(0)}
                    </div>
                  )}
                </div>
              ))}
              {mockUsers.length > 3 && (
                <div className="relative h-6 w-6 rounded-full overflow-hidden border-2 border-background bg-secondary flex items-center justify-center text-xs font-semibold text-muted-foreground">
                  +{mockUsers.length - 3}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 
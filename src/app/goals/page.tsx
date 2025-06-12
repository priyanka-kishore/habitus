"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { GoalFilters } from "@/components/goals/goal-filters"
import { GoalSort } from "@/components/goals/goal-sort"
import { AddGoalButton } from "@/components/goals/add-goal-button"
import { AddGoalModal } from "@/components/goals/add-goal-modal"
import { EditGoalModal } from "@/components/goals/edit-goal-modal"
import { GoalDetailsModal } from "@/components/goals/goal-details-modal"
import { Goal, FilterState, SortState } from "@/types/goals"

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    name: "",
    description: "",
    frequency: "all",
    dueDate: "",
    done: "all",
    visibility: "all"
  })
  const [sort, setSort] = useState<SortState>({
    field: "created_at",
    order: "desc"
  })
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)

  useEffect(() => {
    fetchGoals()
  }, [])

  async function fetchGoals() {
    setLoading(true);
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .order("created_at", { ascending: false })
      .then(response => response)
    
    console.log('GoalsPage: Fetched data', data);
    console.log('GoalsPage: Error', error);

    if (!error && data) setGoals(data)
    setLoading(false)
  }

  const handleGoalAdded = (newGoal: Goal) => {
    setGoals([newGoal, ...goals])
  }

  const handleGoalUpdated = (updatedGoal: Goal) => {
    setGoals(goals => goals.map(g => g.id === updatedGoal.id ? updatedGoal : g))
  }

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal)
    setEditOpen(true)
  }

  // Filter and sort goals
  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (goal.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)

    const matchesName = filters.name === "" || goal.name.toLowerCase().includes(filters.name.toLowerCase())
    const matchesDescription = filters.description === "" || (goal.description?.toLowerCase().includes(filters.description.toLowerCase()) ?? false)
    const matchesFrequency = filters.frequency === "all" || goal.frequency === filters.frequency
    const matchesDueDate = filters.dueDate === "" || goal.due_date === filters.dueDate
    const matchesDone = filters.done === "all" || goal.done.toString() === filters.done
    const matchesVisibility = filters.visibility === "all" || goal.visibility === filters.visibility

    return matchesSearch && matchesName && matchesDescription && matchesFrequency && matchesDueDate && matchesDone && matchesVisibility
  })

  const sortedGoals = [...filteredGoals].sort((a, b) => {
    const aValue = a[sort.field]
    const bValue = b[sort.field]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sort.order === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (sort.field === "due_date" || sort.field === "created_at") {
      const aDate = new Date(aValue as string)
      const bDate = new Date(bValue as string)
      return sort.order === "asc" ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime()
    }

    if (typeof aValue === "boolean" && typeof bValue === "boolean") {
      return sort.order === "asc" ? (aValue === bValue ? 0 : aValue ? 1 : -1) : (aValue === bValue ? 0 : aValue ? -1 : 1)
    }

    return 0
  })

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Goals</h1>
        <div className="flex items-center gap-4">
          <AddGoalButton onClick={() => setIsAddModalOpen(true)} />

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search goals..."
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10 w-[200px]"
            />
          </div>

          {/* Sort */}
          <GoalSort onSortChange={setSort} />

          {/* Filters */}
          <GoalFilters onFilterChange={setFilters} />
        </div>
      </div>

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

      <GoalDetailsModal
        isOpen={detailsOpen}
        onClose={() => { setDetailsOpen(false); setSelectedGoal(null); }}
        goal={selectedGoal}
        onEdit={handleEdit}
      />

      {/* Goals List */}
      {loading ? (
        <div>Loading...</div>
      ) : sortedGoals.length === 0 ? (
        <div className="text-gray-500">
          {searchQuery || Object.values(filters).some(value => value !== "" && value !== "all")
            ? "No goals found matching your search and filters."
            : "No goals yet."}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedGoals.map((goal) => (
            <div
              key={goal.id}
              onClick={() => {
                setSelectedGoal(goal)
                setDetailsOpen(true)
              }}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <h3 className="font-semibold text-lg">{goal.name}</h3>
              {goal.description && (
                <p className="text-gray-600 mt-1">{goal.description}</p>
              )}
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <span className="capitalize">{goal.frequency}</span>
                {goal.due_date && (
                  <span>Due: {new Date(goal.due_date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</span>
                )}
                <span className={goal.done ? "text-green-600" : "text-yellow-600"}>
                  {goal.done ? "Completed" : "In Progress"}
                </span>
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
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 
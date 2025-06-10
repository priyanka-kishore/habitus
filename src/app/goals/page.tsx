"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { GoalFilters } from "@/components/goals/goal-filters"
import { GoalSort, type SortState } from "@/components/goals/goal-sort"
import { AddGoalButton } from "@/components/goals/add-goal-button"
import { AddGoalModal } from "@/components/goals/add-goal-modal"

interface Goal {
  id: string
  name: string
  description?: string
  frequency: "once" | "daily"
  due_date?: string
  created_at: string
  done: boolean
}

interface FilterState {
  name: string
  description: string
  frequency: string
  dueDate: string
  done: string
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    name: "",
    description: "",
    frequency: "all",
    dueDate: "",
    done: "all"
  })
  const [sort, setSort] = useState<SortState>({
    field: "created_at",
    order: "desc"
  })
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  useEffect(() => {
    fetchGoals()
  }, [])

  async function fetchGoals() {
    setLoading(true)
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .order("created_at", { ascending: false })
    if (!error && data) setGoals(data)
    setLoading(false)
  }

  const filteredGoals = goals.filter(goal => {
    // Search query filter
    const matchesSearch = goal.name.toLowerCase().includes(searchQuery.toLowerCase())

    // Additional filters
    const matchesName = !filters.name || goal.name.toLowerCase().includes(filters.name.toLowerCase())
    const matchesDescription = !filters.description || (goal.description && goal.description.toLowerCase().includes(filters.description.toLowerCase()))
    const matchesFrequency = filters.frequency === "all" || goal.frequency === filters.frequency
    const matchesDueDate = !filters.dueDate || (goal.due_date && new Date(goal.due_date).toLocaleDateString('en-US', { timeZone: 'UTC' }) === filters.dueDate)
    const matchesDone = filters.done === "all" || goal.done.toString() === filters.done

    return matchesSearch && matchesName && matchesDescription && matchesFrequency && matchesDueDate && matchesDone
  })

  const sortedGoals = [...filteredGoals].sort((a, b) => {
    const aValue = a[sort.field as keyof Goal]
    const bValue = b[sort.field as keyof Goal]

    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sort.order === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    if (sort.field === 'due_date' || sort.field === 'created_at') {
      const aDate = new Date(aValue as string)
      const bDate = new Date(bValue as string)
      return sort.order === 'asc'
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime()
    }

    return sort.order === 'asc'
      ? (aValue < bValue ? -1 : 1)
      : (bValue < aValue ? -1 : 1)
  })

  const handleGoalAdded = (newGoal: Goal) => {
    setGoals([newGoal, ...goals])
  }

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
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 
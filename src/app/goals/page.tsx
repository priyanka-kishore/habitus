"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { GoalFilters } from "@/components/goals/goal-filters"
import { GoalSort } from "@/components/goals/goal-sort"
import { AddGoalButton } from "@/components/goals/add-goal-button"
import { AddGoalModal } from "@/components/goals/add-goal-modal"
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

  const filteredGoals = goals.filter(goal => {
    // Search query filter
    const matchesSearch = goal.name.toLowerCase().includes(searchQuery.toLowerCase())

    // Additional filters
    const matchesName = !filters.name || goal.name.toLowerCase().includes(filters.name.toLowerCase())
    const matchesDescription = !filters.description || (goal.description && goal.description.toLowerCase().includes(filters.description.toLowerCase()))
    const matchesFrequency = filters.frequency === "all" || goal.frequency === filters.frequency
    const matchesDueDate = !filters.dueDate || (goal.due_date && new Date(goal.due_date).toLocaleDateString('en-US', { timeZone: 'UTC' }) === filters.dueDate)
    const matchesDone = filters.done === "all" || goal.done.toString() === filters.done
    const matchesVisibility = filters.visibility === "all" || (goal.visibility || "public") === filters.visibility

    return matchesSearch && matchesName && matchesDescription && matchesFrequency && matchesDueDate && matchesDone && matchesVisibility
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

      <GoalDetailsModal
        isOpen={detailsOpen}
        onClose={() => { setDetailsOpen(false); setSelectedGoal(null); }}
        goal={selectedGoal}
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
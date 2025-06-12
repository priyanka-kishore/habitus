export interface Goal {
  id: string
  name: string
  description?: string
  frequency: "once" | "daily"
  due_date?: string
  created_at: string
  done: boolean
  visibility: "public" | "private" | "friends"
}

export interface FilterState {
  name: string
  description: string
  frequency: string
  dueDate: string
  done: string
  visibility: string
}

export type SortOrder = "asc" | "desc"

export interface SortState {
  field: keyof Goal
  order: SortOrder
}

export interface AddGoalModalProps {
  isOpen: boolean
  onClose: () => void
  onGoalAdded: (goal: Goal) => void
}

export interface EditGoalModalProps {
  isOpen: boolean
  onClose: () => void
  onGoalUpdated: (goal: Goal) => void
  goal: Goal | null
}

export interface DeleteGoalModalProps {
  isOpen: boolean
  onClose: () => void
  onGoalDeleted: (goalId: string) => void
  goal: Goal | null
}

export interface AddGoalButtonProps {
  onClick: () => void
  className?: string
}

export interface GoalFiltersProps {
  onFilterChange: (filters: FilterState) => void
}

export interface GoalSortProps {
  onSortChange: (sort: SortState) => void
} 
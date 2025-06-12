"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

export type SortField = "name" | "due_date" | "created_at" | "frequency" | "visibility"
export type SortOrder = "asc" | "desc"

export interface SortState {
  field: SortField
  order: SortOrder
}

interface GoalSortProps {
  onSortChange: (sort: SortState) => void
}

export function GoalSort({ onSortChange }: GoalSortProps) {
  const [sort, setSort] = useState<SortState>({
    field: "created_at",
    order: "desc"
  })

  const handleSortChange = (field: SortField) => {
    const newSort: SortState = {
      field,
      order: field === sort.field && sort.order === "asc" ? "desc" : "asc"
    }
    setSort(newSort)
    onSortChange(newSort)
  }

  const sortOptions: { label: string; value: SortField }[] = [
    { label: "Name", value: "name" },
    { label: "Due Date", value: "due_date" },
    { label: "Created At", value: "created_at" },
    { label: "Frequency", value: "frequency" },
    { label: "Visibility", value: "visibility" }
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1">
          <ArrowUpDown className="h-4 w-4" />
          Sort
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="end">
        <div className="py-1">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className={cn(
                "w-full px-2 py-1.5 text-sm flex items-center justify-between hover:bg-accent",
                sort.field === option.value && "bg-accent"
              )}
              onClick={() => handleSortChange(option.value)}
            >
              <span>{option.label}</span>
              {sort.field === option.value && (
                sort.order === "asc" ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
} 
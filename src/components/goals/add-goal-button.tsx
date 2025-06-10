import { Plus } from "lucide-react"

interface AddGoalButtonProps {
  onClick: () => void
  className?: string
}

export function AddGoalButton({ onClick, className = "" }: AddGoalButtonProps) {
  return (
    <button
      type="button"
      className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${className}`}
      onClick={onClick}
    >
      <Plus className="h-5 w-5" />
      Add New Goal
    </button>
  )
} 
"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
	HamburgerMenuIcon,
} from "@radix-ui/react-icons";

interface Goal {
  id: string
  name: string
  description?: string
  frequency: "once" | "daily"
  due_date?: string
  created_at: string
}

export default function GoalGallery() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingGoal, setDeletingGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    frequency: "once",
    due_date: ""
  });

  useEffect(() => {
    fetchGoals()
  }, []);

  async function fetchGoals() {
    setLoading(true);
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setGoals(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    const { data, error } = await supabase.from("goals").insert([
      {
        name: form.name,
        description: form.description || null,
        frequency: form.frequency,
        due_date: form.due_date || null
      }
    ]).select();
    if (!error && data) {
      setGoals([data[0], ...goals]);
      setOpen(false);
      setForm({ name: "", description: "", frequency: "once", due_date: "" });
    }
    setLoading(false);
  }

  async function handleEdit(goal: Goal) {
    setEditingGoal(goal);
    setForm({
      name: goal.name,
      description: goal.description || "",
      frequency: goal.frequency,
      due_date: goal.due_date || ""
    });
    setEditOpen(true);
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingGoal) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("goals")
      .update({
        name: form.name,
        description: form.description || null,
        frequency: form.frequency,
        due_date: form.due_date || null
      })
      .eq("id", editingGoal.id)
      .select();
    if (!error && data) {
      setGoals(goals => goals.map(g => g.id === editingGoal.id ? data[0] : g));
      setEditOpen(false);
      setEditingGoal(null);
    }
    setLoading(false);
  }

  function handleDeleteClick(goal: Goal) {
    setDeletingGoal(goal);
    setDeleteOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!deletingGoal) return;
    setLoading(true);
    const { error } = await supabase
      .from("goals")
      .delete()
      .eq("id", deletingGoal.id);
    if (!error) {
      setGoals(goals => goals.filter(g => g.id !== deletingGoal.id));
      setDeleteOpen(false);
      setDeletingGoal(null);
    }
    setLoading(false);
  }

  function handleDeleteCancel() {
    setDeleteOpen(false);
    setDeletingGoal(null);
  }

  return (
    <div>
      {/* Add New Goal Button */}
      <button
        type="button"
        className="flex items-center gap-2 px-6 py-3 mb-8 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        style={{ width: 'fit-content' }}
        onClick={() => setOpen(true)}
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        Add New Goal
      </button>

      {/* Dialog Popup */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form
            className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-8 w-full max-w-md space-y-4"
            onSubmit={handleSubmit}
          >
            <h2 className="text-xl font-bold mb-2">Create a New Goal</h2>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Goal name"
              value={form.name}
              required
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
            <textarea
              className="w-full border rounded px-3 py-2"
              placeholder="Description (optional)"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
            <div className="flex gap-4 items-center">
              <label className="font-medium">Frequency:</label>
              <label>
                <input
                  type="radio"
                  name="frequency"
                  value="once"
                  checked={form.frequency === "once"}
                  onChange={() => setForm(f => ({ ...f, frequency: "once" }))}
                />
                <span className="ml-1">Once</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="frequency"
                  value="daily"
                  checked={form.frequency === "daily"}
                  onChange={() => setForm(f => ({ ...f, frequency: "daily" }))}
                />
                <span className="ml-1">Daily</span>
              </label>
            </div>
            <input
              className="w-full border rounded px-3 py-2"
              type="date"
              value={form.due_date}
              onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Saving..." : "Create Goal"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Dialog Popup for Edit */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form
            className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-8 w-full max-w-md space-y-4"
            onSubmit={handleEditSubmit}
          >
            <h2 className="text-xl font-bold mb-2">Edit Goal</h2>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Goal name"
              value={form.name}
              required
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
            <textarea
              className="w-full border rounded px-3 py-2"
              placeholder="Description (optional)"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
            <div className="flex gap-4 items-center">
              <label className="font-medium">Frequency:</label>
              <label>
                <input
                  type="radio"
                  name="frequency"
                  value="once"
                  checked={form.frequency === "once"}
                  onChange={() => setForm(f => ({ ...f, frequency: "once" }))}
                />
                <span className="ml-1">Once</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="frequency"
                  value="daily"
                  checked={form.frequency === "daily"}
                  onChange={() => setForm(f => ({ ...f, frequency: "daily" }))}
                />
                <span className="ml-1">Daily</span>
              </label>
            </div>
            <input
              className="w-full border rounded px-3 py-2"
              type="date"
              value={form.due_date}
              onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                onClick={() => { setEditOpen(false); setEditingGoal(null); }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Dialog Popup for Delete */}
      {deleteOpen && deletingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-8 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold mb-2">Delete Goal</h2>
            <p>Are you sure you want to delete the goal <span className="font-semibold">&quot;{deletingGoal.name}&quot;</span>? This action cannot be undone.</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                onClick={handleDeleteCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                onClick={handleDeleteConfirm}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery of Goal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {goals.map(goal => (
          <div key={goal.id} className="bg-white dark:bg-zinc-900 rounded-xl shadow p-6 flex flex-col gap-2 border relative">
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
            <div className="font-bold text-lg">{goal.name}</div>
            {goal.description && <div className="text-muted-foreground">{goal.description}</div>}
            <div className="text-xs mt-2">
              <span className="inline-block px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 mr-2">
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
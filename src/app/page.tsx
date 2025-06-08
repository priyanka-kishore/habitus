import { Sidebar } from "@/components/dashboard/sidebar"

/**
 * Main page when logged in
 * 
 */
export default function DashboardPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Here will be your goals, metrics, and friends.
        </p>
      </main>
    </div>
  )
}

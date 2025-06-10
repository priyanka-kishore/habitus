import GoalGallery from "@/components/dashboard/goal-gallery"

/**
 * Main page when logged in
 * 
 */
export default function DashboardPage() {
  return (
    <>
      <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Here will be your goals, metrics, and friends.
      </p>
      <div className="mt-8">
        <GoalGallery />
      </div>
    </>
  )
}

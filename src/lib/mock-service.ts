// Mock data types
export interface Goal {
  id: string
  name: string
  description?: string
  frequency: "once" | "daily"
  due_date?: string
  created_at: string
  done: boolean
}

// localStorage key
const LOCAL_STORAGE_KEY = "mockGoals";

// Function to load goals from localStorage or use initial mock data
const loadGoals = (): Goal[] => {
  if (typeof window !== "undefined") {
    const storedGoals = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedGoals ? JSON.parse(storedGoals) : [
      {
        id: "1",
        name: "Morning Meditation",
        description: "15 minutes of mindfulness practice",
        frequency: "daily",
        created_at: new Date().toISOString(),
        done: false
      },
      {
        id: "2",
        name: "Read a Book",
        description: "Read at least 30 pages",
        frequency: "daily",
        created_at: new Date().toISOString(),
        done: true
      },
      {
        id: "3",
        name: "Complete Project",
        description: "Finish the MVP features",
        frequency: "once",
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        done: false
      }
    ];
  }
  return []; // Return empty array if window is not defined (e.g., during SSR)
};

// Function to save goals to localStorage
const saveGoals = (goals: Goal[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(goals));
  }
};

// Mock service that mimics Supabase's API
export const mockService = {
  from: (_table: string) => ({
    select: (_columns: string = "*") => ({
      order: (column: string, { ascending }: { ascending: boolean }) => ({
        then: async () => {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500));
          const currentGoals = loadGoals(); // Always load the latest from localStorage
          return {
            data: [...currentGoals].sort((a, b) => {
              const aValue = a[column as keyof Goal] ?? "";
              const bValue = b[column as keyof Goal] ?? "";
              return ascending 
                ? aValue > bValue ? 1 : -1
                : aValue < bValue ? 1 : -1;
            }),
            error: null
          };
        }
      }),
      then: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const currentGoals = loadGoals(); // Always load the latest from localStorage
        return { data: currentGoals, error: null };
      }
    }),
    insert: (data: Partial<Goal>[]) => ({
      select: () => ({
        then: async () => {
          await new Promise(resolve => setTimeout(resolve, 500));
          const currentGoals = loadGoals(); // Load current goals to add to
          const newGoal: Goal = {
            id: Math.random().toString(36).substr(2, 9),
            created_at: new Date().toISOString(),
            done: false,
            ...data[0]
          } as Goal;
          currentGoals.unshift(newGoal);
          saveGoals(currentGoals); // Save to localStorage after insert
          return { data: [newGoal], error: null };
        }
      })
    }),
    update: (updates: Partial<Goal>) => ({
      eq: (column: string, value: string) => ({
        select: () => ({
          then: async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            let currentGoals = loadGoals(); // Load current goals to update
            const index = currentGoals.findIndex(g => g[column as keyof Goal] === value);
            if (index !== -1) {
              currentGoals[index] = { ...currentGoals[index], ...updates };
              saveGoals(currentGoals); // Save to localStorage after update
              return { data: [currentGoals[index]], error: null };
            }
            return { data: null, error: new Error("Goal not found") };
          }
        })
      })
    }),
    delete: () => ({
      eq: (column: string, value: string) => ({
        then: async () => {
          await new Promise(resolve => setTimeout(resolve, 500));
          let currentGoals = loadGoals(); // Load current goals to delete from
          const index = currentGoals.findIndex(g => g[column as keyof Goal] === value);
          if (index !== -1) {
            currentGoals.splice(index, 1);
            saveGoals(currentGoals); // Save to localStorage after delete
            return { error: null };
          }
          return { error: new Error("Goal not found") };
        }
      })
    })
  })
}; 
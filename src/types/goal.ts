// src/types/goal.ts
// TypeScript interface for a habit goal in the Habitus app

export interface Goal {
  id: string;
  title: string;
  frequency: string;
  due_date: string;
  is_public: boolean;
  created_at: string;
  description?: string | null;
  // Add other fields as needed (e.g., updated_at, user_id)
} 
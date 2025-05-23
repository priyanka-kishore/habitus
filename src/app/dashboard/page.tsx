'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Goal {
  id: string;
  title: string;
  frequency: string;
  due_date: string;
  is_public: boolean;
  created_at: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('Not logged in, redirecting to auth');
        router.push('/auth');
        return;
      }
      fetchGoals();
    };

    checkAuth();
  }, [router]);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/create')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Goal
            </button>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {goals.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <h3 className="mt-2 text-sm font-medium text-gray-900">No goals yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new goal.</p>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/create')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Create your first goal
                </button>
              </div>
            </div>
          ) : (
            goals.map((goal) => (
              <div
                key={goal.id}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">{goal.title}</h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Frequency: {goal.frequency}</p>
                    <p>Due: {new Date(goal.due_date).toLocaleDateString()}</p>
                    <p>Visibility: {goal.is_public ? 'Public' : 'Private'}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => router.push(`/goal/${goal.id}`)}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
} 
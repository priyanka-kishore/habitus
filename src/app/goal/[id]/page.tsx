'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Goal } from '@/types/goal';

export default function GoalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const goalId = params?.id as string | undefined;
  const [goal, setGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!goalId) {
      setError('No goal ID provided.');
      setIsLoading(false);
      return;
    }
    const fetchGoal = async () => {
      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('id', goalId)
        .single();
      if (error) {
        setError('Goal not found or you do not have access.');
        setGoal(null);
      } else {
        setGoal(data as Goal);
      }
      setIsLoading(false);
    };
    fetchGoal();
  }, [goalId]);

  const handleDelete = async () => {
    if (!goalId) return;
    const confirmed = window.confirm('Are you sure you want to delete this goal? This action cannot be undone.');
    if (!confirmed) return;
    const { error } = await supabase.from('goals').delete().eq('id', goalId);
    if (error) {
      setError('Failed to delete goal.');
    } else {
      router.push('/dashboard');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded shadow">
          <p className="text-red-800 text-center">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            onClick={() => router.push('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!goal) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Goal Details</h2>
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Title:</span> {goal.title}
          </div>
          {goal.description && (
            <div>
              <span className="font-semibold">Description:</span> {goal.description}
            </div>
          )}
          <div>
            <span className="font-semibold">Frequency:</span> {goal.frequency}
          </div>
          <div>
            <span className="font-semibold">Due Date:</span> {goal.due_date ? new Date(goal.due_date).toLocaleDateString() : 'N/A'}
          </div>
          <div>
            <span className="font-semibold">Visibility:</span> {goal.is_public ? 'Public' : 'Private'}
          </div>
          <div>
            <span className="font-semibold">Created At:</span> {new Date(goal.created_at).toLocaleString()}
          </div>
        </div>
        <div className="mt-8 flex justify-between">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => router.push('/dashboard')}
          >
            Back
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 
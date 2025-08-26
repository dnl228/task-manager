/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../libs/api';

export type NewTask = {
    title: string;
    description?: string;
}

export type Task = {
    id: number;
    title: string;
    isCompleted: boolean;
    createdAt: string;
    description?: string;
}

export const TaskStatus = {
    All: 'all',
    Completed: 'completed',
    Pending: 'pending'
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

type TasksContextType = {
  tasks: Task[];
  filter: TaskStatus;
  setFilter: React.Dispatch<React.SetStateAction<TaskStatus>>;
  counts: { all: number; completed: number; pending: number };
  loading: boolean;
  load: (status?: TaskStatus) => Promise<void>;
  createTask: (payload: NewTask) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
};

const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: Readonly<React.PropsWithChildren>) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskStatus>('all'); 
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (status = filter) => {
    setLoading(true);
    try {
      const q = status === 'all' ? '' : `?status=${status}`;
      const { data } = await api.get(`/tasks${q}`);
      setTasks(data);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const createTask = useCallback(async (payload: NewTask) => {
    await api.post('/tasks', payload);
    await load();
  }, [load]);

  const toggleTask = useCallback(async (id: number) => {
    await api.patch(`/tasks/${id}/toggle`);
    await load();
  }, [load]);

  const deleteTask = useCallback(async (id: number) => {
    await api.delete(`/tasks/${id}`);
    await load();
  }, [load]);

  const counts = useMemo(() => ({
    all: tasks.length,
    completed: tasks && tasks.filter(t => t.isCompleted).length,
    pending: tasks && tasks.filter(t => !t.isCompleted).length
  }), [tasks]);


  useEffect(() => { load(); }, [filter, load]);

  const value = {
    tasks, filter, setFilter, counts,
    loading,
    load, createTask, toggleTask, deleteTask
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within <TasksProvider>');
  return ctx;
}

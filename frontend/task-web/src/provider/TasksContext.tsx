/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../libs/api';
import type { NewTask } from '../types/newTask';
import type { Task } from '../types/task';
import type { TaskStatus } from '../types/taskStatus';

type TasksContextType = {
  groupedTasks: { all: Task[], completed: Task[], pending: Task[] };
  filter: TaskStatus;
  setFilter: React.Dispatch<React.SetStateAction<TaskStatus>>;
  counts: { all: number; completed: number; pending: number };
  loading: boolean;
  load: (status?: TaskStatus) => Promise<void>;
  createTask: (payload: NewTask) => Promise<void>;
  updateTask: (id: number, payload: NewTask) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  moveTask: (id: number, direction: string) => Promise<void>;
  setActiveTask: React.Dispatch<React.SetStateAction<Task | null>>;
  activeTask: Task | null
};

const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: Readonly<React.PropsWithChildren>) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskStatus>('all'); 
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/tasks`);
      setTasks(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (payload: NewTask) => {
    await api.post('/tasks', payload);
    await load();
  }, [load]);

  const updateTask = useCallback(async (id: number, payload: NewTask) => {
    await api.put(`/tasks/${id}`, payload);
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

  const moveTask = useCallback(async (id: number, direction: string) => {
    await api.patch(`/tasks/${id}/move?direction=${direction}`);
    await load();
  }, [load]);

  const counts = useMemo(() => ({
    all: tasks.length,
    completed: tasks && tasks.filter(t => t.isCompleted).length,
    pending: tasks && tasks.filter(t => !t.isCompleted).length
  }), [tasks]);

  const groupedTasks = useMemo(() => ({
    all: tasks,
    completed: tasks && tasks.filter(t => t.isCompleted),
    pending: tasks && tasks.filter(t => !t.isCompleted)
  }), [tasks])

  useEffect(() => { load(); }, [filter, load]);

  const value = {
    groupedTasks, filter, setFilter, counts,
    loading,
    load, createTask, updateTask, toggleTask, deleteTask, moveTask,
    activeTask, setActiveTask
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within <TasksProvider>');
  return ctx;
}

import TaskItem from './TaskItem';
import { useTasks } from '../provider/TasksContext';

export default function TaskList() {
  const { tasks, loading } = useTasks();

  if (loading) return <div>Loading…</div>;
  if (!tasks.length) return <div>No tasks yet.</div>;

  return (
    <ul style={{ display: 'grid', gap: 8, listStyle: 'none', padding: 0 }}>
      {tasks.map(t => <TaskItem key={t.id} task={t} />)}
    </ul>
  );
}
import TaskItem from './TaskItem';
import { useTasks } from '../provider/TasksContext';

export default function TaskList() {
  const { groupedTasks, filter, loading } = useTasks();

  if (loading) return <div>Loading…</div>;
  if (!groupedTasks[filter].length) return <div>No tasks yet.</div>;

  return (
    <ul style={{ display: 'grid', gap: 8, listStyle: 'none', padding: 0 }}>
      {groupedTasks[filter].map((t, idx) => <TaskItem key={t.id} task={t} canMoveUp={idx > 0} canMoveDown={idx < groupedTasks[filter].length - 1}/>)}
    </ul>
  );
}
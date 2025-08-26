import { useTasks, type Task } from '../provider/TasksContext';

export default function TaskItem({ task }: { task: Task}) {
  const { toggleTask, deleteTask } = useTasks();

  return (
    <li style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <strong>{task.title}</strong>
          {task.isCompleted && <span> — Done</span>}
          {task.description && <div style={{ opacity: 0.8 }}>{task.description}</div>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => toggleTask(task.id)}>
            {task.isCompleted ? 'Mark Pending' : 'Mark Done'}
          </button>
          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </div>
      </div>
    </li>
  );
}

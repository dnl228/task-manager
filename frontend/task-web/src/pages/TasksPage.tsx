import Header from '../components/Header';
import FilterBar from '../components/FilterBar';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

export default function TasksPage() {
  return (
    <div style={{ maxWidth: 720, margin: '2rem auto', padding: 16 }}>
      <Header />
      <FilterBar />
      <TaskForm />
      <TaskList />
    </div>
  );
}

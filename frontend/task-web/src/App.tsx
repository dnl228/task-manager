import { useAuth } from './provider/AuthContext';
import LoginForm from './components/LoginForm';
import TasksPage from './pages/TasksPage';

export default function App() {
  const { isAuthed } = useAuth();
  return isAuthed ? <TasksPage /> : <LoginForm />;
}
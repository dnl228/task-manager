import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from '../App';

const mockUseAuth = jest.fn();
const mockUseTasks = jest.fn();

jest.mock('../provider/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('../provider/TasksContext', () => ({
  useTasks: () => mockUseTasks(),
  TaskStatus: { All: 'all', Completed: 'completed', Pending: 'pending' },
}));

afterEach(() => {
  jest.resetAllMocks();
});

describe('App', () => {
  test('renders LoginForm when not authed', () => {
    mockUseAuth.mockReturnValue({ isAuthed: false, token: null, login: jest.fn(), logout: jest.fn() });
    mockUseTasks.mockReturnValue({
      tasks: [],
      filter: 'all',
      setFilter: jest.fn(),
      counts: { all: 0, completed: 0, pending: 0 },
      loading: false,
      load: jest.fn(),
      createTask: jest.fn(),
      toggleTask: jest.fn(),
      deleteTask: jest.fn(),
    });

    render(<App />);
    expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
  });

  test('renders TasksPage when authed', () => {
    mockUseAuth.mockReturnValue({ isAuthed: true, token: 'token', login: jest.fn(), logout: jest.fn() });

    mockUseTasks.mockReturnValue({
      tasks: [
        { id: 1, title: 'Test task', isCompleted: false, createdAt: new Date().toISOString(), description: 'desc' }
      ],
      filter: 'all',
      setFilter: jest.fn(),
      counts: { all: 1, completed: 0, pending: 1 },
      loading: false,
      load: jest.fn(),
      createTask: jest.fn(),
      toggleTask: jest.fn(),
      deleteTask: jest.fn(),
    });

    render(<App />);
    expect(screen.getByText(/Task Manager/i)).toBeInTheDocument();
  });
});
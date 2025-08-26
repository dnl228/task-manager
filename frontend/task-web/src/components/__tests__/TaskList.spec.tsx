import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import TaskList from '../TaskList';

const mockUseTasks = jest.fn();

jest.mock('../../provider/TasksContext', () => ({
  useTasks: () => mockUseTasks(),
}));

// Mock TaskItem to render a simple li with task title so we can assert mapping
jest.mock('../TaskItem', () => ({
  __esModule: true,
  default: (props: { task: { title: string } }) => <li>{props.task.title}</li>,
}));

afterEach(() => jest.resetAllMocks());

describe('TaskList', () => {
  test('shows loading state', () => {
    mockUseTasks.mockReturnValue({ loading: true, tasks: [] });
    render(<TaskList />);
    expect(screen.getByText(/Loading…/i)).toBeInTheDocument();
  });

  test('shows empty message when no tasks', () => {
    mockUseTasks.mockReturnValue({ loading: false, tasks: [] });
    render(<TaskList />);
    expect(screen.getByText(/No tasks yet\./i)).toBeInTheDocument();
  });

  test('renders list of tasks', () => {
    const tasks = [
      { id: 1, title: 'First', isCompleted: false, createdAt: new Date().toISOString() },
      { id: 2, title: 'Second', isCompleted: true, createdAt: new Date().toISOString() },
    ];
    mockUseTasks.mockReturnValue({ loading: false, tasks });

    render(<TaskList />);

    expect(screen.getByText(/First/i)).toBeInTheDocument();
    expect(screen.getByText(/Second/i)).toBeInTheDocument();
  });
});

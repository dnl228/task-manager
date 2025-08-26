import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterBar from '../FilterBar';

const mockUseTasks = jest.fn();

jest.mock('../../provider/TasksContext', () => ({
  useTasks: () => mockUseTasks(),
  TaskStatus: { All: 'all', Completed: 'completed', Pending: 'pending' },
}));

afterEach(() => jest.resetAllMocks());

describe('FilterBar', () => {
  test('renders buttons with correct counts and highlights active filter', () => {
    mockUseTasks.mockReturnValue({ filter: 'all', setFilter: jest.fn(), counts: { all: 3, completed: 1, pending: 2 } });

    render(<FilterBar />);

    const allBtn = screen.getByText(/All \(3\)/i);
    const completedBtn = screen.getByText(/Completed \(1\)/i);
    const pendingBtn = screen.getByText(/Pending \(2\)/i);

    expect(allBtn).toBeInTheDocument();
    expect(completedBtn).toBeInTheDocument();
    expect(pendingBtn).toBeInTheDocument();

    // active filter should have different background
    expect(allBtn).toHaveStyle({ background: '#eee' });
  });

  test('clicking buttons calls setFilter with correct id', () => {
    const setFilter = jest.fn();
    mockUseTasks.mockReturnValue({ filter: 'all', setFilter, counts: { all: 3, completed: 1, pending: 2 } });

    render(<FilterBar />);

    const completedBtn = screen.getByText(/Completed \(1\)/i);
    fireEvent.click(completedBtn);

    expect(setFilter).toHaveBeenCalledWith('completed');
  });
});
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import TasksPage from '../TasksPage';

jest.mock('../../components/Header', () => ({ __esModule: true, default: () => <header>HeaderMock</header> }));
jest.mock('../../components/FilterBar', () => ({ __esModule: true, default: () => <div>FilterBarMock</div> }));
jest.mock('../../components/TaskForm', () => ({ __esModule: true, default: () => <form>TaskFormMock</form> }));
jest.mock('../..//components/TaskList', () => ({ __esModule: true, default: () => <ul>TaskListMock</ul> }));

describe('TasksPage', () => {
  afterEach(() => jest.resetAllMocks());

  test('matches snapshot', () => {
    const { asFragment } = render(<TasksPage />);
    expect(asFragment()).toMatchSnapshot();
  });
});
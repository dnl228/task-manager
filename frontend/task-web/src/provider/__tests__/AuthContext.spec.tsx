import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { api, registerUnauthorizedHandler } from '../../libs/api';

function TestConsumer() {
  const { token, isAuthed, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="token">{token ?? ''}</div>
      <div data-testid="authed">{isAuthed ? 'true' : 'false'}</div>
      <button onClick={() => login('u', 'p')}>doLogin</button>
      <button onClick={() => logout()}>doLogout</button>
    </div>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
  });

  test('reads initial token from localStorage', () => {
    localStorage.setItem('token', 'init-token');
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('token').textContent).toBe('init-token');
    expect(screen.getByTestId('authed').textContent).toBe('true');
  });

  test('login stores token in localStorage and updates context', async () => {
    (api.post as jest.Mock).mockResolvedValue({ data: { token: 'new-token' } });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('doLogin'));

    await waitFor(() => expect(screen.getByTestId('token').textContent).toBe('new-token'));
    expect(localStorage.getItem('token')).toBe('new-token');
    expect(screen.getByTestId('authed').textContent).toBe('true');
  });

  test('logout clears token from localStorage and updates context', async () => {
    localStorage.setItem('token', 'to-be-cleared');

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('authed').textContent).toBe('true');

    fireEvent.click(screen.getByText('doLogout'));

    await waitFor(() => expect(screen.getByTestId('authed').textContent).toBe('false'));
    expect(localStorage.getItem('token')).toBeNull();
  });

  test('registerUnauthorizedHandler is registered and invoking it triggers logout', async () => {
    localStorage.setItem('token', 'will-be-removed');

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(registerUnauthorizedHandler).toHaveBeenCalledTimes(1);
    const handler = (registerUnauthorizedHandler as jest.Mock).mock.calls[0][0];
    expect(typeof handler).toBe('function');

    act(() => { handler(); });

    await waitFor(() => expect(screen.getByTestId('authed').textContent).toBe('false'));
    expect(localStorage.getItem('token')).toBeNull();
  });
});

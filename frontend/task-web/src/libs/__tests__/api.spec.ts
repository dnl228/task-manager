import type { AxiosRequestConfig } from 'axios';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let api: any;
let registerUnauthorizedHandler: (fn: (() => void) | null) => void;
let reqInterceptor: (config: AxiosRequestConfig) => AxiosRequestConfig;
let resRejected: (err: unknown) => Promise<unknown>;

describe('libs/api interceptors', () => {
  beforeAll(() => {
    // Require the actual module (bypass the global mock from jest.setup.ts)
    const mod = jest.requireActual('../api');
    api = mod.api;
    registerUnauthorizedHandler = mod.registerUnauthorizedHandler;

    // Access the internal interceptor handlers after we have the real axios instance
    reqInterceptor = ((api.interceptors.request as unknown) as {
      handlers: Array<{ fulfilled: (config: AxiosRequestConfig) => AxiosRequestConfig }>;
    }).handlers[0].fulfilled;

    resRejected = ((api.interceptors.response as unknown) as {
      handlers: Array<{ rejected: (err: unknown) => Promise<unknown> }>;
    }).handlers[0].rejected;
  });

  beforeEach(() => {
    localStorage.clear();
    registerUnauthorizedHandler(null);
  });

  test('adds Authorization header when token is present in localStorage', () => {
    localStorage.setItem('token', 'test-token');
    const config: AxiosRequestConfig = { headers: {} } as AxiosRequestConfig;
    const result = reqInterceptor(config);
    expect(result.headers?.Authorization).toBe('Bearer test-token');
  });

  test('does not add Authorization header when token is missing', () => {
    const config: AxiosRequestConfig = { headers: {} } as AxiosRequestConfig;
    const result = reqInterceptor(config);
    expect(result.headers?.Authorization).toBeUndefined();
  });

  test('calls registered unauthorized handler on 401 and rejects the promise', async () => {
    const handler = jest.fn();
    registerUnauthorizedHandler(handler);

    const err = { response: { status: 401 } };
    await expect(resRejected(err)).rejects.toBe(err);
    expect(handler).toHaveBeenCalled();
  });

  test('does not call handler for non-401 response status', async () => {
    const handler = jest.fn();
    registerUnauthorizedHandler(handler);

    const err = { response: { status: 403 } };
    await expect(resRejected(err)).rejects.toBe(err);
    expect(handler).not.toHaveBeenCalled();
  });

  test('response interceptor safely rejects when no handler is registered', async () => {
    registerUnauthorizedHandler(null);
    const err = { response: { status: 401 } };
    await expect(resRejected(err)).rejects.toBe(err);
  });
});
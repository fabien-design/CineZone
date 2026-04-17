import api from './axiosInstance';

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = { username: string; email: string; password: string };
export type User = { id: number; username: string; email: string; role: string };

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post('/users/login', payload).then(r => r.data),

  register: (payload: RegisterPayload) =>
    api.post('/users/register', payload, { suppressSuccessToast: true, suppressErrorToast: true }).then(r => r.data),

  me: () =>
    api.get<User>('/users/me').then(r => r.data),

  logout: () => api.post('/users/logout'),
};

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAppDispatch } from '@/store/hooks';
import { setUser, clearUser } from '@/store/authSlice';
import { ApiResponse, AuthData, User } from '@/types';
import type { LoginFormValues, RegisterFormValues } from '@/lib/validation';

export const useCurrentUser = () => {
  const dispatch = useAppDispatch();
  return useQuery<User>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const data = await api.get<ApiResponse<AuthData>>('/auth/me');
      dispatch(setUser(data.data!.user));
      return data.data!.user;
    },
    retry: false,
    staleTime: 1000 * 60 * 10,
  });
};

export const useRegister = () => {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const qc       = useQueryClient();
  return useMutation<ApiResponse<AuthData>, Error, RegisterFormValues>({
    mutationFn: (v) => api.post<ApiResponse<AuthData>>('/auth/register', v),
    onSuccess: (d) => {
      dispatch(setUser(d.data!.user));
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
      router.push('/dashboard');
    },
  });
};

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const qc       = useQueryClient();
  return useMutation<ApiResponse<AuthData>, Error, LoginFormValues>({
    mutationFn: (v) => api.post<ApiResponse<AuthData>>('/auth/login', v),
    onSuccess: (d) => {
      dispatch(setUser(d.data!.user));
      qc.invalidateQueries({ queryKey: ['auth', 'me'] });
      router.push('/dashboard');
    },
  });
};

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const qc       = useQueryClient();
  return useMutation<void, Error>({
  
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      dispatch(clearUser());
      qc.clear();
      router.push('/auth/login');
    },
  });
};
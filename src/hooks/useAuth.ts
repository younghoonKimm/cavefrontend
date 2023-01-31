import { getMe } from '@/api/auth';
import { IUser } from '@/types/auth';
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { QUERYKEY_USER } from 'constants/queryKeys';
import { getCookie } from 'cookies-next';

interface UseAuthReturnType {
  user: IUser | undefined;
}

export default function useAuth() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery([QUERYKEY_USER], () => getMe(), {});

  return { user };
}

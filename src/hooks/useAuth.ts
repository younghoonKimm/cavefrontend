import { getMe } from '@/api/auth';
import { IUser } from '@/types/auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERYKEY_USER } from 'constants/queryKeys';

interface UseAuthReturnType {
  user: IUser | undefined;
}

export default function useAuth(): UseAuthReturnType {
  const queryClient = useQueryClient();

  const { data: user } = useQuery([QUERYKEY_USER], () => getMe(), {});

  return { user };
}

import { getMe } from '@/api/auth/auth';
import { IUser } from '@/types/auth';
import { resetTokens } from '@/utils/getCookies';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERYKEY_USER } from 'constants/queryKeys';
import { getAccessToken, getRefreshToken } from '@/utils/getCookies';

interface UseAuthReturnType {
  user: IUser | undefined;
  userLoading: boolean;
  clearUserQuery: () => void;
}

export default function useAuth(): UseAuthReturnType {
  const queryClient = useQueryClient();

  let at = getAccessToken();
  let rt = getRefreshToken();

  const { data: user, isLoading: userLoading } = useQuery(
    [QUERYKEY_USER],
    () => getMe(),
    {
      enabled: at && rt,
      retry: 0,
      onError: () => {
        return null;
      },

      // onError(error: any) {
      //   if (error.request.status === 403) {
      //     clearUserQuery();
      //   }
      // },
    },
  );

  const clearUserQuery = () => {
    resetTokens();

    queryClient.setQueryData([QUERYKEY_USER], () => null);
    queryClient.removeQueries([QUERYKEY_USER]);
  };

  return { user, userLoading, clearUserQuery };
}

import { getMe } from '@/api/auth';
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

  const at = getAccessToken();
  const rt = getRefreshToken();

  const clearUserQuery = () => {
    queryClient.setQueryData([QUERYKEY_USER], () => null);
    queryClient.removeQueries([QUERYKEY_USER]);
    resetTokens();
  };

  const { data: user, isLoading: userLoading } = useQuery(
    [QUERYKEY_USER],
    () => getMe(),
    {
      enabled: Boolean(at && rt),
      // onError(error: any) {
      //   if (error.request.status === 403) {
      //     clearUserQuery();
      //   }
      // },
    },
  );

  return { user, userLoading, clearUserQuery };
}

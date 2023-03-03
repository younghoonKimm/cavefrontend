import { getProfileAPI } from '@/api/auth/auth';
import { IUser } from '@/types/auth';
import { resetTokens } from '@/utils/getCookies';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERYKEY_CONFERENCES, QUERYKEY_USER } from 'constants/queryKeys';
import { getAccessToken, getRefreshToken } from '@/utils/getCookies';

interface UseAuthReturnType {
  user: IUser | undefined;
  userLoading: boolean;
  clearUserQuery: () => void;
}

export async function getMe(): Promise<IUser> {
  const res = await getProfileAPI();
  if (res) {
    const { data } = res;

    return data?.user;
  } else {
    return null;
  }
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

      onError: (err) => {},
    },
  );

  const clearUserQuery = () => {
    resetTokens();

    queryClient.setQueryData([QUERYKEY_USER], () => null);
    queryClient.removeQueries([QUERYKEY_USER]);
    queryClient.removeQueries([QUERYKEY_CONFERENCES]);
  };

  return { user, userLoading, clearUserQuery };
}

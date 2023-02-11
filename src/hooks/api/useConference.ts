import {
  getConferenceAPI,
  postConferenceAPI,
} from '@/api/conference/conference';
import { IUser } from '@/types/auth';
import {
  UseMutateFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { QUERYKEY_CONFERENCE } from 'constants/queryKeys';
import useModal from '../useModal';

async function createConference(conference: any): Promise<void> {
  await postConferenceAPI(conference);
}

export function useCreateConference(): UseMutateFunction<
  void,
  unknown,
  any,
  unknown
> {
  const queryClient = useQueryClient();

  const { onCloseModal } = useModal();

  const { mutate } = useMutation(
    (conference: any) => createConference(conference),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QUERYKEY_CONFERENCE]);
        onCloseModal();
      },
    },
  );

  return mutate;
}

export async function getConference(): Promise<void> {
  const res = await getConferenceAPI();

  return res.data?.conferences;
}

export function useGetConference(auth: IUser | undefined) {
  const { data: conferences, isLoading: userLoading } = useQuery(
    [QUERYKEY_CONFERENCE],
    getConference,
    {
      enabled: Boolean(auth),
      // onError(error: any) {
      //   if (error.request.status === 403) {
      //     clearUserQuery();
      //   }
      // },
    },
  );

  return { conferences };
}

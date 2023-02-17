import {
  deleteConferenceAPI,
  getConferenceAPI,
  postConferenceAPI,
} from '@/api/conference/conference';
import { IUser } from '@/types/auth';
import { IConference } from '@/types/conference';
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

export async function getConference(): Promise<IConference[]> {
  const res = await getConferenceAPI();

  return res?.data?.conferences;
}

export function useGetConference(auth: IUser | undefined): {
  conferences: IConference[] | undefined;
} {
  const { data: conferences, isLoading: userLoading } = useQuery(
    [QUERYKEY_CONFERENCE],
    getConference,
    {
      enabled: Boolean(auth),
    },
  );

  return { conferences };
}

export async function deleteConference(id: string): Promise<void> {
  await deleteConferenceAPI(id);
}

export function useDeleteConference() {
  const queryClient = useQueryClient();

  const { mutate: deleteConferenceMutate } = useMutation(
    (id: string) => deleteConference(id),
    {
      onMutate: (id: string) => {
        const oldConferences: IConference[] | undefined =
          queryClient.getQueryData([QUERYKEY_CONFERENCE]);

        if (oldConferences) {
          queryClient.cancelQueries([QUERYKEY_CONFERENCE]);
          queryClient.setQueryData(
            [QUERYKEY_CONFERENCE],
            (oldConferences: IConference[] | undefined) =>
              oldConferences?.filter((conference) => conference.id !== id),
          );

          return () =>
            queryClient.setQueryData([QUERYKEY_CONFERENCE], oldConferences);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries([QUERYKEY_CONFERENCE]);
      },
      onError: (err, values, rollback) => {
        if (rollback) {
          rollback();
        }
      },
    },
  );

  return { deleteConferenceMutate };
}

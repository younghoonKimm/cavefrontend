import {
  deleteConferenceAPI,
  getConferenceAPI,
  getConferencesAPI,
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
import { QUERYKEY_CONFERENCES, QUERYKEY_CONFERENCE } from 'constants/queryKeys';
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
        queryClient.invalidateQueries([QUERYKEY_CONFERENCES]);
        onCloseModal();
      },
    },
  );

  return mutate;
}

export async function getConferences(): Promise<IConference[]> {
  const res = await getConferencesAPI();

  return res?.data?.conferences;
}

export async function getConference(id: string): Promise<IConference> {
  const res = await getConferenceAPI(id);

  return res?.data;
}

export function useGetConferences(auth: IUser | undefined): {
  conferences: IConference[] | undefined;
} {
  const { data: conferences, isLoading: userLoading } = useQuery(
    [QUERYKEY_CONFERENCES],
    getConferences,
    {
      enabled: Boolean(auth),
    },
  );

  return { conferences };
}

export function useGetConference(
  id: string,
  auth: IUser | undefined,
): {
  conference: IConference | undefined;
} {
  const { data: conference, isLoading: userLoading } = useQuery(
    [QUERYKEY_CONFERENCE, id],
    () => getConference(id),

    {
      enabled: Boolean(id && auth),
      retry: 0,
    },
  );

  return { conference };
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
          queryClient.getQueryData([QUERYKEY_CONFERENCES]);

        if (oldConferences) {
          queryClient.cancelQueries([QUERYKEY_CONFERENCES]);
          queryClient.setQueryData(
            [QUERYKEY_CONFERENCES],
            (oldConferences: IConference[] | undefined) =>
              oldConferences?.filter((conference) => conference.id !== id),
          );

          return () =>
            queryClient.setQueryData([QUERYKEY_CONFERENCES], oldConferences);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries([QUERYKEY_CONFERENCES]);
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

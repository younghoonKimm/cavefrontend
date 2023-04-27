import { patchAgendaAPI } from '@/api/agenda/agenda';
import { IAgneda } from '@/types/conference';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERYKEY_AGENDA } from 'constants/queryKeys';

export function usePatchAgneda() {
  const queryClient = useQueryClient();

  const { mutate: pathAgenda } = useMutation(
    (id: string) => patchAgendaAPI(id, {}),
    {
      onMutate: (id: string) => {
        const oldAgenda: IAgneda | undefined = queryClient.getQueryData([
          QUERYKEY_AGENDA,
          id,
        ]);

        if (oldAgenda) {
          queryClient.cancelQueries([QUERYKEY_AGENDA, id]);
          queryClient.setQueryData(
            [QUERYKEY_AGENDA, id],
            (agenda: IAgneda | undefined) => agenda,
          );

          return () =>
            queryClient.setQueryData([QUERYKEY_AGENDA, id], oldAgenda);
        }
      },
      onSettled: (id) => {
        queryClient.invalidateQueries([QUERYKEY_AGENDA, id]);
      },
      onError: (err, values, rollback) => {
        if (rollback) {
          rollback();
        }
      },
    },
  );

  return { pathAgenda };
}

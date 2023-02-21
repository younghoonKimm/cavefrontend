import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';

import Head from 'next/head';
import useAuth, { getMe } from '@/hooks/api/useAuth';
import { withAuth } from '@/utils/getServerSide';
import {
  QUERYKEY_CONFERENCE,
  QUERYKEY_CONFERENCES,
  QUERYKEY_USER,
} from 'constants/queryKeys';

import ConferenceTemplate from '@/components/templates/ConferenceTemplate/ConferenceTemplate';
import { getConference } from '@/hooks/api/useConference';
import { useRouter } from 'next/router';

const ConferenceDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>Conference</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ConferenceTemplate />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withAuth(
  async (context?: GetServerSidePropsContext) => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery([QUERYKEY_USER], getMe, {
      staleTime: 900,
    });

    if (context) {
      const { params } = context;
      if (params) {
        const { id: conferenceId } = params;

        await queryClient.prefetchQuery(
          [QUERYKEY_CONFERENCE, conferenceId],
          () => getConference(conferenceId as string),
          {
            staleTime: 10000,
          },
        );
      }
    }

    return {
      props: { dehydratedState: dehydrate(queryClient) },
    };
  },
);

export default ConferenceDetail;

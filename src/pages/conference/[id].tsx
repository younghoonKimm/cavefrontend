import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';

import Head from 'next/head';
import { getMe } from '@/hooks/api/useAuth';
import { withAuth } from '@/utils/getServerSide';
import { QUERYKEY_CONFERENCE, QUERYKEY_USER } from 'constants/queryKeys';

import ApiErrorBoundary from '../APIErrorBoundary';

import dynamic from 'next/dynamic';
import { getConference } from '@/hooks/api/useConference';
import { Suspense } from 'react';

const ConferenceTemplate = dynamic(
  () => import('@/components/templates/ConferenceTemplate/ConferenceTemplate'),
);

const ConferenceDetail: NextPage = () => {
  return (
    <>
      <Head>
        <title>Conference</title>
      </Head>

      <ApiErrorBoundary>
        <Suspense>
          <ConferenceTemplate />
        </Suspense>
      </ApiErrorBoundary>
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

import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import ApiErrorBoundary from '../APIErrorBoundary';

const MeetingTemplate = dynamic(
  () => import('@/components/templates/MeetingTemplate/MeetingTemplate'),
);

const MeetingDetail: NextPage = () => {
  return (
    <>
      <Head>
        <title>Meeting</title>
      </Head>

      <ApiErrorBoundary>
        <MeetingTemplate />
      </ApiErrorBoundary>
    </>
  );
};

export default MeetingDetail;

import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import ApiErrorBoundary from '../../APIErrorBoundary';

const ConferenceWriteTemplate = dynamic(
  () => import('@/components/templates/ConferenceWriteTemplate'),
);

const ConferenceDetail: NextPage = () => {
  return (
    <>
      <Head>
        <title>Conference Update</title>
      </Head>

      <ApiErrorBoundary>
        <ConferenceWriteTemplate />
      </ApiErrorBoundary>
    </>
  );
};

export default ConferenceDetail;

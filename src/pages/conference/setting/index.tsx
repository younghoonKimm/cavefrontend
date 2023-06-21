import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import ApiErrorBoundary from '../../APIErrorBoundary';

const ConferenceSettingTemplate = dynamic(
  () => import('@/components/templates/ConferenceSettingTemplate'),
);

const ConferenceDetail: NextPage = () => {
  return (
    <>
      <Head>
        <title>Conference Setting</title>
      </Head>

      <ApiErrorBoundary>
        <ConferenceSettingTemplate />
      </ApiErrorBoundary>
    </>
  );
};

export default ConferenceDetail;

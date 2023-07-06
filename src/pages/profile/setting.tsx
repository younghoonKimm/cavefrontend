import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import ApiErrorBoundary from '../APIErrorBoundary';

const ProfileSettingTemplate = dynamic(
  () =>
    import(
      '@/components/templates/ProfileSettingTemplate/ProfileSettingTemplate'
    ),
);

const ProfileSetting: NextPage = () => {
  return (
    <>
      <Head>
        <title>Meeting</title>
      </Head>

      <ApiErrorBoundary>
        <ProfileSettingTemplate />
      </ApiErrorBoundary>
    </>
  );
};

export default ProfileSetting;

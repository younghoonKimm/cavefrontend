import Conference from '@/components/molecules/Conference/Conference';
import useAuth from '@/hooks/api/useAuth';
import { useGetConferences } from '@/hooks/api/useConference';
import { Suspense } from 'react';
import Layout from '../Layout/Layout';

function ConferenceListTemplate() {
  const { user } = useAuth();
  const { conferences } = useGetConferences(user);

  return (
    <Layout>
      <Suspense fallback={<div>loadign</div>}>
        {conferences?.map((conference) => (
          <Conference key={conference.id} conference={conference} />
        ))}
      </Suspense>
    </Layout>
  );
}

export default ConferenceListTemplate;

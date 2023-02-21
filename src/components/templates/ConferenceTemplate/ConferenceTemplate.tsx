import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import ConferenceForm from '@/components/molecules/Conference/ConferenceForm';
import useAuth from '@/hooks/api/useAuth';
import useSocket from '@/hooks/useSocket';
import Layout from '../Layout/Layout';
import { getConference, useGetConference } from '@/hooks/api/useConference';
import { getConferenceAPI } from '@/api/conference/conference';

function ConferenceTemplate() {
  const router = useRouter();
  const { id } = router.query;

  const { user } = useAuth();
  const [socket, disconnect] = useSocket(id as string);
  const [mes, setMes] = useState<string>('');

  const { conference } = useGetConference(id as string, user);

  useEffect(() => {
    if (!user) router.replace('/');
  }, [user, router]);

  useEffect(() => {
    if (user && socket) {
      socket.on('messaged', (data) => {
        setMes(data);
      });

      socket.on('offer', (data) => {
        console.log(data);
      });

      return () => {
        socket?.off('messaged', () => setMes(''));
        socket?.off('offer', () => setMes(''));
      };
    }
  }, [socket, user]);

  const onSubmit = useCallback(async () => {
    socket?.emit('message', mes);
  }, [socket, mes]);

  return (
    <Layout>
      <>
        {socket && user && (
          <div>
            <button type="button" onClick={() => onSubmit()}>
              <span>button</span>
            </button>
            <ConferenceForm text={mes} setText={setMes} />
          </div>
        )}
      </>
    </Layout>
  );
}

export default ConferenceTemplate;

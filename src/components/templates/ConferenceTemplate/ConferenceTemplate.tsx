import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import ConferenceForm from '@/components/molecules/Conference/ConferenceForm';
import useAuth from '@/hooks/api/useAuth';
import useSocket, { sockets } from '@/hooks/useSocket';
import Layout from '../Layout/Layout';
import { io } from 'socket.io-client';
import { useGetConference } from '@/hooks/api/useConference';

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

  // useEffect(() => {
  //   return () => {
  //     disconnect();
  //   };
  // }, [disconnect, id]);

  useEffect(() => {
    if (user && socket) {
      socket.on('messaged', (data) => {
        console.log(data);
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

  console.log(socket);

  const onSubmit = useCallback(() => {
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

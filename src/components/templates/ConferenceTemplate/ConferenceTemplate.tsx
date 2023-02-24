import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import ConferenceForm from '@/components/molecules/Conference/ConferenceForm';
import useAuth from '@/hooks/api/useAuth';
import useSocket, { sockets } from '@/hooks/useSocket';
import Layout from '../Layout/Layout';
import { io } from 'socket.io-client';
import { useGetConference } from '@/hooks/api/useConference';
import { usePatchAgneda } from '@/hooks/api/useAgenda';

function ConferenceTemplate() {
  const router = useRouter();
  const { id } = router.query;

  const { user } = useAuth();

  const [socket, disconnect] = useSocket(id as string);
  const [mes, setMes] = useState<string>('');

  const { conference } = useGetConference(id as string, user);
  const { pathAgenda } = usePatchAgneda();

  useEffect(() => {
    if (!user) {
      router.replace('/');
    }
  }, [user]);

  // useEffect(() => {
  //   return () => {
  //     disconnect();
  //   };
  // }, [id]);

  useEffect(() => {
    if (user && socket) {
      console.log('?');
      socket.emit('login', id);

      socket.once('offer', (data) => {
        console.log(data);
      });

      socket.on('messaged', (data) => {
        console.log(data);
        // setMes(data);
      });

      // socket.on('someEve', (data) => console.log(data));

      return () => {
        socket.off('messaged', (data) => {
          console.log(data);
          // setMes(data);
        });
        socket?.off('offer', (data) => {
          console.log(data);
        });
      };
    }
  }, [socket, user]);

  const onSubmit = useCallback(() => {
    socket?.emit('message', mes);
  }, [socket, mes]);

  const onPatchAgenda = useCallback(
    () => pathAgenda('3b31c8c8-b7f2-4a57-b907-480509dd0098'),
    [socket],
  );

  return (
    <Layout>
      <>
        {socket && user && (
          <div>
            <button type="button" onClick={() => onSubmit()}>
              <span>button</span>
            </button>
            <button onClick={onPatchAgenda}>
              <span>onPath</span>
            </button>
            <ConferenceForm text={mes} setText={setMes} />
          </div>
        )}
      </>
    </Layout>
  );
}

export default ConferenceTemplate;

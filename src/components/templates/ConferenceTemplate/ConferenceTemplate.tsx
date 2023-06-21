import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import ConferenceForm from '@/components/molecules/Conference/ConferenceForm';
import useAuth from '@/hooks/api/useAuth';
import useSocket from '@/hooks/useSocket';
import Layout from '../Layout/Layout';

import { useGetConference } from '@/hooks/api/useConference';
import { usePatchAgneda } from '@/hooks/api/useAgenda';
import { PartialUserType, User } from '@/types/auth';

function ConferenceTemplate() {
  const router = useRouter();
  const { id } = router.query;

  const { user } = useAuth();

  const [socket, disconnect] = useSocket(id as string);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isJoin, setisJoin] = useState<boolean>(false);
  const [joinedUsers, setJoinedUsers] = useState<PartialUserType[]>([]);
  const [mes, setMes] = useState<string>('');

  const { conference, userLoading } = useGetConference(id as string, user);

  const { pathAgenda } = usePatchAgneda();

  const isConnected = socket && user;

  const addJoinedUsers = (users: PartialUserType[]) => setJoinedUsers(users);

  const onJoined = async () => {
    try {
      if (!socket) return;

      if (socket) {
        socket?.emit('login', user);

        socket.on('joinRoom', (room) => {
          console.log(room);
        });
      }
    } catch (err) {
      /* handle the error */
    }
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [id]);

  useEffect(() => {
    if (user && socket && isJoin) {
      onJoined();

      socket.on('exit', (users) => {
        addJoinedUsers(users);
      });

      socket.on('joined', (users) => {
        if (users) {
          addJoinedUsers(users);
        }
      });

      socket.on('messaged', (data) => {
        console.log(data);
        setMes(data);
      });

      return () => {
        socket.off('messaged', (data) => setMes(data));
        socket.off('join', (users) => addJoinedUsers(users));
      };
    }
  }, [socket, user, isJoin]);

  const onSubmit = useCallback(() => {
    console.log(mes);
    socket?.emit('message', mes);
  }, [mes]);

  const onPatchAgenda = useCallback(
    () => pathAgenda('bfcd87ca-2846-4971-aed5-6bb2507de172'),
    [],
  );

  const onJoinedRoom = () => setisJoin(true);

  return (
    <Layout>
      <div>
        {isJoin ? (
          <>
            {isConnected && (
              <div>
                <button type="button" onClick={() => onSubmit()}>
                  <span>button</span>
                </button>
                <button onClick={onPatchAgenda}>
                  <span>onPath</span>
                </button>
                <ConferenceForm text={mes} setText={setMes} />
                {Object.values(joinedUsers).map((joinUser: any) => (
                  <div key={joinUser.id}>{joinUser.name}</div>
                ))}
                <div></div>
              </div>
            )}
          </>
        ) : (
          <div>
            <button type="button">연결하기</button>
            <button
              type="button"
              onClick={() => {
                setisJoin(true);
              }}
            >
              입장하기
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ConferenceTemplate;

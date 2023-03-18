import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';

import ConferenceForm from '@/components/molecules/Conference/ConferenceForm';
import useAuth from '@/hooks/api/useAuth';
import useSocket from '@/hooks/useSocket';
import Layout from '../Layout/Layout';

import { useGetConference } from '@/hooks/api/useConference';
import { usePatchAgneda } from '@/hooks/api/useAgenda';
import { PartialUserType, User } from '@/types/auth';
import useMedia from '@/hooks/useMedia';
import Video from '@/components/atoms/Video/Video';

const pc_config = {
  iceServers: [
    // {
    //   urls: 'stun:[STUN_IP]:[PORT]',
    //   'credentials': '[YOR CREDENTIALS]',
    //   'username': '[USERNAME]'
    // },
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ],
};

function ConferenceTemplate() {
  const router = useRouter();
  const { id } = router.query;

  const { user } = useAuth();

  const [socket, disconnect] = useSocket(id as string);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isJoin, setisJoin] = useState<boolean>(false);
  const [joinedUsers, setJoinedUsers] = useState<PartialUserType[]>([]);
  const [mes, setMes] = useState<string>('');

  const { conference } = useGetConference(id as string, user);
  const { pathAgenda } = usePatchAgneda();

  const {
    newConnectionRef,
    remoteVideoRef,
    onJoined,
    localVideoRef,
    createOffer,
    onVideo,
    createAnswer,
  } = useMedia(socket, user);

  const isConnected = socket && user;

  const addJoinedUsers = (users: PartialUserType[]) => setJoinedUsers(users);

  useEffect(() => {
    if (!user) {
      router.replace('/');
    }
  }, [user]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [id]);

  useEffect(() => {
    if (user && socket && isJoin) {
      socket.on('exit', (users) => {
        addJoinedUsers(users);
      });

      socket.on('joined', (users) => {
        if (users) {
          addJoinedUsers(users);
        }
      });

      socket.once('send-offer', () => {
        console.log(1);
        createOffer();
      });

      socket.on('messaged', (data) => setMes(data));

      socket.on('getOffer', (sdp: RTCSessionDescription) => {
        createAnswer(sdp);
      });

      socket.on('get-capability', (mediasoupWorkers) => {
        console.log(mediasoupWorkers);
      });

      socket.on('getAnswer', (sdp: RTCSessionDescription) => {
        if (!newConnectionRef.current) return;
        newConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(sdp),
        );
      });

      socket.on('getCandidate', async (candidate: RTCIceCandidateInit) => {
        if (!newConnectionRef.current) return;

        await newConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(candidate),
        );
      });

      onJoined();

      return () => {
        socket.off('messaged', (data) => setMes(data));
        socket.off('getOffer', (users) => addJoinedUsers(users));
        socket.off('getAnswer', (users) => addJoinedUsers(users));
        socket.off('getCandidate', (users) => addJoinedUsers(users));
      };
    }
  }, [socket, user, isJoin, newConnectionRef]);

  const onSubmit = useCallback(() => {
    socket?.emit('message', mes);
  }, [socket, mes]);

  const onPatchAgenda = useCallback(
    () => pathAgenda('bfcd87ca-2846-4971-aed5-6bb2507de172'),
    [socket],
  );

  const onJoinedRoom = () => setisJoin(true);

  return (
    <Layout>
      <>
        <div>
          <div>
            <Video ref={localVideoRef} autoPlay muted />
          </div>
          <div>
            <Video ref={remoteVideoRef} autoPlay muted />
          </div>
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
                  <div>
                    {/* <video
                      id="remotevideo"
                      style={{
                        width: 240,
                        height: 240,
                        margin: 5,
                        backgroundColor: 'black',
                      }}
                      ref={remoteVideoRef}
                      autoPlay
                    ></video> */}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => {
                  onVideo();
                }}
              >
                연결하기
              </button>
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
      </>
    </Layout>
  );
}

export default ConferenceTemplate;

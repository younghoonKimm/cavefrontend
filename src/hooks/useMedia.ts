import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

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

export default function useMedia(socket: Socket | undefined) {
  const [newConnection, setNewConnection] = useState<any>();
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const pc = new RTCPeerConnection();
    setNewConnection(new RTCPeerConnection(pc_config));
    // Rest of your logic here
  }, []);

  const onJoined = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        // 자신의 video, audio track을 모두 자신의 RTCPeerConnection에 등록한다.
        stream.getTracks().forEach((track) => {
          newConnection.addTrack(track, stream);
        });
        newConnection.onicecandidate = (e) => {
          if (e.candidate) {
            socket?.emit('candidate', e.candidate);
          }
        };
        newConnection.oniceconnectionstatechange = (e) => {
          console.log(e);
        };

        // newConnection.ontrack = (ev) => {
        //   console.log('add remotetrack success');
        //   if (remoteVideoRef.current)
        //     remoteVideoRef.current.srcObject = ev.streams[0];
        // };

        // 자신의 video, audio track을 모두 자신의 RTCPeerConnection에 등록한 후에 room에 접속했다고 Signaling Server에 알린다.
        // 왜냐하면 offer or answer을 주고받을 때의 RTCSessionDescription에 해당 video, audio track에 대한 정보가 담겨 있기 때문에
        // 순서를 어기면 상대방의 MediaStream을 받을 수 없음
        // socket.emit('login', {
        //   room: '1234',
        //   email: 'sample@naver.com',
        // });
      })
      .catch((error) => {
        console.log(`getUserMedia error: ${error}`);
      });
  };

  return { newConnection, onJoined, localVideoRef };
}

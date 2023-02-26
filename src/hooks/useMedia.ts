import { IUser } from '@/types/auth';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [offerOpt, setOffetOpt] = useState({ video: false, audio: false });

  const newConnectionRef = useRef<RTCPeerConnection>();
  const localStreamRef = useRef<MediaStream>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    newConnectionRef.current = new RTCPeerConnection(pc_config);

    return () => {
      if (newConnectionRef.current) {
        console.log('close');
        newConnectionRef.current.close();
      }
    };
  }, []);

  const getUserStram = async () =>
    await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

  const onJoined = useCallback(async () => {
    try {
      if (newConnectionRef.current) {
        const sdp = await newConnectionRef.current?.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });

        await newConnectionRef.current?.setLocalDescription(
          new RTCSessionDescription(sdp),
        );

        const stream = await getUserStram();

        if (stream) {
          if (!newConnectionRef.current) return;
          if (localVideoRef.current) localVideoRef.current.srcObject = stream;

          stream
            .getTracks()
            .forEach((track) =>
              newConnectionRef.current?.addTrack(track, stream),
            );

          newConnectionRef.current.onicecandidate = (e) => {
            if (e.candidate) {
              socket?.emit('candidate', e.candidate);
            }
          };

          newConnectionRef.current.oniceconnectionstatechange = (e) => {
            console.log(e);
          };
        }
      }
    } catch (err) {
      /* handle the error */
    }
  }, [newConnectionRef, socket]);

  const createAnswer = async (sdp: RTCSessionDescription) => {
    try {
      if (newConnectionRef.current) {
        const mySdp = await newConnectionRef.current.createAnswer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true,
        });

        await newConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(sdp),
        );

        await newConnectionRef.current.setLocalDescription(
          new RTCSessionDescription(mySdp),
        );

        socket?.emit('answer', mySdp);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return { newConnectionRef, onJoined, localVideoRef };
}

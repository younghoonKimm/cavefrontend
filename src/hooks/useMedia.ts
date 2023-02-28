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

interface OfferType {
  video: boolean;
  audio: boolean;
}

export default function useMedia(socket: Socket | undefined) {
  const [offerOpt, setOffetOpt] = useState<OfferType>({
    video: true,
    audio: false,
  });

  const newConnectionRef = useRef<RTCPeerConnection>();
  const localStreamRef = useRef<MediaStream>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      //   if (newConnectionRef.current) {
      //     console.log('close');
      //     newConnectionRef.current.close();
      //   }
    };
  }, []);

  const getUserStram = async (video: boolean = true, audio: boolean = false) =>
    await navigator.mediaDevices.getUserMedia({
      video,
      audio,
    });

  const onVideo = useCallback(async () => {
    const stream = await getUserStram();

    if (stream) {
      if (!newConnectionRef.current) return;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      stream
        .getTracks()
        .forEach((track) => newConnectionRef.current?.addTrack(track, stream));
    }
  }, []);

  const createOffer = async () => {
    try {
      if (newConnectionRef.current && socket) {
        const sdp = await newConnectionRef.current.createOffer({
          offerToReceiveAudio: false,
          offerToReceiveVideo: false,
        });
        await newConnectionRef.current.setLocalDescription(
          new RTCSessionDescription(sdp),
        );
        console.log(sdp);
        socket.emit('offer', sdp);
      }
    } catch (e) {
      console.error(e, 'error');
    }
  };

  const onJoined = useCallback(async () => {
    try {
      if (newConnectionRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (stream) {
          if (localVideoRef.current) localVideoRef.current.srcObject = stream;

          stream
            .getTracks()
            .forEach((track) =>
              newConnectionRef.current?.addTrack(track, stream),
            );
        }

        newConnectionRef.current.onicecandidate = (e) => {
          if (e.candidate) {
            console.log(e.candidate);
            socket?.emit('candidate', e.candidate);
          }
        };

        newConnectionRef.current.oniceconnectionstatechange = (e) => {
          //   console.log(e);
        };

        newConnectionRef.current.ontrack = (ev) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = ev.streams[0];
          }
        };
      }
    } catch (err) {
      /* handle the error */
    }
  }, [onVideo, socket]);

  const createAnswer = async (sdp: RTCSessionDescription) => {
    try {
      if (newConnectionRef.current && socket) {
        await newConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(sdp),
        );

        const mySdp = await newConnectionRef.current.createAnswer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true,
        });

        await newConnectionRef.current.setLocalDescription(
          new RTCSessionDescription(mySdp),
        );
        socket?.emit('answer', mySdp);
      }
    } catch (e) {
      console.error(e, 'inUse');
    }
  };

  return {
    newConnectionRef,
    onJoined,
    localVideoRef,
    onVideo,
    createOffer,
    createAnswer,
    offerOpt,
    setOffetOpt,
  };
}

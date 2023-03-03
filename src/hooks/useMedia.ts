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

export default function useMedia(socket: Socket | undefined, user) {
  const [offerOpt, setOffetOpt] = useState<OfferType>({
    video: true,
    audio: false,
  });

  const newConnectionRef = useRef<RTCPeerConnection>();
  const localStreamRef = useRef<MediaStream>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // const getLocalStream = useCallback(async () => {
  //   try {
  //     const localStream = await navigator.mediaDevices.getUserMedia({
  //       audio: true,
  //       video: {
  //         width: 240,
  //         height: 240,
  //       },
  //     });
  //     localStreamRef.current = localStream;
  //     if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
  //     if (socket) {
  //       socket?.emit('login', user);
  //     }
  //   } catch (e) {
  //     console.log(`getUserMedia error: ${e}`);
  //   }
  // }, []);

  useEffect(() => {
    newConnectionRef.current = new RTCPeerConnection(pc_config);

    return () => {
      //   if (newConnectionRef.current) {
      //     console.log('close');
      //     newConnectionRef.current.close();
      //   }
    };
  }, []);

  const getUserStram = async (video: boolean = true, audio: boolean = false) =>
    await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

  const onVideo = async () => {
    const stream = await getUserStram();

    if (stream) {
      if (!newConnectionRef.current) return;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      stream
        .getTracks()
        .forEach((track) => newConnectionRef.current?.addTrack(track, stream));
    }
  };

  const createOffer = useCallback(async () => {
    try {
      if (newConnectionRef.current && socket) {
        if (newConnectionRef.current?.remoteDescription) return;
        const sdp = await newConnectionRef.current.createOffer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true,
        });

        //여기가 undefined
        await newConnectionRef.current.setLocalDescription(
          new RTCSessionDescription(sdp),
        );

        socket.emit('offer', sdp);
      }
    } catch (e) {
      console.error(e, 'error');
    }
  }, [newConnectionRef, socket]);

  const onJoined = async () => {
    try {
      if (!socket) return;

      if (newConnectionRef.current && socket) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

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

        newConnectionRef.current.oniceconnectionstatechange = (e) => {};

        newConnectionRef.current.ontrack = (ev) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = ev.streams[0];
          }
        };

        socket?.emit('login', user);
      }
    } catch (err) {
      /* handle the error */
    }
  };

  const createAnswer = async (sdp: RTCSessionDescription) => {
    try {
      if (!socket) return;
      if (newConnectionRef.current && socket) {
        console.log('sendsdp', sdp);

        await newConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(sdp),
        );

        const mySdp = await newConnectionRef.current.createAnswer();

        newConnectionRef.current.setLocalDescription(mySdp);

        socket?.emit('answer', mySdp);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return {
    newConnectionRef,
    remoteVideoRef,
    onJoined,
    localVideoRef,
    onVideo,
    createOffer,
    createAnswer,
    offerOpt,
    setOffetOpt,
  };
}

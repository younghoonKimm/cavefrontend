import { IUser, User } from '@/types/auth';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { Device } from 'mediasoup-client';

const pc_config = {
  iceServers: [
    // {
    //   urls: 'stun:[STUN_IP]:[PORT]',
    //   'credentials': '[YOR CREDENTIALS]',
    //   'username': '[USERNAME]'
    // },
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
        'stun:stun3.l.google.com:19302',
        'stun:stun4.l.google.com:19302',
      ],
    },
  ],
};

interface OfferType {
  video: boolean;
  audio: boolean;
}

export default function useMedia(
  socket: Socket | undefined,
  user: IUser | undefined,
) {
  const [offerOpt, setOffetOpt] = useState<OfferType>({
    video: true,
    audio: false,
  });
  const [myStream, setMyStream] = useState<any>();

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
      if (newConnectionRef.current) {
        newConnectionRef.current = undefined;
      }
    };
  }, []);

  useEffect(() => {
    if (myStream) {
      if (!newConnectionRef.current) return;
      if (localVideoRef.current) localVideoRef.current.srcObject = myStream;

      myStream
        .getTracks()
        .forEach((track: MediaStreamTrack) =>
          newConnectionRef.current?.addTrack(track, myStream),
        );

      return () => {
        if (myStream) {
          myStream
            .getTracks()
            .forEach((track: MediaStreamTrack) => track.stop());
        }
      };
    }
  }, [myStream]);

  const getUserStram = async (video: boolean = true, audio: boolean = false) =>
    await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

  const [device, setDevice] = useState();

  const createDevice = async () => {
    try {
      const device = new Device();

      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-load
      // Loads the device with RTP capabilities of the Router (server side)
      // await device.load({ routerRtpCapabilities });

      console.log('RTP Capabilities', device.rtpCapabilities);
    } catch (error) {
      console.log(error);
    }
  };

  const onVideo = async () => {
    const stream = await getUserStram();
    setMyStream(stream);
  };

  const createOffer = useCallback(async () => {
    try {
      if (newConnectionRef.current && socket) {
        if (newConnectionRef.current?.remoteDescription) return;
        const sdp = await newConnectionRef.current.createOffer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true,
        });

        newConnectionRef.current.setLocalDescription(sdp);

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
        // await onVideo();

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

        newConnectionRef.current.setRemoteDescription(
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

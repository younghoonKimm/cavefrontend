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
  const [producerTransport, setProducerTransport] = useState<any>();

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

  const [device, setDevice] = useState<Device>();

  const createDevice = async (rtpCapabilities: any) => {
    try {
      const newDevice = new Device();

      // Loads the device with RTP capabilities of the Router (server side)
      // await device.load({ routerRtpCapabilities });

      await newDevice.load({
        routerRtpCapabilities: rtpCapabilities,
      });

      setDevice(newDevice);

      createSendTransport(newDevice);
    } catch (error) {
      console.log(error);
    }
  };

  const createSendTransport = useCallback(
    (device: any) => {
      socket?.emit(
        'createWebRtcTransport',
        { consumer: false },
        ({ params }: { params: any }) => {
          // if (params?.error) {
          //   console.log(params.error);
          //   return;
          // }

          // creates a new WebRTC Transport to send media
          // based on the server's producer transport params
          // https://mediasoup.org/documentation/v3/mediasoup-client/api/#TransportOptions
          const newProducerTransport = device?.createSendTransport(params);
          setProducerTransport(newProducerTransport);
          console.log(newProducerTransport);

          newProducerTransport?.on(
            'connect',
            async ({ dtlsParameters }: any, callback: () => void) => {
              try {
                // Signal local DTLS parameters to the server side transport
                // see server's socket.on('transport-connect', ...)
                await socket?.emit('transport-connect', {
                  dtlsParameters,
                });

                // Tell the transport that parameters were transmitted.
                callback();
              } catch (error) {
                return error;
              }
            },
          );

          newProducerTransport?.on(
            'produce',
            async (
              parameters: any,
              callback: ({ id }: { id: string }) => void,
            ) => {
              console.log(parameters);

              try {
                // tell the server to create a Producer
                // with the following parameters and produce
                // and expect back a server side producer id
                // see server's socket.on('transport-produce', ...)
                await socket.emit(
                  'transport-produce',
                  {
                    kind: parameters.kind,
                    rtpParameters: parameters.rtpParameters,
                    appData: parameters.appData,
                  },
                  ({ id }: { id: string }) => {
                    callback({ id });
                  },
                );
              } catch (error) {
                // errback(error);
              }
            },
          );
        },
      );
    },
    [socket, device],
  );

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
    createDevice,
  };
}

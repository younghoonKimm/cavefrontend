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
  const [consumingTransports, setConsumingTransports] = useState<any>([]);
  const [audioParams, setAudioParams] = useState<any>(null);
  const [videoParams, setVideoParams] = useState<any>(null);
  const [rtpCapabilities, setRtpCapabilities] = useState(null);
  const [device, setDevice] = useState<Device>();
  const newConnectionRef = useRef<RTCPeerConnection>();
  const localStreamRef = useRef<MediaStream>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);

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

  const createDevice = async (rtpCapabilities: any) => {
    try {
      const newDevice = new Device();

      await newDevice.load({
        routerRtpCapabilities: rtpCapabilities,
      });

      setDevice(newDevice);

      createSendTransport(newDevice);

      socket?.on('new-producer', ({ producerId }) =>
        signalNewConsumerTransport(producerId, device),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const signalNewConsumerTransport = async (
    remoteProducerId: any,
    device: any,
  ) => {
    //check if we are already consuming the remoteProducerId
    if (consumingTransports.includes(remoteProducerId)) return;
    setConsumingTransports(remoteProducerId);

    socket?.emit(
      'createWebRtcTransport',
      { consumer: true },
      ({ params }: any) => {
        // The server sends back params needed
        // to create Send Transport on the client side
        if (params.error) {
          console.log(params.error);
          return;
        }

        let consumerTransport;

        consumerTransport = device?.createRecvTransport(params);

        consumerTransport?.on(
          'connect',
          async ({ dtlsParameters }: any, callback: any) => {
            try {
              // Signal local DTLS parameters to the server side transport
              // see server's socket.on('transport-recv-connect', ...)
              await socket?.emit('transport-recv-connect', {
                dtlsParameters,
                serverConsumerTransportId: params.id,
              });

              // Tell the transport that parameters were transmitted.
              callback();
            } catch (error: any) {
              // Tell the transport that something was wrong
              console.log(error);
            }
          },
        );

        connectRecvTransport(consumerTransport, remoteProducerId, params.id);
      },
    );
  };

  const getProducers = (device: any) => {
    socket?.emit('getProducers', (producerIds: string[]) => {
      console.log(producerIds);

      producerIds.forEach((v) => signalNewConsumerTransport(v[0], device));
    });
  };

  const createSendTransport = useCallback(
    (device: any) => {
      let newProducerTransport;
      socket?.emit(
        'createWebRtcTransport',
        { consumer: false },
        ({ params }: { params: any }) => {
          // if (params?.error) {
          //   console.log(params.error);
          //   return;
          // }
          if (!socket) return;
          // creates a new WebRTC Transport to send media
          // based on the server's producer transport params
          // https://mediasoup.org/documentation/v3/mediasoup-client/api/#TransportOptions
          newProducerTransport = device?.createSendTransport(params);
          setProducerTransport(newProducerTransport);

          newProducerTransport.on(
            'connect',
            async ({ dtlsParameters }: any, callback: any) => {
              try {
                console.log('c', dtlsParameters);
                // Signal local DTLS parameters to the server side transport
                // see server's socket.on('transport-connect', ...)
                await socket.emit('transport-connect', {
                  dtlsParameters,
                });

                // Tell the transport that parameters were transmitted.
                callback();
              } catch (error) {
                return error;
              }
            },
          );

          newProducerTransport.on(
            'produce',
            async (
              parameters: any,
              callback: ({ id }: { id: string }) => void,
            ) => {
              try {
                // tell the server to create a Producer
                // with the following parameters and produce
                // and expect back a server side producer id
                // see server's socket.on('transport-produce', ...)
                await socket?.emit(
                  'transport-produce',
                  {
                    kind: parameters.kind,
                    rtpParameters: parameters.rtpParameters,
                    appData: parameters.appData,
                  },
                  ({ id, isProducer }: { id: string; isProducer: boolean }) => {
                    callback({ id });
                    console.log(isProducer);
                    if (isProducer) getProducers(device);
                  },
                );
              } catch (error) {
                // errback(error);
              }
            },
          );
          connectSendTransport(newProducerTransport);
        },
      );
    },
    [socket, device],
  );

  const connectSendTransport = useCallback(
    async (newProducerTransport: any) => {
      // we now call produce() to instruct the producer transport
      // to send media to the Router
      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#transport-produce
      // this action will trigger the 'connect' and 'produce' events above
      console.log('ac');

      const audioProducer = await newProducerTransport.produce(audioParams);
      const videoProducer = await newProducerTransport.produce(videoParams);

      audioProducer.on('trackended', () => {
        console.log('audio track ended');

        // close audio track
      });

      audioProducer.on('transportclose', () => {
        console.log('audio transport ended');

        // close audio track
      });

      videoProducer.on('trackended', () => {
        console.log('video track ended');

        // close video track
      });

      videoProducer.on('transportclose', () => {
        console.log('video transport ended');

        // close video track
      });
    },
    [audioParams, videoParams],
  );

  const onVideo = async () => {
    const stream = await getUserStram();
    setMyStream(stream);

    setAudioParams({ track: stream.getAudioTracks()[0], ...audioParams });
    setVideoParams({ track: stream.getVideoTracks()[0], ...videoParams });
  };

  const connectRecvTransport = async (
    consumerTransport: any,
    remoteProducerId: any,
    serverConsumerTransportId: any,
  ) => {
    console.log(consumerTransport);
    // console.log(consumerTransport, remoteProducerId, serverConsumerTransportId);
    // for consumer, we need to tell the server first
    // to create a consumer based on the rtpCapabilities and consume
    // if the router can consume, it will send back a set of params as below
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

        socket.on('joinRoom', (rtpCapabilities) => {
          setRtpCapabilities(rtpCapabilities);
          createDevice(rtpCapabilities);
        });
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

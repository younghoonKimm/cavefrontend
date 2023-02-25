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
  const newConnectionRef = useRef<RTCPeerConnection>();
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

        console.log(sdp);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (stream) {
          if (!newConnectionRef.current) return;
          if (localVideoRef.current) localVideoRef.current.srcObject = stream;

          // 자신의 video, audio track을 모두 자신의 RTCPeerConnection에 등록한다.
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

      /* use the stream */
    } catch (err) {
      /* handle the error */
    }

    // navigator.mediaDevices
    //   .getUserMedia({
    //     video: true,
    //     audio: true,
    //   })
    //   .then((stream) => {
    //     if (localVideoRef.current) localVideoRef.current.srcObject = stream;

    //     // 자신의 video, audio track을 모두 자신의 RTCPeerConnection에 등록한다.
    //     stream.getTracks().forEach((track) => {
    //       newConnection.addTrack(track, stream);
    //     });

    //     newConnection.onicecandidate = (e) => {
    //       if (e.candidate) {
    //         socket?.emit('candidate', e.candidate);
    //       }
    //     };
    //     newConnection.oniceconnectionstatechange = (e) => {
    //       console.log(e);
    //     };

    //     // newConnection.ontrack = (ev) => {
    //     //   console.log('add remotetrack success');
    //     //   if (remoteVideoRef.current)
    //     //     remoteVideoRef.current.srcObject = ev.streams[0];
    //     // };
    //   })
    //   .then(() => fn())
    //   .catch((error) => {
    //     console.log(`getUserMedia error: ${error}`);
    //   });
  }, [newConnectionRef, socket]);

  return { newConnectionRef, onJoined, localVideoRef };
}

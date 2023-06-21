import { useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

const socketBaseUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

export const sockets: { [key: string]: Socket } = {};

export const createSocketConference = (conference: string) => {
  sockets[conference] = io(`${socketBaseUrl}/ws-${conference}`, {
    transports: ['websocket'],
  });
};

const useSocket = (conference: string): [Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (conference && sockets[conference]) {
      sockets[conference].disconnect();
      delete sockets[conference];
    }
  }, [conference]);

  if (!conference) {
    return [undefined, disconnect];
  }

  if (!sockets[conference]) {
    sockets[conference] = io(`${socketBaseUrl}/ws-${conference}`, {
      transports: ['websocket'],
    });
  }

  return [sockets[conference], disconnect];
};

// const useSocket = (conference?: string): [Socket | undefined, () => void] => {
//   const disconnect = useCallback(() => {
//     if (conference && sockets[conference]) {
//       sockets[conference].disconnect();
//       delete sockets[conference];
//     }
//   }, [conference]);

//   if (!conference) {
//     return [undefined, disconnect];
//   }

//   if (!sockets[conference]) {
//     sockets[conference] = io(`${socketBaseUrl}/ws-${conference}`, {
//       transports: ['websocket'],
//     });
//   }

//   return [sockets[conference], disconnect];
// };

export default useSocket;

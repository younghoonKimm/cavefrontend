import { useCallback } from 'react';
import socketIOClient, { Socket } from 'socket.io-client';

const socketBaseUrl = process.env.NEXT_PUBLIC_URL;

const sockets: { [key: string]: Socket } = {};
const useSocket = (conference?: string): [Socket | undefined, () => void] => {
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
    sockets[conference] = socketIOClient(`${socketBaseUrl}/ws-${conference}`, {
      transports: ['websocket'],
    });
    console.info('create socket', conference, sockets[conference]);
  }

  return [sockets[conference], disconnect];
};

export default useSocket;

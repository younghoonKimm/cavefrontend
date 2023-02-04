import { getProfileAPI } from '@/api/auth';
import useAuth from '@/hooks/useAuth';
import useSocket from '@/hooks/useSocket';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { QUERYKEY_USER } from 'constants/queryKeys';
import { GetServerSideProps, NextPage } from 'next';
import React, { useCallback, useEffect, useState } from 'react';

const ConferenceDetail: NextPage = () => {
  const [socket, disconnect] = useSocket('1');
  const { user, clearUserQuery } = useAuth();
  const [mes, setMes] = useState<any>('');

  useEffect(() => {
    if (user) {
      socket?.on('messaged', (data) => {
        setMes(data);
      });
      return () => {
        socket?.off('messaged', (data) => setMes(data));
      };
    }
  }, [socket, mes, user]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const onSubmit = useCallback(() => {
    socket?.emit('message', mes);
  }, [socket, mes]);

  console.log('isRender');

  return (
    <div>
      <button type="button" onClick={() => onSubmit()}>
        <span>webs</span>
      </button>

      <textarea value={mes} onChange={(e) => setMes(e.target.value)} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const queryClient = new QueryClient();

  const accessToken = req.cookies['CAV_ACC'];

  if (accessToken) {
    await queryClient.prefetchQuery([QUERYKEY_USER], getProfileAPI);
  }

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
};

export default ConferenceDetail;

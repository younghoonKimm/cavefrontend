import { getNewTokenAPI, getProfileAPI } from '@/api/auth/auth';
import axiosInstance from '@/api/axios';
import Layout from '@/components/templates/Layout/Layout';
import useAuth, { getMe } from '@/hooks/api/useAuth';
import useSocket, { createSocketConference } from '@/hooks/useSocket';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { QUERYKEY_USER } from 'constants/queryKeys';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';

const ConferenceDetail: NextPage = () => {
  const router = useRouter();
  // const { workspace } = useParams<{ workspace: string }>();
  const { id } = router.query;
  const { user } = useAuth();
  const [socket, disconnect] = useSocket(user?.id);
  const [mes, setMes] = useState<any>('');

  useEffect(() => {
    // socket?.emit('s', {
    //   id: 'socket' + Math.random(),
    //   conferences: ['sub', '1'],
    // });
  }, [socket]);

  useEffect(() => {
    if (user) {
      socket?.on('messaged', (data) => {
        setMes(data);
      });
      return () => {
        socket?.off('messaged', (data) => setMes(data));
      };
    }
  }, [socket, user]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const onSubmit = useCallback(() => {
    socket?.emit('message', mes);
  }, [socket, mes]);

  return (
    <Layout>
      <div>
        <button type="button" onClick={() => onSubmit()}>
          <span>webs</span>
        </button>

        <textarea value={mes} onChange={(e) => setMes(e.target.value)} />
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  const queryClient = new QueryClient();
  const { CAV_ACC } = req.cookies;
  const { cookie } = req.headers;

  const id = params?.id as string;

  if (cookie && CAV_ACC) {
    try {
      axiosInstance.defaults.headers.cookie = cookie;
      axiosInstance.defaults.baseURL = 'http://backend:3001/api';
      const { headers, data: token } = await getNewTokenAPI();

      if (headers['set-cookie']) {
        res.setHeader('set-cookie', headers['set-cookie']);
        axiosInstance.defaults.headers.cookie = `CAV_RFS=${token.refreshToken}; CAV_ACC=${token.accessToken}`;
        await queryClient.prefetchQuery([QUERYKEY_USER], () => getMe(), {
          staleTime: 900,
        });

        createSocketConference(id);
      }
    } catch (e) {
    } finally {
      axiosInstance.defaults.headers.cookie = '';
    }
  }

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  };
};

export default ConferenceDetail;

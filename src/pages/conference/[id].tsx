import { getNewTokenAPI, getProfileAPI } from '@/api/auth/auth';
import axiosInstance from '@/api/axios';
import Layout from '@/components/templates/Layout/Layout';
import useAuth, { getMe } from '@/hooks/api/useAuth';
import useSocket from '@/hooks/useSocket';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { QUERYKEY_USER } from 'constants/queryKeys';
import { GetServerSideProps, NextPage } from 'next';
import React, { useCallback, useEffect, useState } from 'react';

const ConferenceDetail: NextPage = () => {
  const [socket, disconnect] = useSocket('1');

  const [mes, setMes] = useState<any>('');

  // useEffect(() => {
  //   if (user) {
  //     socket?.on('messaged', (data) => {
  //       setMes(data);
  //     });
  //     return () => {
  //       socket?.off('messaged', (data) => setMes(data));
  //     };
  //   }
  // }, [socket, mes, user]);

  // useEffect(() => {
  //   return () => {
  //     disconnect();
  //   };
  // }, [disconnect]);

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

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   const queryClient = new QueryClient();
//   const { CAV_ACC } = req.cookies;
//   const { cookie } = req.headers;

//   if (cookie && CAV_ACC) {
//     try {
//       axiosInstance.defaults.headers.cookie = cookie;
//       axiosInstance.defaults.baseURL = 'http://backend:3001/api';
//       const { headers, data: token } = await getNewTokenAPI();

//       if (headers['set-cookie']) {
//         res.setHeader('set-cookie', headers['set-cookie']);
//         axiosInstance.defaults.headers.cookie = `CAV_RFS=${token.refreshToken}; CAV_ACC=${token.accessToken}`;
//         await queryClient.prefetchQuery([QUERYKEY_USER], () => getMe(), {
//           staleTime: 900,
//         });
//       }
//     } catch (e) {
//     } finally {
//       axiosInstance.defaults.headers.cookie = '';
//     }
//   }

//   return {
//     props: { dehydratedState: dehydrate(queryClient) },
//   };
// };

export default ConferenceDetail;
